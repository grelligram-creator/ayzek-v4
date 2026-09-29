import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import {
  Sparkles,
  Compass,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Smile,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FirstStarsOnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, userProfile, updateProfileInfo } = useApp();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(userProfile?.location || '');
  const [hobbyInput, setHobbyInput] = useState('');
  const [lifeMission, setLifeMission] = useState(userProfile?.lifeMission || '');
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!isOnboardingOpen) return null;

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save info
      const hobbiesArray = hobbyInput
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean);

      try {
        await updateProfileInfo({ location, hobbies: hobbiesArray, lifeMission, onboardingCompleted: true });
      } catch {
        setSaveError('Bilgiler kaydedilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
        return;
      }

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}

      setIsOnboardingOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all">
        {/* Animated Top Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white text-center flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <AyzekLogo size="lg" className="my-2" />

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {step === 1 && 'AYZEK OS Dünyasına Hoş Geldin'}
            {step === 2 && 'Seni & Yaşamını Tanıyalım'}
            {step === 3 && 'Kişisel Yaşam Vizyonun'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1 max-w-sm">
            {step === 1 && 'Sıradan bir takvim değil; senin için düşünen, arka planda seni koruyan bir bilişsel yoldaş.'}
            {step === 2 && 'Konumun, sevdiklerin ve hobilerin sayesinde sana en doğru anlarda proaktif rehberlik sunarız.'}
            {step === 3 && 'AYZEK, bu vizyonu pusula kabul ederek gününü ve kararlarını senin değerlerine göre hizalar.'}
          </p>
        </div>

        {/* Dynamic Body */}
        <div className="p-6 space-y-4">
          {saveError && <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">{saveError}</p>}
          {step === 1 && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Smart Guard 18:00 Koruma Kalkanı
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    İş toplantıları mesai bitiminde otomatik durdurulur, zihninin dinlenmesi için akşam boşluğu garantiye alınır.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Karar Matrisi & Psikolog Stratejisi
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Kariyer, yatırım ve yaşam ikilemlerini duygusal tükenmişliğe girmeden rasyonel artı/eksi analizleriyle netleştirir.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Uygulamaya Canlı Eylem Senkronu
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    AYZEK ile sesli veya yazılı ne konuşursan, ajandana, market listene veya hedeflerine anında işlenir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>Şehir & Yaşadığınız Bölge</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Örn: Moda, Kadıköy / İstanbul"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400">
                  Trafik, hava durumu ve eve dönüş proaktif hatırlatmaları için kullanılır.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-500" />
                  <span>İlgi Alanlarınız & Tutkularınız</span>
                </label>
                <input
                  type="text"
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  placeholder="Virgülle ayırın (Örn: Yelken, Kahve, Tenis, Felsefe)"
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400">
                  Hafta sonu boşluklarında zihinsel şarj için kişiye özel öneriler oluşturur.
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                  <span>Hayat Misyonunuz / Temel Önceliğiniz</span>
                </label>
                <textarea
                  rows={4}
                  value={lifeMission}
                  onChange={(e) => setLifeMission(e.target.value)}
                  placeholder="Hayatınızdaki en değerli amaç ne? (Örn: Aileme vakit ayırarak global ölçekli bir yazılım geliştirmek)"
                  className="w-full p-3.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-[11px] text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>
                  Bu bilgiler hesabınıza kaydedilir; öneriler yalnızca açıkça izin verdiğiniz verilerden üretilir.
                </span>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-3">
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{step === 3 ? 'AYZEK OS Deneyimini Başlat' : 'Devam Et'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
