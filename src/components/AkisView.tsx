import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Shield,
  Scale,
  Heart,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Sliders,
  Calendar,
  MessageCircle,
  Plus,
  Send,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  Gift,
  HelpCircle,
  Smartphone,
  Compass,
  MapPin,
  Zap,
  BookOpen,
  ArrowUpRight,
  Check,
  Headphones,
  Award,
  ShieldAlert,
  Watch,
  Video,
  Radio,
} from 'lucide-react';
import { EnergyLevel, MoodType, FocusLevel } from '../types';
import { CrimsonHeroCard } from './CrimsonHeroCard';

export const AkisView: React.FC = () => {
  const {
    userProfile,
    user,
    checkin,
    updateCheckin,
    fetchPersonalAdvice,
    isAdviceLoading,
    balance,
    toggleSmartGuard,
    coachGoal,
    bioRhythm,
    routineSummary,
    dilemmas,
    setIsDecisionModalOpen,
    setSelectedDilemma,
    proactiveAlert,
    dismissProactiveAlert,
    tasks,
    toggleTask,
    openAssistantWithQuery,
    generateDraft,
    setActiveTab,
    setIsIosInstallModalOpen,
    autonomousLogs,
    runAutonomousScan,
    isScanningLogs,
    proactiveInsights,
    setIsVisionModalOpen,
    setIsVoiceBriefingOpen,
    setIsCognitiveWrappedOpen,
    setIsPoliteDeclineOpen,
    setIsAlwaysOnWatchOpen,
    setIsMeetingShadowOpen,
    setIsFutureSelfOpen,
  } = useApp();

  const [activeGoalIndex, setActiveGoalIndex] = useState(0);

  const handleEnergySelect = (energy: EnergyLevel) => {
    updateCheckin({ energy });
  };

  const handleMoodSelect = (mood: MoodType) => {
    updateCheckin({ mood });
  };

  const handleFocusSelect = (focus: FocusLevel) => {
    updateCheckin({ focus });
  };

  const displayName = userProfile?.displayName || user?.displayName || 'Görkem';

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* 0. Crimson Obsidian Luxury Hero & Soundwave Sphere */}
      <CrimsonHeroCard />

      {/* 1. Header Greeting & Top Anchors */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-rose-400 font-mono">
            AYZEK KİŞİSEL YAŞAM ASİSTANI & MENTÖR
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-rose-200/70">
              Canlı Senkronize
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Günaydın ☀️, {displayName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Bugün senin için bilmen gereken en önemli 3 konu:
          </p>
        </div>

        {/* Quick Anchor Buttons Row - Frosted Smoked Glass Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setIsVoiceBriefingOpen(true)}
            className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500/40 text-rose-100 hover:text-white"
          >
            <Headphones className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>07:45 Sesli Brifing</span>
          </button>

          <button
            onClick={() => setIsCognitiveWrappedOpen(true)}
            className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500/30 text-rose-200/90 hover:text-white"
          >
            <Award className="w-3.5 h-3.5 text-rose-400" />
            <span>Bilişsel Karne</span>
          </button>

          <button
            onClick={() => setIsPoliteDeclineOpen(true)}
            className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500/30 text-rose-200/90 hover:text-white"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Hayır De (Sınır)</span>
          </button>

          <button
            onClick={() => setIsAlwaysOnWatchOpen(true)}
            className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500/30 text-rose-200/90 hover:text-white"
          >
            <Watch className="w-3.5 h-3.5 text-rose-400" />
            <span>Canlı Kadran & Ada</span>
          </button>

          <button
            onClick={() => setIsMeetingShadowOpen(true)}
            className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500/30 text-rose-200/90 hover:text-white"
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>Gölge Noter</span>
          </button>

          <button
            onClick={() => setIsFutureSelfOpen(true)}
            className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border border-rose-500/30 text-rose-200/90 hover:text-white"
          >
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span>2031 Benliğim</span>
          </button>
        </div>

        {/* AYZEK OS 2026: 6 Yeni Cazibe Gücü (Crimson Obsidian Kokpit Vitrini) */}
        <div className="p-5 sm:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl crimson-orb-glow flex items-center justify-center font-bold text-white shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight">
                  AYZEK 2026 Süper Güçler & Bilişsel Kokpit
                </h3>
                <p className="text-[11px] text-rose-200/70">
                  Uygulamayı hayatının vazgeçilmez merkezine dönüştüren 6 özel yetenek
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Vizyon</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* 1. Voice Podcast */}
            <div
              onClick={() => setIsVoiceBriefingOpen(true)}
              className="p-3.5 rounded-2xl bg-[#14060b]/80 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">🎙️</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    İnsancıl Ses
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Sesli Sabah Brifingi
                </h4>
                <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-2">
                  Ekrana bakmadan Cem veya Elif sesleriyle 90 sn podcast brifingi
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 group-hover:text-rose-300 mt-2 flex items-center gap-1">
                Dinle <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* 2. Cognitive Wrapped */}
            <div
              onClick={() => setIsCognitiveWrappedOpen(true)}
              className="p-3.5 rounded-2xl bg-[#14060b]/80 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">📊</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Wrapped Formatı
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Bilişsel Yaşam Karnesi
                </h4>
                <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-2">
                  Haftalık derin odak zirveleri, kurtarılan saatler ve arketip hikayesi
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 group-hover:text-rose-300 mt-2 flex items-center gap-1">
                Karneni Gör <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* 3. Polite Decline */}
            <div
              onClick={() => setIsPoliteDeclineOpen(true)}
              className="p-3.5 rounded-2xl bg-[#14060b]/80 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">🛡️</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Sınır Kalkanı
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Benim İçin Hayır De
                </h4>
                <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-2">
                  Gereksiz toplantı ve taleplere 3 farklı tonda diplomatik red şablonu
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 group-hover:text-rose-300 mt-2 flex items-center gap-1">
                Koru <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* 4. Always-On Watch & Dynamic Island */}
            <div
              onClick={() => setIsAlwaysOnWatchOpen(true)}
              className="p-3.5 rounded-2xl bg-[#14060b]/80 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">⌚</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Canlı Kadran
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Dinamik Ada & Watch
                </h4>
                <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-2">
                  Apple Watch Titanium ve OLED Gece Masası Always-On kadranı
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 group-hover:text-rose-300 mt-2 flex items-center gap-1">
                Kadranı Aç <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* 5. Meeting Shadow AI */}
            <div
              onClick={() => setIsMeetingShadowOpen(true)}
              className="p-3.5 rounded-2xl bg-[#14060b]/80 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">🤝</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Otomatik Eylem
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Gölge Noter (Shadow AI)
                </h4>
                <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-2">
                  Toplantıdan kararları süz, tek tıkla ajandana görev olarak aktar
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 group-hover:text-rose-300 mt-2 flex items-center gap-1">
                Toplantıyı Çıkar <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* 6. Future Self Dialogue */}
            <div
              onClick={() => setIsFutureSelfOpen(true)}
              className="p-3.5 rounded-2xl bg-[#14060b]/80 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">🔮</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    2031 Simülasyonu
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Gelecekteki Benliğim
                </h4>
                <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-2">
                  5 yıl sonraki bilge benliğinle kariyer ve hayat ikilemlerini tartış
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 group-hover:text-rose-300 mt-2 flex items-center gap-1">
                Sohbet Başlat <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>

        {/* AYZEK OS 2026: Hayatın Merkezi Vizyon & Otonom Sütunlar Kartı */}
        <div
          onClick={() => setIsVisionModalOpen(true)}
          className="relative overflow-hidden p-5 rounded-[32px] bg-gradient-to-r from-[#1a050d] via-[#260814] to-[#120409] text-white border border-rose-500/35 shadow-2xl cursor-pointer hover:border-rose-400 transition-all group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl crimson-orb-glow text-white border border-rose-400/30 flex items-center justify-center font-bold shrink-0 shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white group-hover:text-rose-300 transition-colors">
                    AYZEK 2026: Neden Hayatın Merkezi?
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    6 Temel Sütun
                  </span>
                </div>
                <p className="text-[11px] text-rose-200/70 mt-0.5 line-clamp-1">
                  Otonom arka plan koruması, Monte Carlo yaşam simülatörü, biyo-ritim ve vefa kasası.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-300 shrink-0 group-hover:translate-x-1 transition-transform">
              <span className="hidden sm:inline">İncele & Test Et</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. İş & Özel Hayat Dengesi Card */}
      <section className="p-5 md:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4 transition-all">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl crimson-orb-glow text-white flex items-center justify-center font-bold shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  İş & Özel Hayat Dengesi
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {balance.status} · %{balance.score}
                </span>
              </div>
              <p className="text-xs text-rose-200/60">
                Teams, Gmail, Meet, Zoom, Takvimler, WhatsApp & Telegram aktif
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('merkez')}
            className="frosted-pill-button px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Yönet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status badges row */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-200 border border-rose-500/25">
            Teams: 2 Toplantı
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-200 border border-rose-500/25">
            Gmail: E-Fatura Aksiyonu
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-200 border border-rose-500/25">
            WhatsApp: Konuşma Analizi
          </span>
          <button
            onClick={toggleSmartGuard}
            className={`px-3 py-1 rounded-lg transition-colors border cursor-pointer ${
              balance.smartGuardActive
                ? 'coral-gradient text-white font-bold border-rose-400 shadow-sm'
                : 'bg-white/5 text-rose-200/50 border-rose-500/20 line-through'
            }`}
          >
            Smart Guard: 18:00 Koruma
          </button>
        </div>
      </section>

      {/* 3. BUGÜN NASILSIN? Check-in Card */}
      <section className="p-5 md:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4.5 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl crimson-orb-glow flex items-center justify-center shrink-0 shadow-md">
            <span className="text-xl">😊</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
              Bugün Nasılsın?
            </h2>
            <p className="text-xs text-rose-200/70 mt-0.5">
              Enerji, ruh hali ve odağını kaydet; AYZEK günün planını ve tavsiyelerini sana uyarlasın.
            </p>
          </div>
        </div>

        {/* Enerji Seviyesi */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
            <span>⚡</span>
            <span>Enerji Seviyen:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleEnergySelect('low')}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                checkin.energy === 'low'
                  ? 'coral-gradient text-white font-bold border-rose-400 shadow-md'
                  : 'bg-[#14060a]/80 hover:bg-[#1f0810] text-rose-200 border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>🪫</span>
                <span className="text-xs font-bold">Düşük</span>
              </div>
              <p className="text-[10px] text-rose-200/60 mt-1 line-clamp-1">
                Dinlenme & sakinlik lazım
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleEnergySelect('balanced')}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                checkin.energy === 'balanced'
                  ? 'coral-gradient text-white font-bold border-rose-400 shadow-md'
                  : 'bg-[#14060a]/80 hover:bg-[#1f0810] text-rose-200 border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>⚡</span>
                <span className="text-xs font-bold">Dengeli</span>
              </div>
              <p className="text-[10px] text-rose-200/60 mt-1 line-clamp-1">
                Rutin tempoda
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleEnergySelect('high')}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                checkin.energy === 'high'
                  ? 'coral-gradient text-white font-bold border-rose-400 shadow-md'
                  : 'bg-[#14060a]/80 hover:bg-[#1f0810] text-rose-200 border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>🔥</span>
                <span className="text-xs font-bold">Yüksek</span>
              </div>
              <p className="text-[10px] text-rose-200/60 mt-1 line-clamp-1">
                Dinamik & üretken
              </p>
            </button>
          </div>
        </div>

        {/* Ruh Halin / Duygun */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
            <span>❤️</span>
            <span>Ruh Halin / Duygun:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(
              [
                { id: 'calm', label: 'Dingin', icon: '🧘' },
                { id: 'cheerful', label: 'Neşeli', icon: '😊' },
                { id: 'inspired', label: 'İlham Dolu', icon: '✨' },
                { id: 'tired', label: 'Yorgun', icon: '😴' },
                { id: 'anxious', label: 'Telaşlı', icon: '⚡' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMoodSelect(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  checkin.mood === m.id
                    ? 'coral-gradient text-white font-bold border-rose-400 shadow-sm'
                    : 'bg-[#14060a]/80 hover:bg-[#1f0810] text-rose-200 border-rose-500/20'
                }`}
              >
                <span className="mr-1">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Zihinsel Odaklanma */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
            <span>🎯</span>
            <span>Zihinsel Odaklanma:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFocusSelect('scattered')}
              className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer ${
                checkin.focus === 'scattered'
                  ? 'coral-gradient text-white font-bold border-rose-400 shadow-sm'
                  : 'bg-[#14060a]/80 hover:bg-[#1f0810] text-rose-200 border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>💭</span>
                <span className="text-xs font-bold">Dağınık</span>
              </div>
              <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-1">
                Hafif molalar gerekli
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleFocusSelect('balanced')}
              className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer ${
                checkin.focus === 'balanced'
                  ? 'coral-gradient text-white font-bold border-rose-400 shadow-sm'
                  : 'bg-[#14060a]/80 hover:bg-[#1f0810] text-rose-200 border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>⚖️</span>
                <span className="text-xs font-bold">Dengeli</span>
              </div>
              <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-1">
                Normal iş akışı
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleFocusSelect('deep')}
              className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer ${
                checkin.focus === 'deep'
                  ? 'coral-gradient text-white font-bold border-rose-400 shadow-sm'
                  : 'bg-[#14060a]/80 hover:bg-[#1f0810] text-rose-200 border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>🎯</span>
                <span className="text-xs font-bold">Derin Odak</span>
              </div>
              <p className="text-[10px] text-rose-200/60 mt-0.5 line-clamp-1">
                Karmaşık işler için ideal
              </p>
            </button>
          </div>
        </div>

        {/* Input & Action */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={checkin.note}
            onChange={(e) => updateCheckin({ note: e.target.value })}
            placeholder="Kısa bir not (örn: Sabah biraz yorgundum, hafif tempo iyi gelir)..."
            className="flex-1 px-4 py-2.5 rounded-full text-xs bg-[#130509]/80 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
          />

          <button
            type="button"
            onClick={fetchPersonalAdvice}
            disabled={isAdviceLoading}
            className="coral-gradient hover:opacity-95 text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950/40 cursor-pointer disabled:opacity-50"
          >
            {isAdviceLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Tavsiye Al</span>
          </button>
        </div>

        {/* Display AI Advice if exists */}
        {checkin.aiAdvice && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-100 text-xs flex items-start gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <div>
              <span className="font-bold text-rose-300 block mb-0.5">
                AYZEK Günün Bilişsel Önerisi ({checkin.updatedAt}):
              </span>
              <p className="leading-relaxed">{checkin.aiAdvice}</p>
            </div>
          </div>
        )}
      </section>

      {/* 4. YAŞAM KOÇU & BİLGE REHBER */}
      <section className="p-5 md:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl crimson-orb-glow flex items-center justify-center font-bold text-xs text-white">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Yaşam Koçu Notu
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {coachGoal.category}
                </span>
              </div>
              <p className="text-[11px] text-rose-200/60">
                {coachGoal.timeline} · {coachGoal.subtext}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-rose-300">
              %{coachGoal.progress}
            </span>
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
              {coachGoal.progressDelta}
            </span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white">
          {coachGoal.title}
        </h3>

        {/* Progress line */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="coral-gradient h-full rounded-full transition-all duration-500"
            style={{ width: `${coachGoal.progress}%` }}
          />
        </div>

        {/* Coach Quote Container */}
        <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 shadow-sm space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm italic font-medium text-rose-100 leading-relaxed">
              "{coachGoal.quote}"
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 pt-1">
            <span>⚡</span>
            <span>{coachGoal.microStep}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <button
            onClick={() =>
              openAssistantWithQuery(
                `Yaşam Koçu olarak İngilizce C1 hedefim hakkında 15 dakikalık pratik planı yapalım.`
              )
            }
            className="text-xs font-semibold text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Koçla Konuş</span>
          </button>

          <button
            onClick={() =>
              openAssistantWithQuery('15 dakikalık İngilizce podcast dinleme görevini bugünkü planıma ekle.')
            }
            className="frosted-pill-button px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Planıma Ekle (15 Dk)</span>
          </button>
        </div>
      </section>

      {/* 5. Bugünkü Rutin & Zaman Dağılımı */}
      <section className="p-5 md:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-3 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">
              Bugünkü Rutin & Zaman Dağılımı
            </h3>
          </div>
          <span className="text-xs text-rose-200/60">
            {routineSummary.workHours}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-[#14060a]/90 border border-rose-500/20">
            <span className="text-[11px] text-rose-200/60 block">
              Tamamlanan
            </span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              {routineSummary.completedCount} Görev
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#14060a]/90 border border-rose-500/20">
            <span className="text-[11px] text-rose-200/60 block">
              Kalan İş
            </span>
            <span className="text-base font-bold text-rose-300 mt-0.5 block">
              {routineSummary.remainingCount} Görev
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#14060a]/90 border border-rose-500/20">
            <span className="text-[11px] text-rose-200/60 block">
              Akşam Boşluğu
            </span>
            <span className="text-base font-bold text-amber-300 mt-0.5 block">
              ~{routineSummary.eveningFreeMinutes} Dk
            </span>
          </div>
        </div>
      </section>

      {/* 6. BİYOLOJİK HORMONAL RİTİM */}
      <section className="p-5 md:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl crimson-orb-glow text-white flex items-center justify-center font-bold text-xs">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Biyolojik Hormonal Ritim
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Gün {bioRhythm.day}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {bioRhythm.phase}
              </h3>
            </div>
          </div>

          <button
            onClick={() =>
              openAssistantWithQuery(
                `Biyolojik hormonal ritmim (Foliküler evre, Gün 8) için bugünkü beslenme ve egzersiz planını optimize et.`
              )
            }
            className="text-xs font-semibold text-rose-300 hover:text-white cursor-pointer transition-colors"
          >
            Düzenle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#14060a]/90 border border-rose-500/20">
            <span className="text-[11px] font-semibold text-rose-300 block mb-1">
              Beden & Antrenman
            </span>
            <p className="text-xs text-rose-100/80 leading-relaxed">
              {bioRhythm.physicalAdvice}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#14060a]/90 border border-rose-500/20">
            <span className="text-[11px] font-semibold text-rose-300 block mb-1">
              Zihinsel Odak
            </span>
            <p className="text-xs text-rose-100/80 leading-relaxed">
              {bioRhythm.mentalAdvice}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-rose-200/60">
            Sonraki Beklenen: {bioRhythm.nextExpectedDate}
          </span>

          <button
            onClick={() =>
              openAssistantWithQuery(
                'Foliküler evre için bugünümü yüksek odaklı projelere göre optimize et.'
              )
            }
            className="coral-gradient hover:opacity-95 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Günü Optimize Et</span>
          </button>
        </div>
      </section>

      {/* 7. İKİLEM ÇÖZÜCÜ & KARAR MATRİSİ */}
      <section className="p-5 md:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl crimson-orb-glow text-white flex items-center justify-center font-bold shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  İkilem Çözücü & Karar Matrisi
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Psikolog & Stratejist
                </span>
              </div>
              <p className="text-xs text-rose-200/60">
                Hedeflerine, bütçene ve değerlerine göre artı-eksi analiz tablosu
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedDilemma(dilemmas[0]);
              setIsDecisionModalOpen(true);
            }}
            className="coral-gradient hover:opacity-95 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-950/40 whitespace-nowrap cursor-pointer"
          >
            <span>Karar Matrisi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Dilemma Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {dilemmas.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                setSelectedDilemma(d);
                setIsDecisionModalOpen(true);
              }}
              className="p-3.5 rounded-2xl bg-[#14060a]/90 hover:bg-[#1f0810] border border-rose-500/20 hover:border-rose-400/50 flex items-center justify-between cursor-pointer transition-colors shadow-sm"
            >
              <span className="text-xs font-medium text-rose-100 line-clamp-1 pr-2">
                "{d.title}"
              </span>
              <span className="text-xs font-bold whitespace-nowrap text-rose-300 font-mono">
                %{d.alignmentScore} {d.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. AYZEK PROAKTİF HATIRLATMA */}
      {proactiveAlert && proactiveAlert.active && (
        <section className="p-5 rounded-[32px] crimson-glass border-2 border-rose-500/40 text-white shadow-2xl space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                {proactiveAlert.title}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-rose-200/60">
              {proactiveAlert.time}
            </span>
          </div>

          <p className="text-sm font-semibold text-white leading-relaxed">
            {proactiveAlert.content}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                openAssistantWithQuery('Market alışveriş listesini aç ve eksikleri kontrol et.');
              }}
              className="coral-gradient hover:opacity-95 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-rose-950/40 cursor-pointer"
            >
              {proactiveAlert.actionLabel}
            </button>

            <button
              onClick={dismissProactiveAlert}
              className="text-xs font-medium text-rose-200/60 hover:text-white transition-colors cursor-pointer"
            >
              {proactiveAlert.dismissLabel}
            </button>
          </div>
        </section>
      )}

      {/* 8.1. BİLİŞSEL YAŞAM, ARAŞTIRMA & PROAKTİF SIRDAŞ KEŞİFLERİ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              BİLİŞSEL YAŞAM & PROAKTİF REHBERLİK
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Seni Tanıyan Yapay Zeka
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {proactiveInsights.map((insight) => (
            <div
              key={insight.id}
              className="p-5 rounded-[28px] bg-[#14060a]/90 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 shadow-xl space-y-3 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-rose-300 border border-rose-500/25">
                    {insight.badge}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                </div>

                <h4 className="text-sm font-extrabold text-white group-hover:text-rose-300 transition-colors">
                  {insight.title}
                </h4>

                <p className="text-xs text-rose-100/80 leading-relaxed">
                  {insight.snippet}
                </p>
              </div>

              <div className="pt-2 border-t border-rose-500/15 flex items-center justify-between">
                <button
                  onClick={() => openAssistantWithQuery(insight.actionPrompt)}
                  className="text-xs font-bold text-rose-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{insight.type === 'psychology' ? 'Sırdaşına Anlat' : 'AYZEK ile Değerlendir'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-rose-300/60 font-mono">Canlı Analiz</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8.2. ARKA PLANDA ÇALIŞAN OTONOM ASİSTAN */}
      <section className="p-5 sm:p-6 rounded-[32px] crimson-glass text-white border border-rose-500/25 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl crimson-orb-glow text-white flex items-center justify-center">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                OTONOM ARKA PLAN ASİSTANI (2026 MOTORU)
              </h3>
              <p className="text-[11px] text-rose-200/60">
                Uygulama kapalıyken bile ajandanı, trafiği ve e-postalarını sessizce korur
              </p>
            </div>
          </div>

          <button
            onClick={runAutonomousScan}
            disabled={isScanningLogs}
            className="frosted-pill-button px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningLogs ? 'animate-spin' : ''}`} />
            <span>{isScanningLogs ? 'Taranıyor...' : 'Şimdi Canlı Tara'}</span>
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {autonomousLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] text-rose-400 font-bold mt-0.5 shrink-0">
                  {log.time}
                </span>
                <div>
                  <h5 className="font-bold text-white">{log.title}</h5>
                  <p className="text-[11px] text-rose-200/70 mt-0.5 leading-relaxed">
                    {log.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium shrink-0">
                <Check className="w-3 h-3" />
                <span>Tamamlandı</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Actionable Items & Reminders */}
      <section className="space-y-2.5">
        {tasks
          .filter((t) => !t.isCompleted)
          .map((task) => (
            <div
              key={task.id}
              className="p-4 sm:p-5 rounded-[28px] bg-[#14060a]/90 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 shadow-xl flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors bg-white/5 hover:bg-white/10 border border-white/10 dark:border-rose-500/20 cursor-pointer"
                >
                  {task.category === 'alisveris' && (
                    <ShoppingBag className="w-5 h-5 text-rose-400" />
                  )}
                  {task.category === 'finans' && (
                    <CreditCard className="w-5 h-5 text-amber-400" />
                  )}
                  {task.category === 'aile' && (
                    <Gift className="w-5 h-5 text-rose-400" />
                  )}
                  {task.category === 'is' && (
                    <CheckCircle2 className="w-5 h-5 text-rose-300" />
                  )}
                  {task.category === 'kisisel' && (
                    <Heart className="w-5 h-5 text-emerald-400" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      {task.title}
                    </h4>
                    {task.badgeText && (
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                        {task.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-rose-200/60 mt-0.5">
                    {task.time} · {task.highlight}
                  </p>
                </div>
              </div>

              {task.actionType === 'draft_message' ? (
                <button
                  onClick={() => generateDraft('Annem', 'Doğum Günü')}
                  className="frosted-pill-button px-3 py-1.5 rounded-full text-xs font-bold text-rose-200 hover:text-white flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>✉️ Mesaj Hazırla</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    openAssistantWithQuery(`"${task.title}" görevi hakkında detay ver ve aksiyonu başlat.`)
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-rose-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
      </section>
    </div>
  );
};
