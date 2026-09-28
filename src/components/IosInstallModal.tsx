import React from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import { X, Share, PlusSquare, Smartphone, CheckCircle, Zap } from 'lucide-react';

export const IosInstallModal: React.FC = () => {
  const { isIosInstallModalOpen, setIsIosInstallModalOpen } = useApp();

  if (!isIosInstallModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white text-center relative flex flex-col items-center">
          <button
            onClick={() => setIsIosInstallModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          <AyzekLogo size="lg" className="mb-2" />
          <h3 className="text-lg font-bold">
            iPhone & iPad'e Yükle (PWA)
          </h3>
          <p className="text-xs text-sky-200/80 mt-1">
            App Store onayı beklemeden hemen cihazınızda tam ekran kullanın
          </p>
        </div>

        {/* Step-by-step instructions */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Safari Tarayıcısında Açın
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Bu bağlantıyı iPhone cihazınızdaki <strong>Safari</strong> tarayıcısında açtığınızdan emin olun.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>"Paylaş" Düğmesine Dokunun</span>
                <Share className="w-3.5 h-3.5 text-sky-500" />
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Safari alt menü çubuğundaki kare içinden yukarı ok çıkan <strong>Paylaş</strong> simgesine tıklayın.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>"Ana Ekrana Ekle" Seçeneğini Seçin</span>
                <PlusSquare className="w-3.5 h-3.5 text-sky-500" />
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Açılan menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> butonuna basın ve sağ üstteki <strong>"Ekle"</strong>ye dokunun.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              Artık ana ekranınızdaki AYZEK OS simgesine dokunarak Safari çubukları olmadan bağımsız bir yerel iOS uygulaması gibi kullanabilirsiniz!
            </span>
          </div>

          <button
            onClick={() => setIsIosInstallModalOpen(false)}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
