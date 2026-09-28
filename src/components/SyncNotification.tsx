import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, X, CheckCircle2 } from 'lucide-react';

export const SyncNotification: React.FC = () => {
  const { syncToast, clearSyncToast } = useApp();

  if (!syncToast || !syncToast.show) return null;

  return (
    <aside
      aria-label="Senkronizasyon Bildirimi"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto animate-bounce-short pointer-events-auto"
    >
      <div className="px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl backdrop-blur-md border border-slate-700 dark:border-slate-200 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="leading-snug">{syncToast.text}</span>
        </div>

        <button
          onClick={clearSyncToast}
          aria-label="Bildirimi Kapat"
          className="text-slate-400 hover:text-white dark:hover:text-slate-900 shrink-0 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
