import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Watch,
  X,
  Smartphone,
  Monitor,
  Moon,
  Battery,
  Zap,
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const AlwaysOnWatchModal: React.FC = () => {
  const {
    isAlwaysOnWatchOpen,
    setIsAlwaysOnWatchOpen,
    userProfile,
    bioRhythm,
    tasks,
    balance,
  } = useApp();

  const [activeMode, setActiveMode] = useState<'watch' | 'dynamic_island' | 'standby'>('watch');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [islandExpanded, setIslandExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAlwaysOnWatchOpen) return null;

  const hoursStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const secondsStr = currentTime.getSeconds().toString().padStart(2, '0');
  const dateStr = currentTime.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const nextTask = tasks.find((t) => !t.isCompleted) || {
    title: 'Akşam Zihinsel Dinlenme & Rutin',
    time: '18:00',
    category: 'balance',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl text-white">
      <div className="relative w-full max-w-xl min-h-[520px] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Görünüm:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveMode('watch')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeMode === 'watch'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Watch className="w-3.5 h-3.5" />
                <span>Apple Watch</span>
              </button>

              <button
                onClick={() => setActiveMode('dynamic_island')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeMode === 'dynamic_island'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Dinamik Ada</span>
              </button>

              <button
                onClick={() => setActiveMode('standby')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeMode === 'standby'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Gece Masası (StandBy)</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsAlwaysOnWatchOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Display Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          {/* 1. Apple Watch Ultra Titanium Mode */}
          {activeMode === 'watch' && (
            <div className="relative w-64 h-80 rounded-[44px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-3 shadow-2xl border-4 border-slate-600 flex flex-col justify-between">
              {/* Watch Glass Surface */}
              <div className="w-full h-full rounded-[36px] bg-black p-4 flex flex-col justify-between relative overflow-hidden border border-slate-800">
                {/* Complications Top */}
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <div className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>68 BPM</span>
                  </div>
                  <div className="text-amber-400 font-mono">
                    HRV 64ms
                  </div>
                </div>

                {/* Main Big Digital Clock */}
                <div className="text-center my-auto">
                  <div className="text-5xl font-black tracking-tight font-mono text-cyan-300">
                    {hoursStr}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    {dateStr}
                  </div>
                </div>

                {/* Complication Bottom: Next Action */}
                <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
                  <div className="flex items-center justify-between text-[10px] text-sky-400 font-bold mb-0.5">
                    <span>AYZEK NÖBETÇİ</span>
                    <span>{nextTask.time || '14:00'}</span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">
                    {nextTask.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    15 dk Akıllı Tampon Hazır
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. iOS Dynamic Island Mode */}
          {activeMode === 'dynamic_island' && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm">
              <span className="text-xs text-slate-400">
                Genişletmek için adanın üzerine tıklayın:
              </span>

              {/* Dynamic Island Capsule */}
              <div
                onClick={() => setIslandExpanded(!islandExpanded)}
                className={`cursor-pointer transition-all duration-300 ease-out bg-black border border-white/20 rounded-full shadow-2xl flex items-center justify-between px-4 py-2.5 select-none ${
                  islandExpanded
                    ? 'w-full h-28 rounded-3xl p-4 flex-col justify-between'
                    : 'w-72 h-10 hover:w-80'
                }`}
              >
                {!islandExpanded ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-xs font-black text-cyan-300">
                        AYZEK OS
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                      <span>42 dk Derin Odak</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col justify-between text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-white">
                          Foliküler Faz (Zihinsel Zirve)
                        </span>
                      </div>
                      <span className="text-xs font-mono text-cyan-300 font-bold">
                        {hoursStr}:{secondsStr}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                      Sonraki: <strong>{nextTask.title}</strong> ({nextTask.time})
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 text-center max-w-xs">
                iPhone 15/16 Pro Dinamik Ada canlı bildirim simülatörü. Canlı aktivite (Live Activity) olarak kilit ekranında daima görünür kalır.
              </p>
            </div>
          )}

          {/* 3. Desktop StandBy Mode */}
          {activeMode === 'standby' && (
            <div className="text-center space-y-4">
              <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                {hoursStr}
                <span className="text-4xl text-slate-600 font-normal">:{secondsStr}</span>
              </div>
              <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                {dateStr}
              </p>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-md mx-auto text-xs text-slate-300 italic">
                "Zihnin efendisi ol, günün kölesi değil. 18:00 sonrası dinginliğin korunuyor."
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Oura & HealthKit Senkron: 1 dk önce</span>
          </div>

          <button
            onClick={() => setIsAlwaysOnWatchOpen(false)}
            className="px-3.5 py-1.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
