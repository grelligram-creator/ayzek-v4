import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AkisView } from './components/AkisView';
import { PlanView } from './components/PlanView';
import { MerkezView } from './components/MerkezView';
import { PricingView } from './components/PricingView';
import { ProfileView } from './components/ProfileView';
import { BottomNav } from './components/BottomNav';
import { AyzekAssistantModal } from './components/AyzekAssistantModal';
import { DecisionMatrixModal } from './components/DecisionMatrixModal';
import { MessageDraftModal } from './components/MessageDraftModal';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { IosInstallModal } from './components/IosInstallModal';
import { FirstStarsOnboardingModal } from './components/FirstStarsOnboardingModal';
import { QuickTourModal } from './components/QuickTourModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { CognitiveSanctuaryModal } from './components/CognitiveSanctuaryModal';
import { LifeCenterVisionModal } from './components/LifeCenterVisionModal';
import { VoiceBriefingModal } from './components/VoiceBriefingModal';
import { CognitiveWrappedModal } from './components/CognitiveWrappedModal';
import { PoliteDeclineModal } from './components/PoliteDeclineModal';
import { AlwaysOnWatchModal } from './components/AlwaysOnWatchModal';
import { MeetingShadowModal } from './components/MeetingShadowModal';
import { FutureSelfModal } from './components/FutureSelfModal';
import { SyncNotification } from './components/SyncNotification';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const { viewMode, activeTab, toggleViewMode, isSanctuaryOpen, setIsSanctuaryOpen } = useApp();

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#080204] text-rose-50 selection:bg-rose-600 selection:text-white">
      {/* Global Modals & Notifications */}
      <SyncNotification />
      <AyzekAssistantModal />
      <DecisionMatrixModal />
      <CognitiveSanctuaryModal isOpen={isSanctuaryOpen} onClose={() => setIsSanctuaryOpen(false)} />
      <MessageDraftModal />
      <AuthModal />
      <CheckoutModal />
      <IosInstallModal />
      <FirstStarsOnboardingModal />
      <QuickTourModal />
      <NotificationCenterModal />
      <LifeCenterVisionModal />
      <VoiceBriefingModal />
      <CognitiveWrappedModal />
      <PoliteDeclineModal />
      <AlwaysOnWatchModal />
      <MeetingShadowModal />
      <FutureSelfModal />

      {viewMode === 'mobile_sim' ? (
        /* Mobile Simulator Mode: on large screens show phone mockup; on real phones display 100% edge-to-edge native layout */
        <div className="min-h-screen flex flex-col items-center justify-start lg:py-6 lg:px-2 bg-[#050102]">
          {/* Quick exit bar from simulator (visible on desktop) */}
          <div className="hidden lg:flex w-full max-w-[420px] mb-2 items-center justify-between px-2 text-xs font-semibold text-rose-300/80">
            <button
              onClick={toggleViewMode}
              className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geniş Masaüstü Moduna Dön</span>
            </button>
            <span className="text-[10px] bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded-md font-bold border border-rose-500/20">
              iPhone 16 Pro Simülatörü
            </span>
          </div>

          <div className="w-full lg:max-w-[420px] min-h-screen lg:min-h-0 lg:h-[840px] lg:max-h-[92vh] lg:rounded-[48px] bg-[#090305] lg:border-[7px] border-neutral-900 lg:shadow-[0_25px_60px_-15px_rgba(225,29,72,0.4)] overflow-hidden flex flex-col relative">
            {/* Phone Speaker & Dynamic Island (Desktop mockup only) */}
            <div className="hidden lg:flex h-7 bg-[#090305] items-center justify-between px-6 shrink-0 z-30 pt-1 text-[11px] font-bold text-rose-200 border-b border-rose-950/40">
              <span>{currentTime}</span>
              <div className="w-20 h-3.5 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1 text-rose-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mobile Header (Fixed full touch-access) */}
            <div className="shrink-0 z-30">
              <Header />
            </div>

            {/* Scrollable Mobile Body */}
            <main className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-3 no-scrollbar touch-pan-y overscroll-contain pb-24 crimson-ambient">
              {activeTab === 'akis' && <AkisView />}
              {activeTab === 'plan' && <PlanView />}
              {activeTab === 'merkez' && <MerkezView />}
              {activeTab === 'pricing' && <PricingView />}
              {activeTab === 'profile' && <ProfileView />}
            </main>

            {/* Mobile Bottom Dock */}
            <BottomNav />

            {/* Desktop Home indicator bar */}
            <div className="hidden lg:flex h-4 bg-[#090305] items-center justify-center shrink-0 z-30 pb-1">
              <div className="w-28 h-1 bg-rose-900/60 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop Responsive Mode */
        <div className="min-h-screen flex flex-col bg-[#080204]">
          <Header />

          <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 touch-pan-y pb-24 crimson-ambient">
            {activeTab === 'akis' && <AkisView />}
            {activeTab === 'plan' && <PlanView />}
            {activeTab === 'merkez' && <MerkezView />}
            {activeTab === 'pricing' && <PricingView />}
            {activeTab === 'profile' && <ProfileView />}
          </main>

          <BottomNav />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
