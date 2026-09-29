import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Calendar, LayoutGrid, User } from 'lucide-react';
import { AyzekLogo } from './AyzekLogo';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAssistantOpen, user, setIsAuthModalOpen } = useApp();

  return (
    <div className="fixed bottom-3 sm:bottom-5 pb-[env(safe-area-inset-bottom,0px)] left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none">
      <nav
        aria-label="Ana Navigasyon"
        className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all border bg-[#110508]/95 border-rose-500/30 text-rose-200/80"
      >
        {/* Tab 1: Akış (Home) */}
        <button
          onClick={() => setActiveTab('akis')}
          aria-label="Akış"
          title="Akış Sayfası"
          className={`flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'akis'
              ? 'border border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-xs'
              : 'text-rose-200/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Tab 2: Plan (Ajanda) */}
        <button
          onClick={() => setActiveTab('plan')}
          aria-label="Plan"
          title="Plan & Ajanda"
          className={`flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'plan'
              ? 'border border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-xs'
              : 'text-rose-200/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-5 h-5" />
        </button>

        {/* Center Glowing AYZEK Logo Action Button for AI Chat */}
        <div className="relative px-1 -my-2.5">
          <button
            onClick={() => setIsAssistantOpen(true)}
            title="AYZEK AI Asistan ile Sohbet Et & Senkronize Et"
            aria-label="AYZEK AI Sohbet"
            className="group relative -top-3.5 w-[52px] h-[52px] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 crimson-orb-glow border border-rose-400/50 cursor-pointer shadow-[0_0_30px_rgba(225,29,72,0.8)]"
          >
            {/* Ambient Pulsing Halo */}
            <div className="absolute -inset-1 rounded-full bg-rose-500/40 blur-md -z-10 group-hover:bg-rose-500/70 transition-all animate-pulseGlow" />
            
            {/* AYZEK Monogram Logo In Theme Colors */}
            <AyzekLogo
              size={28}
              theme="crimson"
              variant="iconOnly"
              glow={false}
              className="group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
          </button>
        </div>

        {/* Tab 3: Merkez (Entegrasyonlar) */}
        <button
          onClick={() => setActiveTab('merkez')}
          aria-label="Merkez"
          title="Merkez & Entegrasyonlar"
          className={`flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'merkez'
              ? 'border border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-xs'
              : 'text-rose-200/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
        </button>

        {/* Tab 4: Profil */}
        <button
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              setActiveTab('profile');
            }
          }}
          aria-label="Profil"
          title="Profil & Bilişsel Kart"
          className={`flex items-center justify-center p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile' || activeTab === 'pricing'
              ? 'border border-rose-500/60 bg-rose-500/20 text-rose-200 shadow-xs'
              : 'text-rose-200/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};
