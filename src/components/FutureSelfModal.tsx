import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  User,
  Compass,
  ArrowRight,
  Clock,
  Heart,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

interface FutureMessage {
  id: string;
  sender: 'user' | 'future_self';
  text: string;
  time: string;
}

export const FutureSelfModal: React.FC = () => {
  const { isFutureSelfOpen, setIsFutureSelfOpen, userProfile, dilemmas } = useApp();

  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<FutureMessage[]>([
    {
      id: 'fut-1',
      sender: 'future_self',
      text: `Selam Görkem. Ben 2031'deki senim; aradan tam 5 yıl geçti. 2026'daki o koşturmanı, Grispi mimarisini büyütürken aynı zamanda ruhsal huzurunu koruma çabanı çok iyi hatırlıyorum. Sana temin ederim: attığın adımların hiçbiri boşa gitmedi. Bugün zihnini en çok ne kurcalıyor, geleceğin gözüyle birlikte bakalım mı?`,
      time: '2031 · 17:00',
    },
  ]);

  if (!isFutureSelfOpen) return null;

  const quickPrompts = [
    '2026\'daki Grispi kariyer ikilemim 2031\'den nasıl görünüyor?',
    'Şu an yaşadığım yoğunluk ve yorgunluk gerçekten geleceğe değer mi?',
    'Bugün vereceğim kararlarda en çok neyi pusula yapmalıyım?',
    'C1 İngilizce ve uluslararası hedeflerimize ulaştık mı?',
  ];

  const handleSendMessage = (questionText?: string) => {
    const textToSend = questionText || inputQuestion.trim();
    if (!textToSend) return;

    const userMsg: FutureMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Bugün (2026)',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('kariyer') || lower.includes('grispi') || lower.includes('ayrıl')) {
        reply = `O günlerdeki endişeni o kadar iyi anlıyorum ki. Grispi'de kurduğun sağlam mimari ve kazandığın liderlik kasları olmasaydı, 2031'deki global ölçekli vizyonumuzu inşa edemezdik. O ikilemde önemli olan nereye gittiğin değil, masaya ne koyduğun ve sınırlarını nasıl koruduğundu. Değerlerine sadık kaldın ve harika bir kapı açıldı. Korkma, cesaretle kendi standartlarını belirle.`;
      } else if (lower.includes('yorgun') || lower.includes('değer') || lower.includes('yoğun')) {
        reply = `Evet, kesinlikle değdi. Ama sana 2031'den vereceğim en büyük öğüt: Kendini tüketerek kazanılan hiçbir zafer kalıcı olmuyor. O dönemde AYZEK'in sana koyduğu 18:00 korumaları ve 15 dakikalık nefes tamponları sayesinde tükenmişlik yaşamadın. Şimdi arkana yaslan, bu bir maraton. Sevdiklerine ayırdığın zamanı asla erteleme.`;
      } else if (lower.includes('ingilizce') || lower.includes('c1') || lower.includes('hedef')) {
        reply = `Haftada 3 gün işe giderken dinlediğin o 15 dakikalık podcast'ler var ya? İşte onlar sayesinde şu an global ekiplerle Berlin ve Londra sunumlarını kendi ana dilin gibi rahatça yapıyoruz. Büyük sıçramalar değil, küçük günlük temaslar kazandırdı. Rutinine güven!`;
      } else {
        reply = `2031'deki dinginliğimden sana baktığımda tek bir şey görüyorum: Zihnindeki şüphelerin çoğu asla gerçekleşmedi. Önündeki kararları alırken kısa vadeli korkularla değil, uzun vadeli kim olmak istediğinle hareket et. Sen doğru yoldasın, kendine şefkat göster.`;
      }

      const futureReply: FutureMessage = {
        id: `f-${Date.now()}`,
        sender: 'future_self',
        text: reply,
        time: '2031 · Şimdi',
      };

      setMessages((prev) => [...prev, futureReply]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
        {/* Top Aesthetic Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '18s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  Gelecekteki Benliğim (2031)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  +5 Yıl Projeksiyonu
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Karar yorgunluğunu 5 yıl sonraki bilge gözle erit
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFutureSelfOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Örnek Sorular:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat History Body */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[380px] no-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-medium">
                <span>{m.sender === 'user' ? 'Sen (2026)' : 'Görkem (2031 · 5 Yıl Sonrası)'}</span>
                <span>•</span>
                <span>{m.time}</span>
              </div>
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-xs'
                    : 'bg-gradient-to-br from-slate-800 to-purple-950/60 border border-purple-500/20 text-slate-100 rounded-tl-xs shadow-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
              <span>2031 yılındaki deneyim ve hafıza taranıyor...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="5 yıl sonraki kendine bir soru sor..."
            className="flex-1 px-4 py-2.5 rounded-2xl text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuestion.trim() || isThinking}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-95 text-white disabled:opacity-40 transition-transform active:scale-95 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
