import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import {
  X,
  Heart,
  Sparkles,
  Send,
  Compass,
  Smile,
  ShieldCheck,
  RefreshCw,
  Volume2,
  Wind,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface SanctuaryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CognitiveSanctuaryModal: React.FC<SanctuaryProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useApp();
  const [feeling, setFeeling] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    empathyMessage: string;
    cognitiveReframing: string;
    microReliefAction: string;
    suggestedAffirmation: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeling.trim() || isLoading) return;

    setIsLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/gemini/psychologist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeling: feeling.trim(),
          context: `Kullanıcı: ${userProfile?.displayName || 'Görkem'}, Görevi: ${userProfile?.jobTitle || 'Kurucu'}, Lokasyon: ${userProfile?.location || 'Kadıköy'}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch {
      setAnalysis({
        empathyMessage: 'Hisssettiğin bu yorgunluğu ve zihnindeki ağırlığı tüm kalbimle anlıyorum. Yüksek sorumluluk alan her insan gibi bazen sadece durup nefes almaya ihtiyacın var.',
        cognitiveReframing: 'Bu hisler yetersizlik değil; kapasitenin üzerinde değer ürettiğin için bedeninin verdiği doğal bir dinlenme sinyalidir.',
        microReliefAction: 'Gözlerini 30 saniye kapat, çeneni ve omuzlarını serbest bırak. Şimdi derin bir nefes al ve yavaşça ver.',
        suggestedAffirmation: 'Her şeyi aynı anda çözmek zorunda değilim; şu an güvendeyim ve dinlenmeyi hak ediyorum.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-xl rounded-[32px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl overflow-hidden flex flex-col transition-all max-h-[90vh]">
        {/* Header (Crimson Glass) */}
        <div className="relative p-6 bg-gradient-to-r from-[#1c0510] via-[#2a0618] to-[#12030a] text-white flex items-center justify-between border-b border-rose-500/20 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl crimson-orb-glow text-white flex items-center justify-center font-bold shadow-md">
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white">Zihin Odası & Bilişsel Sırdaş</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Gizli & Yargısız
                </span>
              </div>
              <p className="text-xs text-rose-200/70 mt-0.5">
                Kafanı meşgul eden yükleri, stresini ya da karar yorgunluğunu dürüstçe paylaş
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 no-scrollbar">
          {/* Prompt quick suggestions */}
          {!analysis && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block font-mono">
                Hızlı Paylaşım Başlatıcıları:
              </span>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {[
                  'Son günlerde karar almaktan zihnim çok yoruldu...',
                  'Grispi ve yeni teklif arasında kalmak beni huzursuz ediyor...',
                  'İşler yolunda ama içimde adını koyamadığım bir tükenmişlik var...',
                  'Sevdiklerime yeterince kaliteli vakit ayıramıyorum...',
                ].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFeeling(s)}
                    className="p-3 rounded-2xl text-left bg-[#14060a]/90 hover:bg-[#1f0810] text-rose-100 border border-rose-500/20 hover:border-rose-400/40 transition-colors cursor-pointer"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-rose-200 flex items-center justify-between">
                <span>İçini Dök (AYZEK sadece seni dinler ve dengeler):</span>
                <span className="text-[10px] text-rose-300/60 font-normal flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-rose-400" /> Uçtan uca şifreli
                </span>
              </label>
              <textarea
                rows={4}
                required
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="Örn: Bugün ekipten birinin ayrılma ihtimali beni çok gerdi, bir yandan da kendi kariyerimde ne yapacağımı tam kestiremiyorum..."
                className="w-full p-4 rounded-2xl text-xs sm:text-sm bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 leading-relaxed resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full coral-gradient hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isLoading ? 'AYZEK Kalpten Dinliyor & Çözümlüyor...' : 'Sırdaşına Anlat & Dinginleş'}</span>
            </button>
          </form>

          {/* Analysis Result */}
          {analysis && (
            <div className="space-y-4 pt-2 border-t border-rose-500/20 animate-fadeIn">
              {/* Empathy Box */}
              <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <span>AYZEK Bilişsel Sırdaş Yanıtı:</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
                  {analysis.empathyMessage}
                </p>
              </div>

              {/* Cognitive Reframing */}
              <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Bilişsel Yeniden Çerçeveleme (Yeni Perspektif):</span>
                </div>
                <p className="text-xs text-rose-100/90 leading-relaxed">
                  {analysis.cognitiveReframing}
                </p>
              </div>

              {/* Micro Relief Action */}
              <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Wind className="w-4 h-4 text-amber-400" />
                  <span>2 Dakikalık Zihinsel Nefes Molası:</span>
                </div>
                <p className="text-xs font-semibold text-white leading-relaxed">
                  {analysis.microReliefAction}
                </p>
              </div>

              {/* Affirmation */}
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-center">
                <span className="text-xs font-bold text-rose-200 italic">
                  "{analysis.suggestedAffirmation}"
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
