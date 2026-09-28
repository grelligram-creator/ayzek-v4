import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Smartphone,
  LogOut,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Share2,
  Download,
  Sliders,
  ChevronRight,
  MapPin,
  Heart,
  Compass,
  Zap,
  Edit3,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    user,
    logout,
    setActiveTab,
    setIsIosInstallModalOpen,
    setIsOnboardingOpen,
    updateProfileInfo,
  } = useApp();

  const [jobTitle, setJobTitle] = useState(userProfile?.jobTitle || 'Kurucu & Baş Yazılım Mimarı');
  const [company, setCompany] = useState(userProfile?.company || 'Grispi Inc.');
  const [location, setLocation] = useState(userProfile?.location || 'Moda, Kadıköy / İstanbul');
  const [lifeMission, setLifeMission] = useState(
    userProfile?.lifeMission || 'Kurumsal zeka ile ruhsal huzuru dengede tutarak yüksek etki üretmek.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileInfo({
      jobTitle,
      company,
      location,
      lifeMission,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-28 animate-fadeIn max-w-2xl mx-auto">
      {/* 1. Header Profile Card (Crimson Glass) */}
      <section className="p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full ring-2 ring-rose-400 p-0.5 crimson-orb-glow text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-rose-950/70 shrink-0">
              {userProfile?.displayName?.charAt(0) || 'G'}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#080204]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {userProfile?.displayName || 'Görkem Elligram'}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                {userProfile?.subscriptionTier || 'PRO'}
              </span>
            </div>
            <p className="text-xs text-rose-200/70 mt-0.5 truncate">
              {userProfile?.email || user?.email || 'gorkem.elligram@grispi.com'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-rose-200/60 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{userProfile?.location || 'Moda, Kadıköy / İstanbul'}</span>
            </div>
          </div>
        </div>

        {/* Holographic Obsidian & Crimson Metal Executive Member Card */}
        <div className="relative overflow-hidden p-6 rounded-[28px] bg-gradient-to-br from-[#1a050e] via-[#240612] to-[#0d0206] text-white shadow-2xl border border-rose-500/35 space-y-5 group">
          {/* Card subtle radiant glows */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top row */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AyzekLogo size={34} theme="crimson" variant="boxed" glow={false} />
              <div>
                <span className="text-xs font-black tracking-widest text-rose-300 uppercase block font-mono">
                  AYZEK OS BİLİŞSEL KART
                </span>
                <span className="text-[10px] text-rose-200/60 font-mono tracking-wider">
                  {userProfile?.membershipId || 'AYZK-2026-9821-GRSP'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{userProfile?.subscriptionStatus === 'active' ? 'Aktif Üyelik' : 'Deneme'}</span>
            </div>
          </div>

          {/* Chip & NFC Tag */}
          <div className="relative z-10 flex items-center justify-between pt-1">
            <div className="w-11 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-600 border border-amber-300/40 shadow-xs flex items-center justify-center">
              <div className="w-8 h-4 border border-amber-800/40 rounded-xs grid grid-cols-2 gap-0.5" />
            </div>

            <div className="flex items-center gap-1.5 text-rose-200/60 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-widest">NFC / LIVE SYNC</span>
              <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
            </div>
          </div>

          {/* Middle tier info */}
          <div className="relative z-10 flex items-baseline justify-between pt-2">
            <div>
              <span className="text-[10px] text-rose-200/60 uppercase tracking-widest block font-mono">
                Üyelik Seviyesi
              </span>
              <h3 className="text-lg font-black tracking-tight text-white capitalize">
                {userProfile?.subscriptionTier === 'enterprise'
                  ? 'Corporate Team Plan'
                  : userProfile?.subscriptionTier === 'pro'
                  ? 'Executive Pro Plan'
                  : 'Starter Plan'}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-rose-200/60 uppercase tracking-widest block font-mono">
                Ödeme Yöntemi
              </span>
              <div className="flex items-center gap-1.5 justify-end mt-0.5 text-xs font-bold text-rose-100">
                <CreditCard className="w-4 h-4 text-rose-400" />
                <span>{userProfile?.cardBrand || 'Mastercard Black'} •••• {userProfile?.cardLast4 || '9821'}</span>
              </div>
            </div>
          </div>

          {/* Quota breakdown */}
          <div className="relative z-10 pt-3 border-t border-rose-500/20 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-rose-200/70">Yapay Zeka Bilişsel Kota (Gemini 3.8 Flash):</span>
              <span className="font-bold text-rose-300 font-mono">1.25M / 1.50M Token (%83)</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-rose-500/20">
              <div className="h-full coral-gradient rounded-full w-[83%]" />
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-[11px] text-rose-200/70">
              <span>
                Yenilenme: {userProfile?.renewalDate || '28 Ekim 2026'} · Kurumsal Bilişsel Üyelik
              </span>
              <button
                onClick={() => setActiveTab('pricing')}
                className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Planı Yönet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Synced devices and Autonomous Engine Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl crimson-orb-glow text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-rose-200/60 uppercase font-bold tracking-wider block font-mono">
                Bağlı Cihazlar
              </span>
              <span className="text-xs font-bold text-white">
                iPhone 16 Pro (PWA) & Mac
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-rose-200/60 uppercase font-bold tracking-wider block font-mono">
                Arka Plan Otonom Motor
              </span>
              <span className="text-xs font-bold text-emerald-300">
                24/7 Canlı Eşitleme Aktif
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hafıza & Kişisel Tanıma Rehberi (Smoked Crimson Glass) */}
      <section className="p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">
              AYZEK Bilişsel Hafızası (Seni Tanıma Profili)
            </h3>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>Tanıtımı Tekrarla</span>
          </button>
        </div>

        <p className="text-xs text-rose-200/70 leading-relaxed">
          AYZEK, kararlarında ve proaktif bildirimlerinde bu hafıza verilerini kullanarak sana sıradan bir asistan değil, gerçek bir bilişsel yoldaş ve sırdaş olur.
        </p>

        {/* Hobbies badges */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block font-mono">
            İlgi Alanları & Hobiler:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {(userProfile?.hobbies || ['Yelken & Deniz', 'Filtre Kahve', 'Bilişsel Bilim']).map((h, i) => (
              <span
                key={i}
                className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#14060a]/90 text-rose-200 border border-rose-500/25"
              >
                ⛵ {h}
              </span>
            ))}
          </div>
        </div>

        {/* Life Mission */}
        <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-1">
          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block font-mono">
            Hayat Misyonu & Değerler:
          </span>
          <p className="text-xs italic text-rose-100 leading-relaxed">
            "{userProfile?.lifeMission || 'Kurumsal zeka ile ruhsal huzuru dengede tutarak yüksek etki üretmek.'}"
          </p>
        </div>
      </section>

      {/* 3. iOS App installation card */}
      <section className="p-6 rounded-[32px] bg-gradient-to-r from-[#1b050f] via-[#280716] to-[#120309] text-white border border-rose-500/35 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl crimson-orb-glow flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                iPhone / iPad'e Kur (PWA)
              </h3>
              <p className="text-xs text-rose-200/70 mt-0.5">
                Safari üzerinden ana ekrana tam ekran native uygulama olarak tek tıkla ekleyin
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsIosInstallModalOpen(true)}
            className="coral-gradient hover:opacity-95 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-rose-950/60 cursor-pointer"
          >
            Nasıl Kurulur?
          </button>
        </div>
      </section>

      {/* 4. Profile info edit form */}
      <form onSubmit={handleSave} className="p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
          Kişisel Bilgileri Düzenle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-200">
              Ünvan / Rol
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-200">
              Şirket / Organizasyon
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-rose-200">
            Yaşadığınız Konum / Açık Adres Bölgesi
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-rose-200">
            Hayat Misyonu
          </label>
          <textarea
            rows={2}
            value={lifeMission}
            onChange={(e) => setLifeMission(e.target.value)}
            className="w-full p-3.5 rounded-2xl text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 resize-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Profil ve hafıza güncellendi
            </span>
          )}
          <button
            type="submit"
            className="ml-auto coral-gradient hover:opacity-95 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-rose-950/60 cursor-pointer"
          >
            Kaydet
          </button>
        </div>
      </form>

      {/* Logout button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl border border-rose-500/30 bg-[#16040a]/90 hover:bg-[#20050f] text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Oturumu Kapat</span>
        </button>
      </div>
    </div>
  );
};
