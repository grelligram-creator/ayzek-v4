import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import {
  X,
  Sparkles,
  Shield,
  Activity,
  Heart,
  TrendingUp,
  Brain,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Compass,
  Scale,
  Award,
  Calendar,
  Lock,
  MessageCircle,
  HelpCircle,
  Sliders,
  Check,
} from 'lucide-react';
import { VisionPillar } from '../types';

export const LifeCenterVisionModal: React.FC = () => {
  const {
    isVisionModalOpen,
    setIsVisionModalOpen,
    setActiveTab,
    setIsAssistantOpen,
    openAssistantWithQuery,
    setIsDecisionModalOpen,
    setIsSanctuaryOpen,
    setIsDraftModalOpen,
    runAutonomousScan,
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'pillars' | 'manifesto' | 'autonomy'>('pillars');
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pillar-1');
  const [autonomyLevel, setAutonomyLevel] = useState<'autonomous' | 'copilot' | 'whisper'>('copilot');

  if (!isVisionModalOpen) return null;

  const visionPillars: VisionPillar[] = [
    {
      id: 'pillar-1',
      title: '7/24 Otonom Arka Plan Nöbetçisi',
      tagline: 'Kullanıcı uygulama içinde değilken bile onun için çalışan zeka.',
      category: 'Otonom',
      badge: 'Sıfır Efor Koruma',
      problemSolved:
        'İnsanlar günlük telaşta faturaların son günlerini, toplantı çakışmalarını, trafik gecikmelerini ve tükenmişlik eşiklerini kaçırır.',
      howAyzekSolves:
        'AYZEK, uygulama kapalıyken bile bağlı kanalları (Gmail, Takvim, WhatsApp, Banka) izler; arka arkaya toplantılara otomatik 15 dk nefes tamponu ekler, geciken faturaları önceliklendirir ve eve dönüş trafiğine göre ajandanızı optimize eder.',
      impactMetrics: 'Haftalık 4.5 saat kurtarılan zaman · %100 sıfır fatura gecikme cezası',
      interactiveActionLabel: 'Otonom Taramayı Şimdi Çalıştır',
      actionQuery: 'Otonom arka plan taramasını başlat ve bugünkü tüm servislerimi denetle.',
    },
    {
      id: 'pillar-2',
      title: 'Bilişsel İkiz & Monte Carlo Karar Matrisi',
      tagline: 'Hayatın dönüm noktalarında pişmanlığı önleyen olasılıksal simülatör.',
      category: 'Bilişsel',
      badge: 'Stratejik Berraklık',
      problemSolved:
        'Kariyer değişimi, şirket kurma, ev/araba yatırımı veya ilişki kararları insanlarda derin zihinsel felç ve karar yorgunluğu yaratır.',
      howAyzekSolves:
        'Psikoloji ve strateji temelli Monte Carlo algoritmasıyla karar seçeneklerinizi 1 Yıl, 5 Yıl ve 10 Yıllık ufukta simüle eder. Duygusal bedel, finansal getiri ve uzun vadeli huzur uyumunu puanlayarak net bir yol haritası sunar.',
      impactMetrics: '%88 daha yüksek karar tatmini · 0 pişmanlık sendromu',
      interactiveActionLabel: 'Karar Matrisini Aç & İkilem Çöz',
    },
    {
      id: 'pillar-3',
      title: 'Biyo-Ritim & Kronobiyolojik Senkronizasyon',
      tagline: 'Biyolojik enerjiniz ile günlük ajandanızın kusursuz dansı.',
      category: 'Biyo-Ritim',
      badge: 'Nörolojik Uyum',
      problemSolved:
        'İnsanlar enerjilerinin en düşük olduğu saatlerde kritik sunumlara girip yıpranırlar veya yaratıcılık zirvelerinde anlamsız e-postalarla vakit kaybederler.',
      howAyzekSolves:
        'Apple Health, Oura ve hormonal döngü (foliküler/luteal fazlar, HRV, kortizol eğrisi) verilerini okur. Derin odak, yabancı dil öğrenimi ve kritik müzakereleri prefrontal korteksinizin en zinde olduğu zaman bloklarına konumlandırır.',
      impactMetrics: 'Öğleden sonra tükenmişliğinde %60 düşüş · %40 daha derin odak',
      interactiveActionLabel: 'Biyo-Ritim Durumunu İncele',
    },
    {
      id: 'pillar-4',
      title: 'Sosyal Sermaye, Vefa & İlişki Kasası',
      tagline: 'Sevdiklerinizi, verilen sözleri ve hayatın anlamını unutturmayan sırdaş.',
      category: 'İlişkiler',
      badge: 'İçten Bağlar',
      problemSolved:
        'Yoğun iş hayatında aile büyüklerinin özel günleri, verilen sözler ("kitap önereceğim", "kahve içeceğiz") ve vefa duygusu arka plana itilir.',
      howAyzekSolves:
        'WhatsApp ve mesajlaşma kanallarınızdaki empati sinyallerini tarar; annenizin doğum gününü 4 gün önceden haber verir, ona duygu dolu hatıralarla bezeli samimi bir mektup taslağı hazırlar ve dostlarınıza verdiğiniz sözleri ajandanıza işler.',
      impactMetrics: 'Kuvvetli aile bağları · Robotik olmayan gerçek duygusal temas',
      interactiveActionLabel: 'Vefa Mektup Motorunu Aç',
    },
    {
      id: 'pillar-5',
      title: 'Finansal Huzur & Bilişsel Nakit Akış Radarı',
      tagline: 'Sıfır gizli marj, net şeffaflık ve dürtüsel harcama koruması.',
      category: 'Finans',
      badge: 'Güvenli Tampon',
      problemSolved:
        'Mali sürprizler, unutulan yinelenen abonelikler ve stres anında yapılan gereksiz harcamalar zihinsel huzuru baltalar.',
      howAyzekSolves:
        'Kullanıcıya daima nihai fiyatı bildirir; hiçbir gizli marj barındırmaz. Açık Bankacılık PSD2 entegrasyonuyla yaklaşan faturaları hatırlatır, kullanılmayan SaaS lisanslarını tespit eder ve yüksek stres anlarında 24 saatlik Bilişsel Soğuma Tamponu önerir.',
      impactMetrics: 'Yıllık ortalama 9.600 TL tasarruf · 3+ aylık acil yaşam rezervi',
      interactiveActionLabel: 'Finansal Fatura Görevini Gör',
    },
    {
      id: 'pillar-6',
      title: 'Zihin Odası & Bilişsel Sırdaş (Sanctuary)',
      tagline: 'Yargısız dinleyen, lider yalnızlığını ve stresi sakinleştiren sığınak.',
      category: 'Zihin Sağlığı',
      badge: 'Duygusal Deşarj',
      problemSolved:
        'Üst düzey yöneticiler ve girişimciler hissettikleri kaygıyı, yetersizlik hissini ve karar ağırlığını çevreleriyle paylaşamazlar.',
      howAyzekSolves:
        'Bilişsel Davranışçı Terapi (CBT) ve Stoacı Düşünce ilkeleriyle donatılmış Zihin Odası; paylaştığınız stresli durumları "Bilişsel Yeniden Çerçeveleme" ile dingin bir perspektife oturtur ve 2 dakikalık mikro-rahatlama nefes pratikleri sunar.',
      impactMetrics: '3 dakikada kortizol düşüşü · %92 zihinsel berraklık bildirimi',
      interactiveActionLabel: 'Zihin Odası’na Adım At',
    },
  ];

  const currentPillar = visionPillars.find((p) => p.id === selectedPillarId) || visionPillars[0];

  const handlePillarAction = (pillar: VisionPillar) => {
    setIsVisionModalOpen(false);
    if (pillar.id === 'pillar-1') {
      runAutonomousScan();
      setActiveTab('akis');
    } else if (pillar.id === 'pillar-2') {
      setIsDecisionModalOpen(true);
    } else if (pillar.id === 'pillar-3') {
      setActiveTab('akis');
    } else if (pillar.id === 'pillar-4') {
      setIsDraftModalOpen(true);
    } else if (pillar.id === 'pillar-5') {
      setActiveTab('plan');
    } else if (pillar.id === 'pillar-6') {
      setIsSanctuaryOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all max-h-[92vh]">
        {/* Top Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-950 via-sky-950 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <AyzekLogo size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  AYZEK OS 2026: Hayatın Merkezi
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Vizyoner Mimari
                </span>
              </div>
              <p className="text-xs text-sky-200/80 mt-0.5">
                Kullanıcı yokken bile çalışan, koruyan ve yol gösteren Bilişsel Yaşam İşletim Sistemi
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisionModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold px-4">
          <button
            onClick={() => setActiveTabSection('pillars')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTabSection === 'pillars'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>6 Temel Yaşam Sütunu (Özellikler)</span>
          </button>

          <button
            onClick={() => setActiveTabSection('manifesto')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTabSection === 'manifesto'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Neden Hayatın Merkezi? (Manifesto)</span>
          </button>

          <button
            onClick={() => setActiveTabSection('autonomy')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTabSection === 'autonomy'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Otonomi & Asistan Tercihi</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: 6 PILLARS */}
          {activeTabSection === 'pillars' && (
            <div className="space-y-6">
              {/* Pillar Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {visionPillars.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPillarId(p.id)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      selectedPillarId === p.id
                        ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        {p.category}
                      </span>
                      {selectedPillarId === p.id && <Check className="w-3.5 h-3.5 text-sky-500" />}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                      {p.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Detailed Active Pillar Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{currentPillar.badge}</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{currentPillar.title}</h3>
                    <p className="text-xs text-sky-200/90 mt-1">{currentPillar.tagline}</p>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                    {currentPillar.impactMetrics}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                      Çözülen İnsani Problem:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentPillar.problemSolved}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      AYZEK Nasıl Çözüyor?
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentPillar.howAyzekSolves}
                    </p>
                  </div>
                </div>

                {/* Direct interactive trigger */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-[11px] text-slate-400">
                    Bu özellik AYZEK OS 2026 içerisinde tamamen canlı ve aktiftir.
                  </span>

                  <button
                    onClick={() => handlePillarAction(currentPillar)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>{currentPillar.interactiveActionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANIFESTO */}
          {activeTabSection === 'manifesto' && (
            <div className="space-y-5">
              <div className="p-5 rounded-3xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800 space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Neden Bir "Todo / Chatbot" Değil de "Hayatın Merkezi"?
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  2026 yılı dünyasında insanların sorunu daha fazla takvim uygulaması veya daha fazla yapay zeka sohbet robotu değildir.
                  Asıl sorun; <strong>bilgi parçalanması, karar yorgunluğu ve yalnızlıktır.</strong>
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Geleneksel uygulamalar <strong>reaktiftir</strong>: Siz açıp görev yazarsınız, siz unutursanız o da unutur.
                  AYZEK ise <strong>proaktiftir</strong>: Siz uyurken uçuşunuzu, banka faturanızı, partnerinizin mesajındaki duygu durumunu ve prefrontal korteksinizin foliküler evredeki verimliliğini sentezler.
                </p>
              </div>

              {/* Comparison table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white">
                    <tr>
                      <th className="p-3">Kriter</th>
                      <th className="p-3 text-slate-500">Klasik Uygulamalar</th>
                      <th className="p-3 text-sky-600 dark:text-sky-400">AYZEK Life OS 2026</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="p-3 font-semibold">Çalışma Mantığı</td>
                      <td className="p-3 text-slate-500">Reaktif (Yalnızca açıldığında)</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">7/24 Otonom Arka Plan Taraması</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Fiyatlandırma</td>
                      <td className="p-3 text-slate-500">Gizli komisyonlar, marjlar, ek maliyetler</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Tek ve Nihai Net Fiyat (Sıfır Gizli Kar)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Biyolojik Boyut</td>
                      <td className="p-3 text-slate-500">Yok (İnsanı makine sayar)</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Apple Health, Uyku, HRV & Foliküler Senkron</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Sosyal Vefa</td>
                      <td className="p-3 text-slate-500">Sadece tarih bildirim zili</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Anılardan üretilen içten vefa mektupları</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Zihinsel Sağlık</td>
                      <td className="p-3 text-slate-500">Sürekli bildirim baskısı</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Zihin Odası & 18:00 Smart Guard Koruma Kalkanı</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AUTONOMY CONFIG */}
          {activeTabSection === 'autonomy' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AYZEK Otonomi Seviyenizi Belirleyin
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Uygulama dışındayken sistemin sizin adınıza ne kadar inisiyatif alacağını seçebilirsiniz.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'autonomous',
                    title: 'Tam Otonom Yaşam Nöbetçisi (Önerilen)',
                    badge: '2026 Standart',
                    desc: '15 dk akıllı tamponları otomatik takvime işler, faturaları ajandaya ekler, WhatsApp duygu analizini arka planda yapar ve mesai sonrası korumayı 18:00’de bizzat kilitler.',
                  },
                  {
                    id: 'copilot',
                    title: 'Dengeli Yardımcı Pilot (Öner & Onayla)',
                    badge: 'Dengeli',
                    desc: 'Aksiyonları hazırlar, bildirim olarak özetler ve tek bir dokunuşunuzla ("Uygula") onay aldıktan sonra devreye alır.',
                  },
                  {
                    id: 'whisper',
                    title: 'Fısıltı Modu (Yalnızca Kritik Risklerde)',
                    badge: 'Minimal',
                    desc: 'Sadece çifte randevu çakışması, son günü gelen fatura veya aşırı tükenmişlik riski varsa nazikçe araya girer.',
                  },
                ].map((level) => (
                  <label
                    key={level.id}
                    onClick={() => setAutonomyLevel(level.id as any)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      autonomyLevel === level.id
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="autonomy"
                      checked={autonomyLevel === level.id}
                      onChange={() => setAutonomyLevel(level.id as any)}
                      className="mt-1 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {level.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {level.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {level.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Otonomi Tercihi Canlı Profiliyle Eşitlendi</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-600">Aktif</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Bilişsel İzolasyon & Sıfır Bilgi Güvencesi</span>
          </div>

          <button
            onClick={() => setIsVisionModalOpen(false)}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs transition-colors"
          >
            Anladım & Uygulamaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};
