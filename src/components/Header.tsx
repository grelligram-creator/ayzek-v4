import React from 'react';
import { useApp } from '../context/AppContext';
import { AyzekLogo } from './AyzekLogo';
import {
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Sparkles,
  Watch,
  Headphones,
  Bell,
  Sliders,
  Download,
  CreditCard,
  User,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    viewMode,
    toggleViewMode,
    userProfile,
    user,
    setIsAuthModalOpen,
    setActiveTab,
    balance,
    setIsIosInstallModalOpen,
    setIsVisionModalOpen,
    setIsVoiceBriefingOpen,
    setIsAlwaysOnWatchOpen,
    notifications,
    setIsNotificationsOpen,
  } = useApp();

  return (
    <header className="ayzek-header sticky top-0 z-40 w-full backdrop-blur-2xl transition-colors duration-200 border-b pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand & Greeting with AYZEK Logo */}
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0 group"
        >
          <div className="relative group-hover:scale-105 transition-transform">
            <AyzekLogo size={36} theme="crimson" variant="boxed" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-tight ayzek-text-primary">
                AYZEK OS
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                2026
              </span>
            </div>
            <span className="text-[10px] ayzek-text-muted font-medium truncate max-w-[130px] sm:max-w-none">
              {userProfile?.displayName || user?.displayName || 'Profilini tamamla'}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notification Bell with red pulse dot */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            title="Bildirim merkezi"
            aria-label="Bildirim merkezi"
            className="ayzek-header-control relative w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((notification) => !notification.readAt) && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />}
          </button>

          {/* Sesli Brifing Trigger */}
          <button
            onClick={() => setIsVoiceBriefingOpen(true)}
            title="07:45 Sesli Sabah Brifingini Dinle"
            aria-label="Sesli Brifing"
            className="ayzek-pill-primary flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs min-h-[36px] justify-center cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
            <span className="hidden lg:inline">Sesli Brifing</span>
          </button>

          {/* Canlı Kadran & Always-On */}
          <button
            onClick={() => setIsAlwaysOnWatchOpen(true)}
            title="Apple Watch & Dinamik Ada Canlı Kadranı"
            aria-label="Canlı Kadran"
            className="ayzek-header-control flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-medium transition-all shadow-2xs min-h-[36px] justify-center cursor-pointer"
          >
            <Watch className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="hidden xl:inline">Kadran</span>
          </button>

          {/* Hayatın Merkezi 2026 Vision Button */}
          <button
            onClick={() => setIsVisionModalOpen(true)}
            title="AYZEK 2026: Hayatın Merkezi Vizyonu"
            aria-label="Hayatın Merkezi"
            className="ayzek-header-control flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs min-h-[36px] justify-center cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Hayatın Merkezi</span>
          </button>

          {/* Desktop-only simulator toggle */}
          <button
            onClick={toggleViewMode}
            title={viewMode === 'mobile_sim' ? 'Geniş Masaüstü Görünümüne Geç' : 'Mobil Cihaz Görünümüne Geç'}
            aria-label="Cihaz Görünümü"
            className="ayzek-header-control hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-2xs min-h-[36px] cursor-pointer"
          >
            {viewMode === 'mobile_sim' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-rose-400" />
                <span>Masaüstü</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>Mobil Test</span>
              </>
            )}
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Crimson Gece Moduna Geç' : 'Gündüz Moduna Geç'}
            aria-label="Tema Değiştir"
            className="ayzek-header-control w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-rose-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
