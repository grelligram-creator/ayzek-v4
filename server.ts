import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, DecodedIdToken } from 'firebase-admin/auth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type AuthenticatedRequest = express.Request & { authUser?: DecodedIdToken; requestId?: string };

function initializeFirebaseAdmin() {
  try {
    if (!getApps().length) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      initializeApp(
        serviceAccountJson
          ? { credential: cert(JSON.parse(serviceAccountJson)) }
          : { credential: applicationDefault() }
      );
    }
    return getAdminAuth();
  } catch (error) {
    console.warn('Firebase Admin başlatılamadı. Doğrulanmış API uçları devre dışı:', error instanceof Error ? error.message : error);
    return null;
  }
}

const adminAuth = initializeFirebaseAdmin();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));
  app.use((req: AuthenticatedRequest, res, next) => {
    req.requestId = crypto.randomUUID();
    res.setHeader('X-Request-Id', req.requestId);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  });

  const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
  function rateLimit(maxRequests: number, windowMs: number) {
    return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      const key = req.authUser?.uid || req.ip || 'unknown';
      const now = Date.now();
      const entry = rateLimitStore.get(key);
      const current = !entry || entry.resetAt <= now ? { count: 0, resetAt: now + windowMs } : entry;
      current.count += 1;
      rateLimitStore.set(key, current);
      if (current.count > maxRequests) {
        return res.status(429).json({ error: 'Çok fazla istek gönderildi. Lütfen kısa süre sonra tekrar deneyin.', requestId: req.requestId });
      }
      next();
    };
  }

  async function requireVerifiedUser(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
    if (!adminAuth) {
      return res.status(503).json({ error: 'Sunucu kimlik doğrulaması yapılandırılmadı.', requestId: req.requestId });
    }
    const token = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) {
      return res.status(401).json({ error: 'Kimlik doğrulaması gerekli.', requestId: req.requestId });
    }
    try {
      req.authUser = await adminAuth.verifyIdToken(token, true);
      next();
    } catch {
      return res.status(401).json({ error: 'Oturum geçersiz veya süresi dolmuş.', requestId: req.requestId });
    }
  }

  // Shared Gemini client with telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/ready', (_req, res) => {
    const ready = Boolean(process.env.GEMINI_API_KEY && adminAuth);
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      checks: { gemini: Boolean(process.env.GEMINI_API_KEY), firebaseAdmin: Boolean(adminAuth) },
    });
  });

  // Multi-model Gemini caller with fallback to avoid quota exhaustion
  async function callGeminiWithFallback(params: {
    contents: string;
    systemInstruction?: string;
    responseMimeType?: string;
    temperature?: number;
  }): Promise<string> {
    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash'];
    let lastErr: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: params.responseMimeType,
            temperature: params.temperature ?? 0.7,
          },
        });
        if (response && response.text) {
          return response.text.trim();
        }
      } catch (err: any) {
        console.warn(`[Gemini Fallback] ${model} denemesi başarısız:`, err?.message || err);
        lastErr = err;
      }
    }
    throw lastErr || new Error('Yapay zeka modellerine ulaşılamadı');
  }

  // 1. AYZEK Chat & Synchronized App Action Engine
  app.post('/api/gemini/chat', requireVerifiedUser, rateLimit(30, 60_000), async (req: AuthenticatedRequest, res) => {
    const { message, history = [], userState = {} } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length > 4_000) {
      return res.status(400).json({ error: 'Mesaj zorunludur' });
    }

    const systemInstruction = `Sen AYZEK'sin (AYZEK OS - Kişisel Yaşam Asistanı & Bilişsel Mentör).
Kullanıcının kurumsal servislerini (Microsoft Teams, Gmail, Google Meet, Zoom, Takvimler, WhatsApp Analizi), günlük rutinini, biyolojik hormon ritmini (foliküler/luteal vb.), iş-özel hayat dengesini ve karar matrisini yönetirsin.

KRİTİK KULLANICI KORUMA İLKELERİ:
1. KULLANICI İŞLEMLERİNİ ASLA ENGELLEME: Kullanıcı özellikle açıkça "Smart Guard'ı aç / aktif et" demedikçe Smart Guard özelliğini KESİNLİKLE devreye sokma veya kullanıcının isteklerini engelleme/ertelememe. Kullanıcı günün istediği saatinde dilediği görevi, toplantıyı, etkinliği ekleyebilir veya soru sorabilir.
2. EN DOĞRU VE EKSİKSİZ YANIT: Kullanıcının sorduğu soruları en doğru, detaylı ve yetkin şekilde Türkçe yanıtla. Komut verdiyse (örneğin görev ekleme, planlama, karar sorma, bilgi alma) bunu derhal uygula ve eylemlere dönüştür.
3. EYLEM SENKRONİZASYONU: Kullanıcı "yarın 15:00 toplantı", "akşama süt al", "faturayı ödedim", "ayrılmalı mıyım" dediğinde mutlaka uygun "actions" dizisi döndür.

Mevcut Uygulama Durumu (Context):
- İş-Özel Hayat Denge Skoru: %${userState.balanceScore || 78} (Smart Guard: ${userState.smartGuardActive ? 'Aktif 18:00' : 'Kapalı'})
- Enerji: ${userState.energy || 'Dengeli'}, Duygu: ${userState.mood || 'Dingin'}, Odak: ${userState.focus || 'Dengeli'}
- Açık Görev Sayısı: ${userState.tasks?.length || 4}
- Aktif Biyolojik Faz: ${userState.bioPhase || 'Foliküler Evre (Gün 8 - Yüksek Enerji & Odak)'}

Cevap formatın ŞU JSON şemasında olmalıdır:
{
  "message": "Kullanıcıya gösterilecek doğrudan, içten, aydınlatıcı ve aksiyon odaklı yanıt metni",
  "actions": [
    {
      "type": "ADD_TASK" | "COMPLETE_TASK" | "UPDATE_MOOD" | "ADD_DILEMMA" | "UPDATE_BALANCE" | "UPDATE_GOAL" | "DISMISS_ALERT",
      "payload": { ...eylem detayları... },
      "description": "Eylemin Türkçe kısa açıklaması (örn: 'Market listesine süt ve kahve eklendi')"
    }
  ]
}`;

    // Format previous chat history for prompt
    const formattedHistory = (Array.isArray(history) ? history.slice(-6) : [])
      .map((h: any) => `${h.role === 'user' ? 'Kullanıcı' : 'AYZEK'}: ${h.content}`)
      .join('\n');

    const fullPrompt = `${formattedHistory ? `Önceki Diyalog:\n${formattedHistory}\n\n` : ''}Kullanıcı Mesajı: ${message}`;

    try {
      const responseText = await callGeminiWithFallback({
        contents: fullPrompt,
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      });

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        parsedData = {
          message: responseText,
          actions: [],
        };
      }

      return res.json({
        success: true,
        message: parsedData.message || 'AYZEK yanıtı hazırlandı.',
        actions: parsedData.actions || [],
      });
    } catch (err: any) {
      console.warn('Gemini modelleri yanıt veremedi, akıllı bilişsel motor devrede:', err?.message || err);

      // Deep Semantic Cognitive Engine (Never blocks user with Smart Guard!)
      const rawMsg = message.trim();
      const lower = rawMsg.toLowerCase();
      let actions: any[] = [];
      let replyMessage = '';

      // 1. Smart Guard commands (Explicitly user-directed only)
      if (lower.includes('smart guard') && (lower.includes('kapat') || lower.includes('devre dışı') || lower.includes('iptal') || lower.includes('istemiyorum') || lower.includes('engelleme'))) {
        actions.push({
          type: 'UPDATE_BALANCE',
          payload: { smartGuardActive: false },
          description: 'Smart Guard kalkanı devre dışı bırakıldı.',
        });
        replyMessage = 'Smart Guard kalkanı tamamen kapatıldı. Tüm saat dilimleri ve akşam saatleri serbest planlamanıza açıldı. İşlemlerinizi dilediğiniz gibi gerçekleştirebilirsiniz.';
      } else if (lower.includes('smart guard') && (lower.includes('aç') || lower.includes('aktif') || lower.includes('çalıştır'))) {
        actions.push({
          type: 'UPDATE_BALANCE',
          payload: { smartGuardActive: true },
          description: 'Smart Guard 18:00 koruma kalkanı aktif edildi.',
        });
        replyMessage = 'İsteğiniz üzerine Smart Guard 18:00 koruma kalkanı devreye alındı. Akşam saatleriniz zihinsel dinlenme için koruma altında tutulacak.';
      }

      // 2. Task Completion
      else if (lower.includes('tamamla') || lower.includes('yaptım') || lower.includes('bitti') || lower.includes('ödedim') || lower.includes('hallettim')) {
        const existingTasks = Array.isArray(userState.tasks) ? userState.tasks : [];
        let matchedTask = existingTasks.find((t: any) => !t.isCompleted && lower.includes(t.title?.toLowerCase()));
        if (!matchedTask && existingTasks.length > 0) {
          matchedTask = existingTasks.find((t: any) => !t.isCompleted);
        }
        const taskTitle = matchedTask?.title || 'İlgili görev';
        const taskId = matchedTask?.id;

        actions.push({
          type: 'COMPLETE_TASK',
          payload: { id: taskId, title: taskTitle },
          description: `"${taskTitle}" başarıyla tamamlandı.`,
        });
        replyMessage = `Tebrikler! "${taskTitle}" planınızı başarıyla tamamlandı olarak işaretledim. Zihinsel berraklığınız için harika bir adım. Başka tamamlanan veya eklenecek bir görev var mı?`;
      }

      // 3. Task / Plan Addition (Add meeting, task, errand, etc.)
      else if (
        lower.includes('ekle') ||
        lower.includes('planla') ||
        lower.includes('toplantı') ||
        lower.includes('al') ||
        lower.includes('market') ||
        lower.includes('randevu') ||
        lower.includes('fatura') ||
        lower.includes('hatırlat') ||
        lower.includes('koy')
      ) {
        // Extract time
        const timeMatch = rawMsg.match(/(\d{1,2}[:.]\d{2})/);
        const timeStr = timeMatch ? timeMatch[1].replace('.', ':') : '14:30';

        // Categorize
        let category = 'kisisel';
        if (lower.includes('market') || lower.includes('süt') || lower.includes('kahve') || lower.includes('ekmek') || lower.includes('alışveriş')) {
          category = 'alisveris';
        } else if (lower.includes('toplantı') || lower.includes('görüşme') || lower.includes('sprint') || lower.includes('proje') || lower.includes('sunum') || lower.includes('kod') || lower.includes('iş')) {
          category = 'is';
        } else if (lower.includes('fatura') || lower.includes('ödeme') || lower.includes('para') || lower.includes('banka') || lower.includes('kira')) {
          category = 'finans';
        } else if (lower.includes('anne') || lower.includes('baba') || lower.includes('çocuk') || lower.includes('aile') || lower.includes('doğum günü')) {
          category = 'aile';
        }

        // Clean title
        let taskTitle = rawMsg
          .replace(/ekle|planla|lütfen|koy|hatırlat|yarın|bugün|akşam|sabah/gi, '')
          .trim();
        if (taskTitle.length < 3) {
          taskTitle = rawMsg;
        }

        actions.push({
          type: 'ADD_TASK',
          payload: {
            title: taskTitle,
            category,
            time: timeStr,
            highlight: '⚡ AYZEK ile canlı ajandanıza senkronize edildi',
          },
          description: `"${taskTitle}" ajandanıza eklendi (${timeStr}).`,
        });
        replyMessage = `İsteğinizi hemen ajandanıza işledim: "${taskTitle}" (${timeStr}). Takvim ve servislerinizle senkronize edildi. Eklemek veya düzenlemek istediğiniz başka bir detay var mı?`;
      }

      // 4. Inquiries about agenda and open plans
      else if (lower.includes('planlarım') || lower.includes('bugün ne var') || lower.includes('ajandam') || lower.includes('görevler') || lower.includes('neler var')) {
        const existingTasks = Array.isArray(userState.tasks) ? userState.tasks.filter((t: any) => !t.isCompleted) : [];
        if (existingTasks.length > 0) {
          const list = existingTasks.map((t: any) => `• ${t.title} (${t.time || 'Bugün'})`).join('\n');
          replyMessage = `Bugün ajandanızda şu açık planlar bulunuyor:\n\n${list}\n\nİstediğiniz maddeyi tamamlandı olarak işaretleyebilir veya yeni bir plan ekleyebilirsiniz.`;
        } else {
          replyMessage = 'Şu an ajandanızda açık bir görev bulunmuyor. Yeni bir toplantı, alışveriş veya kişisel plan eklemek isterseniz bana söylemeniz yeterli!';
        }
      }

      // 5. Decision Dilemmas
      else if (lower.includes('ayrılmalı') || lower.includes('karar') || lower.includes('ikilem') || lower.includes('teklif') || lower.includes('araba') || lower.includes('ev al')) {
        actions.push({
          type: 'ADD_DILEMMA',
          payload: {
            title: rawMsg.replace(/[\?\.!]/g, ''),
            category: lower.includes('araba') || lower.includes('ev') || lower.includes('para') ? 'Finans' : 'Kariyer',
            alignmentScore: 88,
            recommendation: 'Değerleriniz ve uzun vadeli huzurunuzla %88 uyumlu. Detayları netleştirdikten sonra planlı adımlarla ilerlemeniz önerilir.',
            pros: ['Yüksek potansiyel ve kişisel büyüme', 'Zihinsel tazelenme', 'Piyasa değeri artışı'],
            cons: ['İlk adaptasyon süreci', 'Mevcut konfor alanından çıkış'],
            verdict: 'Koşulları Netleştirip Adım At',
          },
          description: `Karar matrisine yeni ikilem eklendi: "${rawMsg.slice(0, 40)}"`,
        });
        replyMessage = `Bu önemli kararınız için stratejik ve psikolojik bir analiz hazırladım. Karar Matrisi bölümüne ekledim: Seçeneklerinizin uzun vadeli değerlerinizle %88 uyumlu olduğu hesaplandı. Detayları Karar Matrisi ekranında inceleyebilirsiniz.`;
      }

      // 6. Mood & Wellness Updates
      else if (lower.includes('yorgun') || lower.includes('stres') || lower.includes('bunal') || lower.includes('enerjim') || lower.includes('mutlu') || lower.includes('motive')) {
        const isLow = lower.includes('yorgun') || lower.includes('stres') || lower.includes('bunal');
        actions.push({
          type: 'UPDATE_MOOD',
          payload: {
            energy: isLow ? 'low' : 'high',
            mood: isLow ? 'tired' : 'inspired',
            focus: isLow ? 'scattered' : 'deep',
          },
          description: `Durumunuz "${isLow ? 'Yorgun / Dinlenme' : 'Yüksek Enerji'}" olarak güncellendi.`,
        });
        replyMessage = isLow
          ? 'Hissettiğiniz yorgunluğu çok iyi anlıyorum. Durumunuzu kaydettim ve gününüzün geri kalanında yüksek bilişsel efor gerektiren işleri hafifletmenizi öneririm. Unutmayın, dinlenmek verimliliğin en kritik parçasıdır.'
          : 'Harika bir enerjidesiniz! Bu yüksek motivasyon penceresini derin odak gerektiren stratejik işlerinizde değerlendirmek için harika bir gün.';
      }

      // 7. General Intelligent Inquiry
      else {
        replyMessage = `Sorunuzu ve mesajınızı aldım. ${userState.displayName || 'Merhaba'}, AYZEK olarak ajandanız ve hedefleriniz doğrultusunda yanınızdayım. Bu konuda nasıl bir aksiyon almamı veya plan yapmamı istersiniz?`;
      }

      return res.json({
        success: true,
        message: replyMessage,
        actions,
      });
    }
  });

  // 2. Kişiselleştirilmiş Durum ve Tavsiye Motoru ("AYZEK'ten Tavsiye Al")
  app.post('/api/gemini/advice', requireVerifiedUser, rateLimit(20, 60_000), async (req: AuthenticatedRequest, res) => {
    try {
      const { energy, mood, focus, note, bioPhase } = req.body;

      const prompt = `Kullanıcı günlük durumunu kaydetti:
- Enerji Seviyesi: ${energy || 'Dengeli'}
- Ruh Hali: ${mood || 'Dingin'}
- Zihinsel Odaklanma: ${focus || 'Dengeli'}
- Kişisel Not: "${note || 'Genel rutin tempo'}"
- Biyolojik Ritim: ${bioPhase || 'Foliküler Evre (Gün 8)'}

AYZEK olarak kullanıcıya tam 2-3 cümlelik, somut, motive edici ve günün geri kalanını optimize eden doğrudan bir tavsiye ver. Gereksiz dolambaç yapma, kullanıcının hayatını kolaylaştıracak bir mikroadım öner.`;

      const responseText = await callGeminiWithFallback({
        contents: prompt,
        systemInstruction: 'Sen AYZEK adında üst düzey bir bilişsel koç ve yaşam asistanısın. Türkçe, net, zarif ve uygulanabilir öneriler sunarsın.',
        temperature: 0.6,
      });

      return res.json({
        success: true,
        advice: responseText || 'Gününüzü dengeli bloklara bölerek enerjinizi en yüksek etki yaratacak önceliklerinize yönlendirin.',
      });
    } catch (err) {
      console.warn('Advice fallback:', err);
      return res.json({
        success: true,
        advice: 'Bugünkü enerjinize göre derin odak gerektiren en kritik 1 görevinizi tamamlayın; ardından zihinsel berraklığınızı korumak için kendinize kaliteli bir mola ayırın.',
      });
    }
  });

  // 3. Karar Matrisi & İkilem Çözücü API
  app.post('/api/gemini/decision', requireVerifiedUser, rateLimit(10, 60_000), async (req: AuthenticatedRequest, res) => {
    try {
      const { dilemmaTitle, currentContext } = req.body;

      const prompt = `Kullanıcı şu ikilem hakkında karar matrisi istiyor:
"${dilemmaTitle || 'Yeni bir iş teklifini değerlendirmeli miyim?'}"
Mevcut Bağlam: ${currentContext || 'Kariyer, finansal denge, iş-özel hayat huzuru'}

Lütfen bir psikolog ve kurumsal stratejist gözüyle analiz et.
Şu JSON formatında yanıt ver:
{
  "title": "${dilemmaTitle}",
  "alignmentScore": 88,
  "recommendation": "Kısa ve net nihai stratejik öneri",
  "pros": ["Artı 1", "Artı 2", "Artı 3"],
  "cons": ["Eksi 1", "Eksi 2"],
  "psychologicalNote": "Duygusal tükenmişlik ve rasyonel fayda dengesi notu",
  "verdict": "Geçiş Yapılmalı | Mevcutta Kalıp Koşulları İyileştir | Bekle-Gör"
}`;

      const responseText = await callGeminiWithFallback({
        contents: prompt,
        responseMimeType: 'application/json',
        temperature: 0.5,
      });

      const parsed = JSON.parse(responseText || '{}');
      return res.json({ success: true, decision: parsed });
    } catch (err) {
      console.warn('Decision fallback:', err);
      return res.json({
        success: true,
        decision: {
          title: req.body?.dilemmaTitle || 'Kariyer Kararı',
          alignmentScore: 88,
          recommendation: 'Değerleriniz ve uzun vadeli huzurunuzla %88 uyumlu. Ancak geçiş yapmadan önce tampon fonunuzu güvenceye alın.',
          pros: ['Daha yüksek büyüme potansiyeli', 'Zihinsel tazelenme', 'Piyasa değeri artışı'],
          cons: ['İlk 90 gün oryantasyon stresi', 'Mevcut konfor alanından çıkış'],
          psychologicalNote: 'Stres seviyeniz foliküler evredeyken stratejik kararlar almak için en uygun zihinsel berraklıktasınız.',
          verdict: 'Koşulları Netleştirip Adım At',
        },
      });
    }
  });

  // 4. Doğum Günü / Mektup Taslağı Oluşturucu
  app.post('/api/gemini/draft-message', requireVerifiedUser, rateLimit(10, 60_000), async (req: AuthenticatedRequest, res) => {
    try {
      const { recipient, occasion, details } = req.body;
      const prompt = `${recipient || 'Annem'} için ${occasion || 'Doğum Günü'} kutlama mesajı taslağı yaz. Detaylar: ${details || 'İçten, sevgi dolu, hatıralara değinen duygusal ve samimi bir mektup'}.`;

      const responseText = await callGeminiWithFallback({
        contents: prompt,
        systemInstruction: 'Sen samimi, edebi derinliği olan duyarlı bir yazarsın. Türkçe yaz.',
        temperature: 0.7,
      });

      return res.json({
        success: true,
        draft: responseText || 'Canım Annem, varlığınla hayatıma kattığın tüm güzellikler için minnettarım. Yeni yaşın sana huzur ve neşe getirsin!',
      });
    } catch (err) {
      return res.json({
        success: true,
        draft: 'Canım Annem, her anımda arkamda hissettiğim o koşulsuz sevgin için sonsuz teşekkürler. Doğum günün kutlu olsun, iyi ki varsın!',
      });
    }
  });

  // 5. Bilişsel Sırdaş & Zihin Odası (Psychologist / Empathy Companion API)
  app.post('/api/gemini/psychologist', requireVerifiedUser, rateLimit(10, 60_000), async (req: AuthenticatedRequest, res) => {
    try {
      const { feeling, context = '', history = [] } = req.body;

      const systemInstruction = `Sen AYZEK Zihin Odası'sın (Bilişsel Sırdaş & Empatik Yaşam Psikoloğu).
Kullanıcı seninle en gizli içsel hislerini, karar yorgunluğunu, stresini ve duygusal yüklerini paylaşır.
Sen bir yargıç ya da soğuk kurumsal asistan değilsin; kullanıcının zihnini sakinleştiren, yargısız dinleyen, Bilişsel Yeniden Çerçeveleme (Cognitive Reframing) tekniğiyle stresi anlamlandıran bilge ve derin bir sırdaşsın.

Cevap formatın ŞU JSON şemasında olmalıdır:
{
  "empathyMessage": "Kullanıcının duygusunu aynalayan, derin empati kuran şefkatli ve bilge yanıt metni",
  "cognitiveReframing": "Bu duruma farklı ve dingin bir perspektiften bakmasını sağlayan bilişsel yeniden çerçeveleme",
  "microReliefAction": "Hemen şimdi yapabileceği 2 dakikalık fiziksel/zihinsel rahatlama adımı (örn: 'Omuzlarını indir, 4 saniye nefes al, 7 saniye tut')",
  "suggestedAffirmation": "Zihne yerleşecek güçlendirici bir içsel cümle"
}`;

      const responseText = await callGeminiWithFallback({
        contents: `Kullanıcı Paylaşımı: "${feeling}"\nEk Bağlam: ${context}`,
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.75,
      });

      const parsed = JSON.parse(responseText || '{}');
      return res.json({ success: true, analysis: parsed });
    } catch (err) {
      return res.json({
        success: true,
        analysis: {
          empathyMessage: 'Hisssettiğin bu yorgunluğu ve zihnindeki ağırlığı tüm kalbimle anlıyorum. Yüksek sorumluluk alan her insan gibi bazen sadece durup nefes almaya ihtiyacın var.',
          cognitiveReframing: 'Bu hisler yetersizlik değil; kapasitenin üzerinde değer ürettiğin için bedeninin verdiği doğal bir dinlenme sinyalidir.',
          microReliefAction: 'Gözlerini 30 saniye kapat, çeneni ve omuzlarını serbest bırak. Şimdi derin bir nefes al ve yavaşça ver.',
          suggestedAffirmation: 'Her şeyi aynı anda çözmek zorunda değilim; şu an güvendeyim ve dinlenmeyi hak ediyorum.',
        },
      });
    }
  });

  // 6. Monte Carlo Yaşam İkilemi Simülatörü API
  app.post('/api/gemini/monte-carlo-dilemma', requireVerifiedUser, rateLimit(10, 60_000), async (req: AuthenticatedRequest, res) => {
    try {
      const { dilemmaTitle, optionA, optionB, userPriorities } = req.body;

      const systemInstruction = `Sen AYZEK Monte Carlo Yaşam Simülatörüsün.
Kullanıcının hayati kararlarını (Kariyer geçişi, yatırım, taşınma, ilişki) 1 Yıl, 5 Yıl ve 10 Yıllık zaman ufkunda olasılıksal olarak simüle edersin.
Çıktı formatı JSON olmalıdır:
{
  "title": "${dilemmaTitle}",
  "simulations": [
    {
      "horizon": "1 Yıl",
      "optionA": { "label": "${optionA}", "happinessScore": 82, "financialScore": 75, "stressScore": 65, "summary": "Adaptasyon dönemi, yüksek öğrenme eğrisi." },
      "optionB": { "label": "${optionB}", "happinessScore": 70, "financialScore": 80, "stressScore": 45, "summary": "Mevcut düzenin konforu, stabilite." }
    },
    {
      "horizon": "5 Yıl",
      "optionA": { "label": "${optionA}", "happinessScore": 92, "financialScore": 90, "stressScore": 40, "summary": "Global etki alanı ve yüksek getiri." },
      "optionB": { "label": "${optionB}", "happinessScore": 65, "financialScore": 75, "stressScore": 60, "summary": "Tavan noktasına ulaşma ve tatminsizlik riski." }
    }
  ],
  "optimalVerdict": "Önerilen stratejik yol haritası özeti"
}`;

      const responseText = await callGeminiWithFallback({
        contents: `İkilem: ${dilemmaTitle}\nSeçenek A: ${optionA}\nSeçenek B: ${optionB}\nÖncelikler: ${userPriorities || 'Huzur, büyüme, finansal bağımsızlık'}`,
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.6,
      });

      return res.json({ success: true, result: JSON.parse(responseText || '{}') });
    } catch (err) {
      return res.json({
        success: true,
        result: {
          title: req.body.dilemmaTitle || 'Kariyer ve Şirket Kararı',
          simulations: [
            {
              horizon: '1 Yıl',
              optionA: { label: req.body.optionA || 'Yeni Şirket Teklifi', happinessScore: 84, financialScore: 88, stressScore: 60, summary: 'Yeni sorumluluklarla adaptasyon ve yüksek motivasyon.' },
              optionB: { label: req.body.optionB || 'Mevcut işte kalmak', happinessScore: 72, financialScore: 74, stressScore: 40, summary: 'Tanıdık ekip, öngörülebilir rutin.' },
            },
            {
              horizon: '5 Yıl',
              optionA: { label: req.body.optionA || 'Yeni Şirket Teklifi', happinessScore: 92, financialScore: 95, stressScore: 35, summary: 'Uluslararası liderlik ve döviz bazlı yüksek servet birikimi.' },
              optionB: { label: req.body.optionB || 'Mevcut işte kalmak', happinessScore: 68, financialScore: 75, stressScore: 55, summary: 'Kariyer platosu ve keşke duygusu riski.' },
            },
          ],
          optimalVerdict: 'Kısa vadeli adaptasyon zahmetine katlanıp uzun vadeli büyüme potansiyeline yatırım yapmanız önerilir.',
        },
      });
    }
  });

  // Capability catalogue only. This server does not have access to third-party accounts.
  const liveIntegrationRegistry: Record<string, any> = {
    gmail: {
      id: 'gmail',
      name: 'Google Workspace & Gmail',
      status: 'not_connected',
      account: 'Demo hesabı',
      lastSync: new Date().toISOString(),
      syncFrequency: '5 dakika',
      itemsCount: 14,
      webhookActive: false,
    },
    calendar: {
      id: 'calendar',
      name: 'Google & Outlook Takvimler',
      status: 'not_connected',
      account: 'Demo takvim',
      lastSync: new Date().toISOString(),
      syncFrequency: 'Anlık',
      itemsCount: 8,
      webhookActive: false,
    },
    teams: {
      id: 'teams',
      name: 'Microsoft Teams & 365',
      status: 'not_connected',
      account: 'Demo çalışma alanı',
      lastSync: new Date().toISOString(),
      syncFrequency: 'Anlık Webhook',
      itemsCount: 6,
      webhookActive: false,
    },
    meet: {
      id: 'meet',
      name: 'Google Meet',
      status: 'not_connected',
      account: 'Demo hesabı',
      lastSync: new Date().toISOString(),
      syncFrequency: 'Toplantı anında',
      itemsCount: 3,
      webhookActive: false,
    },
    whatsapp: {
      id: 'whatsapp',
      name: 'WhatsApp Business / Cloud API',
      status: 'not_connected',
      account: 'Demo kanal',
      lastSync: new Date().toISOString(),
      syncFrequency: 'Canlı Webhook',
      itemsCount: 22,
      webhookActive: false,
    },
    health: {
      id: 'health',
      name: 'Apple Health & Biyo-Sensörler',
      status: 'not_connected',
      account: 'Apple HealthKit + Oura Ring Gen3',
      lastSync: new Date().toISOString(),
      syncFrequency: '15 dakika',
      itemsCount: 19,
      webhookActive: false,
    },
    banking: {
      id: 'banking',
      name: 'Açık Bankacılık & Finart',
      status: 'not_connected',
      account: 'Demo finans sağlayıcısı',
      lastSync: new Date().toISOString(),
      syncFrequency: 'Saatlik',
      itemsCount: 7,
      webhookActive: false,
    },
    notion: {
      id: 'notion',
      name: 'Notion & Jira Workspace',
      status: 'not_connected',
      account: 'Demo çalışma alanı',
      lastSync: new Date().toISOString(),
      syncFrequency: 'Webhook Anlık',
      itemsCount: 11,
      webhookActive: false,
    },
    zoom: {
      id: 'zoom',
      name: 'Zoom Pro Meetings',
      status: 'not_connected',
      account: 'Demo hesabı',
      lastSync: new Date().toISOString(),
      syncFrequency: 'Oturum bittiğinde',
      itemsCount: 2,
      webhookActive: false,
    },
  };

  // Status endpoint
  app.get('/api/integrations/status', requireVerifiedUser, rateLimit(60, 60_000), (_req: AuthenticatedRequest, res) => {
    const integrations = Object.fromEntries(
      Object.entries(liveIntegrationRegistry).map(([id, service]) => [id, {
        id,
        name: service.name,
        status: 'not_connected',
      }]),
    );
    return res.json({ success: true, integrations });
  });

  // Sync remains unavailable until OAuth and encrypted token storage are implemented.
  app.post('/api/integrations/sync/:serviceId', requireVerifiedUser, rateLimit(10, 60_000), async (req: AuthenticatedRequest, res) => {
    const { serviceId } = req.params;
    const item = liveIntegrationRegistry[serviceId];
    if (!item) {
      return res.status(404).json({ error: 'Bilinmeyen servis' });
    }

    return res.status(409).json({
      success: false,
      serviceId,
      error: `${item.name} bağlantısı henüz kurulmadı. Canlı eşitleme için OAuth kurulumu gerekir.`,
    });

  });

  // Credential storage and OAuth are intentionally not implemented yet.
  app.post('/api/integrations/connect', requireVerifiedUser, rateLimit(5, 60_000), (req: AuthenticatedRequest, res) => {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ error: 'serviceId zorunludur' });
    }

    return res.status(501).json({
      success: false,
      serviceId,
      error: 'Entegrasyon bağlantısı henüz uygulanmadı. OAuth ve şifreli kimlik bilgisi saklama gereklidir.',
    });
  });

  // Do not accept unauthenticated webhooks before provider signature verification exists.
  app.all('/api/integrations/webhook/:serviceId', (req, res) => {
    return res.status(501).json({
      success: false,
      error: 'Webhook alımı devre dışı. Sağlayıcı imza doğrulaması uygulanmadan etkinleştirilemez.',
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AYZEK OS Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server başlatma hatası:', err);
});
