import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  X,
  Copy,
  Check,
  Send,
  Sparkles,
  MessageSquare,
  Mail,
  ShieldCheck,
  ThumbsDown,
  Clock,
  BatteryCharging,
} from 'lucide-react';

export const PoliteDeclineModal: React.FC = () => {
  const { isPoliteDeclineOpen, setIsPoliteDeclineOpen, userProfile } = useApp();

  const [requestText, setRequestText] = useState('');
  const [selectedTone, setSelectedTone] = useState<'diplomatic' | 'warm' | 'firm'>('diplomatic');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isPoliteDeclineOpen) return null;

  const quickTemplates = [
    'Cumartesi akşamı plansız iş yemeği daveti',
    'Ücretsiz mentörlük veya hızlı kahve sohbeti ricası',
    'Hafta sonu gelen "acil" denilen çalışma talebi',
    'Bütçesi ve kapsamı belirsiz proje ortaklığı teklifi',
  ];

  const responses = {
    diplomatic: {
      title: 'Zarif & Üst Düzey Diplomatik',
      subtitle: 'Kurumsal prestiji korur, karşı tarafı onore ederek kapıyı kapatır',
      tr: `Nazik davetiniz ve beni düşündüğünüz için çok teşekkür ederim. Bu dönemde mevcut önceliklerim nedeniyle yeni bir görüşmeye dahil olamıyorum. Çalışmalarınızda başarılar dilerim.`,
      en: `Thank you very much for your kind invitation. Due to our high-priority strategic Q3 commitments and focused engineering sprint, I am currently unable to take on additional meetings. Wishing you all the best with your initiatives.`,
      savedEnergy: '2.5 Saat Bilişsel Odak & Karar Rahatlığı',
    },
    warm: {
      title: 'Sıcak & Erteleyici',
      subtitle: 'İlişkiyi kırmadan, enerjinizi projelerinize odaklamanızı sağlar',
      tr: `Selamlar! Düşündüğün için çok teşekkürler. Bu ara zihinsel enerjimi tamamen mevcut projelere kilitledim, hafta sonlarımı da zihnimi dinlendirmeye ayırıyorum. Önümüzdeki haftalarda tempo sakinleştiğinde uygun bir zamanda kahvede görüşmek üzere!`,
      en: `Hello! Thanks so much for thinking of me. Right now I am fully locked into current product deliverables and reserving weekends for cognitive recovery. Let's definitely reconnect for a quick coffee once the dust settles!`,
      savedEnergy: '3 Saat Sosyal & Zihinsel Koruma',
    },
    firm: {
      title: 'Kaya Gibi Net & Koruyucu',
      subtitle: 'Sınırları kesin çizgilerle çeker, suçluluk duygusu yaratmaz',
      tr: `Merhaba, davetiniz için teşekkür ederim. Mevcut ajanda prensiplerim ve odak sınırlarım doğrultusunda şu aşamada bu sürece dahil olmam mümkün görünmüyor. Anlayışınız için teşekkür eder, iyi çalışmalar dilerim.`,
      en: `Hello, thank you for the invitation. Based on my current scheduling boundaries and strict focus commitments, I cannot participate in this discussion. Thank you for your understanding.`,
      savedEnergy: '4 Saat Kesintisiz Özel Zaman',
    },
  };

  const currentResponse = responses[selectedTone];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white max-h-[92vh]">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">
                  Benim İçin Hayır De
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Diplomatik Sınır Kalkanı
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Suçluluk hissetmeden enerjini ve zamanını koru
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPoliteDeclineOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Quick Prompt Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Reddetmek İstediğin Davet veya Talep:</span>
              <span className="text-[10px] text-slate-500 font-normal">Hızlı Örnekler</span>
            </label>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickTemplates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => setRequestText(template)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/80 dark:border-slate-700/80"
                >
                  {template}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              placeholder="Gelen talep veya daveti yazın..."
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Cevap Tonu Seçin:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['diplomatic', 'warm', 'firm'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedTone === tone
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-500 text-rose-800 dark:text-rose-200 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <span className="text-[11px] block">{responses[tone].title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generated Response Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 dark:from-slate-850 dark:to-slate-900 border border-rose-200 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Hazır Diplomatik Yanıt
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentResponse.subtitle}
              </span>
            </div>

            {/* Turkish Text */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
              {currentResponse.tr}
            </div>

            {/* English Alternative */}
            <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-600 dark:text-slate-300 italic">
              <span className="font-bold text-[10px] uppercase text-slate-400 block not-italic mb-0.5">
                İngilizce Alternatifi (Global Yazışmalar):
              </span>
              "{currentResponse.en}"
            </div>

            {/* Benefit Pill */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800/50">
              <BatteryCharging className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>AYZEK Kazancı: {currentResponse.savedEnergy}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-2">
          <button
            onClick={() => handleCopy(currentResponse.tr)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Yanıtı Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              const url = `https://wa.me/?text=${encodeURIComponent(currentResponse.tr)}`;
              window.open(url, '_blank');
            }}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center transition-colors"
            title="WhatsApp ile Paylaş"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const url = `mailto:?subject=${encodeURIComponent('Görüşme ve Davet Hk.')}&body=${encodeURIComponent(currentResponse.tr)}`;
              window.open(url, '_blank');
            }}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center transition-colors"
            title="E-posta Olarak Gönder"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
