import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Check, MessageSquare, CalendarDays, Brain, ShieldCheck, Plug } from 'lucide-react';

const steps = [
  { icon: MessageSquare, title: 'Güvenli sohbet', text: 'Konuşmaların yalnızca kendi hesabına kaydedilir. AI yanıtları doğrudan görev veya takvim değişikliği yapmaz.' },
  { icon: CalendarDays, title: 'Plan ve görevler', text: 'Görevlerini manuel olarak ekleyip tamamlayabilirsin. Bağlı takvim olmadan dış sistemlerde değişiklik yapılmaz.' },
  { icon: Brain, title: 'Kontrollü hafıza', text: 'Uzun dönem hafızaya yalnızca Profil ekranından açıkça eklediğin notlar alınır; bunları istediğin zaman silebilirsin.' },
  { icon: Plug, title: 'Bağlı uygulamalar', text: 'Entegrasyon Merkezi gerçek bağlantı durumunu gösterir. OAuth kurulmadan hiçbir hesap bağlı görünmez.' },
  { icon: ShieldCheck, title: 'Gizlilik kontrolleri', text: 'Profil ekranından verilerini dışa aktarabilir veya açık onayla hesabını silebilirsin.' },
];

export const QuickTourModal: React.FC = () => {
  const { isQuickTourOpen, setIsQuickTourOpen, completeQuickTour } = useApp();
  const [step, setStep] = useState(0);
  if (!isQuickTourOpen) return null;
  const current = steps[step];
  const Icon = current.icon;

  const finish = async () => {
    try {
      await completeQuickTour();
    } catch {
      setIsQuickTourOpen(false);
    }
    setStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <section className="w-full max-w-md rounded-[32px] border border-rose-500/30 bg-[#100308] p-6 text-white shadow-2xl space-y-5">
        <div className="flex gap-1.5">{steps.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-rose-400' : 'bg-rose-950'}`} />)}</div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300"><Icon className="h-6 w-6" /></div>
        <div><h2 className="text-xl font-bold">{current.title}</h2><p className="mt-2 text-sm leading-relaxed text-rose-100/75">{current.text}</p></div>
        <div className="flex items-center justify-between gap-3 pt-2">
          <button type="button" onClick={finish} className="text-xs font-semibold text-rose-200/70 hover:text-white">Turu atla</button>
          <div className="flex gap-2">
            {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="rounded-xl border border-rose-500/25 p-2 text-rose-200"><ArrowLeft className="h-4 w-4" /></button>}
            <button type="button" onClick={() => step === steps.length - 1 ? finish() : setStep(step + 1)} className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white">
              {step === steps.length - 1 ? <><Check className="h-4 w-4" /> Bitir</> : <>İleri <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
