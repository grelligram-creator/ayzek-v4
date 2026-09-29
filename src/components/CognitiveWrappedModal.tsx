import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  Heart,
  Brain,
  Award,
  Download,
  Copy,
  Check,
} from 'lucide-react';

export const CognitiveWrappedModal: React.FC = () => {
  const {
    isCognitiveWrappedOpen,
    setIsCognitiveWrappedOpen,
    userProfile,
    balance,
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const totalSlides = 5;

  // Auto advance slide every 7 seconds if open
  useEffect(() => {
    if (!isCognitiveWrappedOpen) {
      setCurrentSlide(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
    }, 7000);

    return () => clearInterval(timer);
  }, [isCognitiveWrappedOpen, currentSlide]);

  if (!isCognitiveWrappedOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-indigo-500/30 bg-slate-900 p-6 text-white space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Bilişsel Özet</h2><button onClick={() => setIsCognitiveWrappedOpen(false)} aria-label="Kapat"><X className="w-5 h-5" /></button></div>
        <p className="text-sm leading-relaxed text-slate-300">Bu özet, yalnızca doğrulanmış kullanıcı etkinliği ve izin verilen bağlantılardan üretilecek. Henüz yeterli veri olmadığı için metrik gösterilmiyor.</p>
        <button onClick={() => setIsCognitiveWrappedOpen(false)} className="w-full rounded-full bg-indigo-600 py-3 text-sm font-bold">Anladım</button>
      </div>
    </div>
  );

  const slides = [
    // Slide 1: Intro / General Metrics
    {
      badge: '2026 EYLÜL · HAFTA 39',
      title: 'Bilişsel Yaşam Karnen Hazır',
      subtitle: `${userProfile?.displayName || 'Görkem'}, bu hafta hayatını sadece yaşamadın; onu yüksek zihinsel berraklıkla yönettin.`,
      theme: 'from-indigo-950 via-slate-900 to-purple-950',
      accentColor: 'text-indigo-400',
      icon: <Brain className="w-12 h-12 text-indigo-400 animate-pulse" />,
      content: (
        <div className="grid grid-cols-2 gap-3 mt-4 w-full">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl font-black text-cyan-300">38 Saat</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Derin Odaklanma (Deep Work)</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl font-black text-emerald-300">6s 20dk</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Smart Buffer İle Kurtarılan Zaman</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl font-black text-amber-300">%94</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Duygusal Dayanıklılık Skoru</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl font-black text-rose-300">9.5 Saat</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Sevdiklerine Kaliteli Zaman</p>
          </div>
        </div>
      ),
    },
    // Slide 2: Prefrontal Peak
    {
      badge: 'BİLİŞSEL ZİRVE ANALİZİ',
      title: 'En Keskin Odak Anın:',
      subtitle: 'Salı Günü Saat 10:30',
      theme: 'from-sky-950 via-slate-900 to-cyan-950',
      accentColor: 'text-cyan-400',
      icon: <Zap className="w-12 h-12 text-cyan-400" />,
      content: (
        <div className="space-y-3 mt-3 w-full">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-cyan-300">Grispi Mimari Tasarım & C1 Sunumu</span>
              <span className="text-xs font-mono font-bold text-emerald-300">%96 Odak</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Oura ve Health verilerine göre kalp ritmi değişkenliğin (HRV) 72ms ile en sakin seviyesindeyken, sıfır dikkat dağıtıcıyla 110 dakika kesintisiz akışta kaldın.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-xs text-cyan-200">
            💡 <strong>Bilişsel Çıkarım:</strong> Gelecek hafta en zorlu strateji toplantılarını yine Salı 10:00 - 12:00 aralığına sabitleyelim.
          </div>
        </div>
      ),
    },
    // Slide 3: Burnout Shield
    {
      badge: 'TÜKENMİŞLİK KALKANI',
      title: 'Önlenen Krizler:',
      subtitle: 'Smart Buffer & Diplomatik Sınırlar',
      theme: 'from-emerald-950 via-slate-900 to-teal-950',
      accentColor: 'text-emerald-400',
      icon: <ShieldCheck className="w-12 h-12 text-emerald-400" />,
      content: (
        <div className="space-y-3 mt-3 w-full">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Check className="w-4 h-4" />
              <span>4 Kritik Toplantı Arasına 15 dk Nefes Eklendi</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Check className="w-4 h-4" />
              <span>Akşam 18:00 Sonrası 3 Gereksiz Bildirim Sessize Alındı</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Check className="w-4 h-4" />
              <span>Enerjisa Faturası Son Güne Kalmadan Ödendi</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 text-center italic">
            "Sakinlik bir şans değil, tasarlanmış bir mimaridir."
          </p>
        </div>
      ),
    },
    // Slide 4: Hormonal & Biological Sync
    {
      badge: 'BİYO-RİTİM & DOĞAL AKIŞ',
      title: 'Biyolojik Uyumluluk: %92',
      subtitle: 'Foliküler Evre ile Kusursuz Senkron',
      theme: 'from-rose-950 via-slate-900 to-amber-950',
      accentColor: 'text-rose-400',
      icon: <Heart className="w-12 h-12 text-rose-400" />,
      content: (
        <div className="space-y-3 mt-3 w-full">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-left">
            <h4 className="text-xs font-bold text-rose-300 mb-1">Kronobiyolojik Kazanım</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              Yüksek östrojen ve dopamin evrende riskli kararları ve yeni yatırımları planladın. Hafta sonu ise kortizolü düşürmek için Moda sahilinde yelken ve dinlenmeye öncelik verildi.
            </p>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-slate-300">Uyku Kalite Ortalaması:</span>
            <span className="font-bold text-rose-300">7s 38dk (%86)</span>
          </div>
        </div>
      ),
    },
    // Slide 5: Final Shareable Card
    {
      badge: 'AYZEK OS 2026 · HAFTALIK ARKETİP',
      title: 'Senin Bilişsel Arketipin:',
      subtitle: '"Stratejik Mimar & Dingin Lider"',
      theme: 'from-amber-950 via-slate-900 to-indigo-950',
      accentColor: 'text-amber-400',
      icon: <Award className="w-12 h-12 text-amber-400" />,
      content: (
        <div className="w-full space-y-4 mt-2">
          {/* Holographic Card Mockup */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-amber-400/40 shadow-xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                COGNITIVE WRAPPED 2026
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                #AYZEK-{userProfile?.membershipId || '9821'}
              </span>
            </div>
            <h4 className="text-base font-black text-white">
              {userProfile?.displayName || 'Görkem Elligram'}
            </h4>
            <p className="text-xs text-sky-300 font-medium">
              {userProfile?.jobTitle || 'Kurucu & Baş Yazılım Mimarı'}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
              <div>
                <span className="text-xs font-black text-cyan-300">38s</span>
                <p className="text-[9px] text-slate-400">Derin Odak</p>
              </div>
              <div>
                <span className="text-xs font-black text-emerald-300">6s 20dk</span>
                <p className="text-[9px] text-slate-400">Kurtarılan</p>
              </div>
              <div>
                <span className="text-xs font-black text-amber-300">%94</span>
                <p className="text-[9px] text-slate-400">Denge</p>
              </div>
            </div>
          </div>

          {/* Share Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `Bu hafta AYZEK OS ile 38 saat derin odak sağladım, 6 saat 20 dakika tükenmişlik tamponuyla korundum. Bilişsel arketipim: 'Stratejik Mimar'. 🧠⚡`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Özet Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Karnemi Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Bu haftaki bilişsel yaşam karnem: 38 saat derin odak, %94 denge skoru. Yaşamımı AYZEK OS ile yönetiyorum! 🚀`
                );
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
              }}
              className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Paylaş</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className={`relative w-full max-w-md h-[580px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 bg-gradient-to-b ${current.theme} border border-white/10 text-white transition-all duration-500`}
      >
        {/* Story Progress Indicators (Top) */}
        <div className="flex items-center gap-1.5 z-20">
          {slides.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
              onClick={() => setCurrentSlide(i)}
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  i < currentSlide
                    ? 'w-full'
                    : i === currentSlide
                    ? 'w-full animate-pulse'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsCognitiveWrappedOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Main Slide Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-4 z-10">
          <div className="mb-2 p-3 rounded-3xl bg-white/5 border border-white/10">
            {current.icon}
          </div>

          <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase px-2.5 py-1 rounded-full bg-white/10 border border-white/10 mb-2">
            {current.badge}
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xs leading-relaxed">
            {current.subtitle}
          </p>

          {current.content}
        </div>

        {/* Bottom Slide Controls */}
        <div className="flex items-center justify-between z-20 pt-2 border-t border-white/10">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-colors ${
              currentSlide === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Önceki</span>
          </button>

          <span className="text-[11px] text-slate-400 font-mono">
            {currentSlide + 1} / {totalSlides}
          </span>

          {currentSlide < totalSlides - 1 ? (
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
              className="p-2 rounded-xl text-xs text-white hover:bg-white/10 flex items-center gap-1 transition-colors font-bold"
            >
              <span>Sonraki</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsCognitiveWrappedOpen(false)}
              className="px-3 py-1.5 rounded-xl text-xs bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors"
            >
              Kapat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
