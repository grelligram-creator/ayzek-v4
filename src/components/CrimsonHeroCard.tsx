import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  Headphones,
  Sparkles,
  ChevronRight,
  Shield,
  Activity,
  MoreHorizontal,
  Flame,
  Volume2,
} from 'lucide-react';

export const CrimsonHeroCard: React.FC = () => {
  const {
    setIsVoiceBriefingOpen,
    setIsCognitiveWrappedOpen,
    setIsAssistantOpen,
    userProfile,
    tasks,
    balance,
  } = useApp();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const nextFocusTask = tasks.find((t) => !t.isCompleted);

  return (
    <div className="space-y-4">
      {/* 1. Large Display Editorial Title (Playfair Display) */}
      <div className="text-center pt-1 pb-1">
        <h1 className="ayzek-editorial-title font-display text-2xl sm:text-4xl tracking-normal font-normal">
          Hayatını Bilişsel Berraklıkla
        </h1>
        <p className="ayzek-editorial-subtitle font-display text-2xl sm:text-4xl italic">
          Yönet & Dengede Kal
        </p>
      </div>

      {/* 2. Layered Crimson Glassmorphic Hero Container (Screen 1 & 3 Aesthetic) */}
      <div className="ayzek-hero relative rounded-[32px] sm:rounded-[36px] p-5 sm:p-7 overflow-hidden group">
        <img
          src="/assets/ayzek-liquid-ribbons.png"
          alt=""
          aria-hidden="true"
          className="ayzek-hero-ribbons"
        />
        {/* Ambient Top Glow Spot */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-600/35 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 3D Crimson Soundwave Sphere (Orb) from Screen 3 */}
        <div className="flex flex-col items-center justify-center py-4 relative z-10">
          <div
            onClick={() => setIsVoiceBriefingOpen(true)}
            className="ayzek-orb relative w-36 h-36 sm:w-44 sm:h-44 rounded-full crimson-orb-glow flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-105 active:scale-95 group/orb"
          >
            <img
              src="/assets/ayzek-liquid-orb.png"
              alt=""
              aria-hidden="true"
              className="ayzek-orb-art"
            />
            {/* Outer Orbital Rings */}
            <div className="absolute inset-0 rounded-full border border-rose-400/30 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-rose-500/20 rotate-45" />

            {/* Glass Sphere Inner Highlights */}
            <div className="absolute top-3 left-6 w-10 h-6 bg-white/40 rounded-full blur-[2px] rotate-[-25deg] pointer-events-none" />

            {/* Glowing Soundwave Graphic in Center of Sphere */}
            <div className="flex items-center gap-1 z-10">
              {[20, 45, 70, 95, 60, 85, 40, 100, 50, 80, 60, 30].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse"
                />
              ))}
            </div>

            {/* Hover Play Indicator */}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover/orb:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-full bg-white text-rose-950 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 fill-rose-950 ml-0.5" />
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 font-mono">
              AYZEK BİLİŞSEL MERKEZ
            </span>
            <p className="ayzek-hero-meta text-xs mt-0.5">
              Günlük brifing, yalnızca eklediğiniz bilgilerle hazırlanır
            </p>
          </div>
        </div>

        {/* Frosted Glass Pill Action Button (Matches "Generate music" button from Screen 1) */}
        <div className="pt-2 relative z-10">
          <button
            onClick={() => setIsVoiceBriefingOpen(true)}
            className="ayzek-audio-control w-full py-3.5 px-6 rounded-full text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer relative z-10"
          >
            <Headphones className="w-4 h-4 text-rose-400" />
            <span>Sesli Brifingi Dinle</span>
          </button>
        </div>
      </div>

      {/* 3. Featured Highlight Cards (Matches "Global Hits 50" & "Ai Originals 08" Sunset Gradient from Screen 2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="ayzek-text-primary text-sm font-bold tracking-tight">
            Öne Çıkan Yaşam Metrikleri
          </h3>
          <button
            onClick={() => setIsCognitiveWrappedOpen(true)}
            className="ayzek-action text-xs font-medium transition-colors"
          >
            Tümünü Gör
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Ruby/Coral Gradient */}
          <div
            onClick={() => setIsCognitiveWrappedOpen(true)}
            className="ayzek-metric-card coral-gradient rounded-[24px] p-4 text-white shadow-xl shadow-rose-950/40 relative overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80 mb-2">
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
              <span>Haftalık Odak</span>
            </div>

            <p className="text-xs font-medium text-white/90">Derin Çalışma</p>
            <div className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
              38 <span className="text-lg font-bold">Saat</span>
            </div>

            {/* Play Button at Bottom Right (from Screenshot 2) */}
            <div className="absolute bottom-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </div>
          </div>

          {/* Card 2: Sunset Coral/Amber Gradient */}
          <div
            onClick={() => setIsCognitiveWrappedOpen(true)}
            className="ayzek-metric-card bg-gradient-to-br from-[#ff462e] via-[#ff6838] to-[#ff9436] rounded-[24px] p-4 text-white shadow-xl shadow-rose-950/40 relative overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80 mb-2">
              <Activity className="w-3.5 h-3.5 text-white" />
              <span>Denge Kalkanı</span>
            </div>

            <p className="text-xs font-medium text-white/90">İş & Yaşam Dengesi</p>
            <div className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
              %{balance.score}
            </div>

            {/* Play Button at Bottom Right */}
            <div className="absolute bottom-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Floating Mini Player Bar (Matches "Cloud Thought - Lo-Fi" bar at bottom of Screen 2) */}
      <div className="ayzek-inner-card p-3.5 rounded-2xl backdrop-blur-xl flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="ayzek-text-primary text-xs font-bold truncate">
              {nextFocusTask?.title || 'Henüz odak görevi yok'}
            </h4>
            <p className="ayzek-text-muted text-[10px] truncate">
              {nextFocusTask ? nextFocusTask.time : 'Planından ilk görevi ekleyerek başlayabilirsin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsVoiceBriefingOpen(true)}
            className="w-8 h-8 rounded-full ayzek-pill-primary flex items-center justify-center transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-rose-950 ml-0.5" />
          </button>
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="w-8 h-8 rounded-full hover:bg-white/10 text-rose-200 flex items-center justify-center transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
