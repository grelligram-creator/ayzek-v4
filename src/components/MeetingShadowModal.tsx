import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Copy,
  Check,
  Plus,
  Play,
  Share2,
  Video,
  ListTodo,
} from 'lucide-react';

export const MeetingShadowModal: React.FC = () => {
  const { isMeetingShadowOpen, setIsMeetingShadowOpen, addTask } = useApp();

  const [selectedMeeting, setSelectedMeeting] = useState<string>('grispi_sprint');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [syncedTasks, setSyncedTasks] = useState<boolean>(false);

  if (!isMeetingShadowOpen) return null;

  // A transcript provider has not been connected yet. Do not show a fictional
  // meeting or create agenda tasks from fixture content.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-slate-900 dark:text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center"><Video className="w-5 h-5" /></div><div><h2 className="text-base font-black">Gölge Noter</h2><p className="text-xs text-slate-500 dark:text-slate-400">Toplantı özeti ve eylem çıkarma</p></div></div>
          <button onClick={() => setIsMeetingShadowOpen(false)} aria-label="Kapat" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-4 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          Henüz yetkilendirilmiş bir toplantı kaynağı veya transkript yok. Gerçek bir sağlayıcı bağlantısı kurulduğunda bu ekran yalnızca izin verdiğiniz toplantı metninden özet ve görev önerileri üretir.
        </div>
        <button onClick={() => setIsMeetingShadowOpen(false)} className="w-full rounded-full bg-indigo-600 py-3 text-xs font-bold text-white">Anladım</button>
      </div>
    </div>
  );

  const meetingData = {
    grispi_sprint: {
      title: 'Grispi Q3 Mimari & API Entegrasyon Toplantısı',
      platform: 'Microsoft Teams',
      duration: '42 dk',
      participants: 'Görkem Elligram (Kurucu & Mimar), Caner (Frontend Lead), Selin (DevOps)',
      decisions: [
        'Mikroservis geçişinde auth modülü PostgreSQL ve Redis kümesine taşınacak.',
        'Mobil PWA push bildirim altyapısı bu Cuma test ortamına alınacak.',
        'Müşteri onboarding süresi 3 adıma indirilecek.',
      ],
      actions: [
        {
          title: 'Grispi Auth Redis Kümesi Mimari Şeması Çiz',
          time: 'Yarın 11:30',
          category: 'is',
          highlight: '⚡ Gölge Noter tarafından otomatik çıkarıldı',
        },
        {
          title: 'Selin ile PWA Bildirim Gateway Konfigürasyonu',
          time: 'Perşembe 15:00',
          category: 'is',
          highlight: '⚡ Gölge Noter tarafından otomatik çıkarıldı',
        },
      ],
      emailDraft: `Selam Ekip,

Bugünkü 42 dakikalık mimari toplantımızın verimli çıktısı için teşekkür ederim. Mutabık kaldığımız ana kararlar:

1. Auth Servisi: Redis kümesi üzerinde PostgreSQL yedekli olarak taşınıyor.
2. PWA Push Altyapısı: Cuma günü test ortamına deploy edilecek (Caner & Selin).
3. Onboarding: Müşteri akışı 3 adıma sadeleştiriliyor.

Benim üzerimdeki mimari şema teslimini yarın 11:30'a kadar paylaşıyorum. 

İyi çalışmalar,
Görkem Elligram`,
    },
  };

  const current = meetingData.grispi_sprint;

  const handleSyncToAgenda = () => {
    current.actions.forEach((act) => {
      addTask({
        title: act.title,
        time: act.time,
        category: act.category as any,
        highlight: act.highlight,
        isCompleted: false,
      });
    });
    setSyncedTasks(true);
    setTimeout(() => setSyncedTasks(false), 3000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(current.emailDraft);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white max-h-[92vh]">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">
                  Gölge Noter (Meeting Shadow AI)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Otomatik Eylem Çıkarıcı
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Toplantı bittiğinde not tutma ameleliğini sıfırla; eylemleri ajandana aktar
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMeetingShadowOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Active Meeting Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/40 dark:to-sky-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {current.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {current.platform} · {current.duration} · {current.participants}
              </p>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Transkript Ayrıştırıldı ✓
            </span>
          </div>

          {/* Section 1: Alınan Kararlar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Alınan Kesin Kararlar (3 Madde)
            </h4>
            <ul className="space-y-1.5">
              {current.decisions.map((dec, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                >
                  <span className="font-bold text-indigo-500">•</span>
                  <span>{dec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Görkem'in Eylemleri */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Görkem'in Üzerindeki Görevler
              </h4>

              <button
                onClick={handleSyncToAgenda}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                {syncedTasks ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajandaya Eklendi!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Tek Tıkla AYZEK Ajandama Aktar</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {current.actions.map((act, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {act.title}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Takip E-postası */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-4 h-4 text-sky-500" />
                Katılımcılara Hazır Takip E-Postası
              </h4>

              <button
                onClick={handleCopyEmail}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Metni Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {current.emailDraft}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Teams & Zoom API ile gerçek zamanlı konuşma sonu eylemleri
          </p>

          <button
            onClick={() => setIsMeetingShadowOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
