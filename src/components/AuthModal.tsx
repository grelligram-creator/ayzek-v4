import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  CheckCircle,
  X,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithEmail, registerWithEmail, user } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!displayName.trim()) {
          setError('Lütfen adınızı ve soyadınızı giriniz.');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Kimlik doğrulama sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md rounded-[32px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl overflow-hidden flex flex-col transition-colors relative">
        {/* Close button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top visual hero in Crimson Glass */}
        <div className="relative p-6 bg-gradient-to-r from-[#1b050f] via-[#280716] to-[#120309] text-white text-center flex flex-col items-center border-b border-rose-500/20">
          <div className="absolute top-3 right-12">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
              Geliştirme Önizlemesi
            </span>
          </div>

          <AyzekLogo size="lg" theme="crimson" variant="boxed" className="mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            AYZEK OS
          </h2>
          <p className="text-xs text-rose-200/70 mt-1 max-w-xs">
            Kişiselleştirilmiş Bilişsel Mentör & Kurumsal Yaşam Asistanı
          </p>

          <div className="flex items-center gap-3 mt-4 text-[11px] text-rose-200/70 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              İzole Veritabanı
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              Canlı Senkronize
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-rose-500/20 bg-[#120409]">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2 cursor-pointer ${
              !isRegister
                ? 'border-rose-500 text-rose-300 bg-[#16050b]'
                : 'border-transparent text-rose-200/50 hover:text-white'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2 cursor-pointer ${
              isRegister
                ? 'border-rose-500 text-rose-300 bg-[#16050b]'
                : 'border-transparent text-rose-200/50 hover:text-white'
            }`}
          >
            Yeni Hesap Oluştur
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 font-medium">
              {error}
            </div>
          )}

          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-200">
                Adınız & Soyadınız
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Örn: Görkem Elligram"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder:text-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-200">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@sirketiniz.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder:text-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-200">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder:text-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full coral-gradient hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'İşleniyor...' : isRegister ? 'Hesap Oluştur ve Başla' : 'Giriş Yap'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      </div>
    </div>
  );
};
