import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Sliders,
  Calendar,
  X,
  Radio,
  UserCheck,
  ChevronRight,
  Headphones,
} from 'lucide-react';

export const VoiceBriefingModal: React.FC = () => {
  const {
    isVoiceBriefingOpen,
    setIsVoiceBriefingOpen,
    bioRhythm,
    userProfile,
    tasks,
    balance,
    openAssistantWithQuery,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [selectedVoice, setSelectedVoice] = useState<'cem' | 'elif'>('cem');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<any>(null);

  const sentences = [
    `Merhaba ${userProfile?.displayName?.split(' ')[0] || 'orada'}.`,
    tasks.length > 0 ? `Bugün için ${tasks.filter((task) => !task.isCompleted).length} açık görevin var.` : 'Bugün için henüz görev eklemedin.',
    bioRhythm.phase !== 'Ayarlanmadı' ? `Kişisel ritim notun: ${bioRhythm.phase}.` : 'Kişisel ritim değerlendirmesi henüz ayarlanmadı.',
    balance.smartGuardActive ? 'Smart Guard tercihin açık.' : 'Smart Guard tercihin kapalı.',
    'Bağlı servislerden doğrulanmış veri olmadığında ek varsayım yapmam.',
    'İstersen bir hedef veya görev ekleyerek gününü planlamaya başlayabilirsin.',
  ];

  const fullBriefingText = sentences.join(' ');

  // Initialize SpeechSynthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopAudio();
    };
  }, []);

  // Stop when modal closes
  useEffect(() => {
    if (!isVoiceBriefingOpen) {
      stopAudio();
    }
  }, [isVoiceBriefingOpen]);

  // Play audio chime and voice
  const playAudio = () => {
    if (isPlaying) {
      pauseAudio();
      return;
    }

    setIsSynthesizing(true);

    // Play subtle soft acoustic chime using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {}

    if (synthRef.current) {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(fullBriefingText);
      utterance.lang = 'tr-TR';
      utterance.rate = playbackSpeed * (selectedVoice === 'cem' ? 0.95 : 1.02);
      utterance.pitch = selectedVoice === 'cem' ? 0.88 : 1.08;

      // Try finding natural Turkish voices
      const voices = synthRef.current.getVoices();
      const turkishVoices = voices.filter((v) => v.lang.startsWith('tr'));
      if (turkishVoices.length > 0) {
        if (selectedVoice === 'cem') {
          const maleVoice = turkishVoices.find(
            (v) =>
              v.name.toLowerCase().includes('cem') ||
              v.name.toLowerCase().includes('erkek') ||
              v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('tolga')
          );
          utterance.voice = maleVoice || turkishVoices[0];
        } else {
          const femaleVoice = turkishVoices.find(
            (v) =>
              v.name.toLowerCase().includes('yelda') ||
              v.name.toLowerCase().includes('elif') ||
              v.name.toLowerCase().includes('kadın') ||
              v.name.toLowerCase().includes('female')
          );
          utterance.voice = femaleVoice || turkishVoices[0];
        }
      }

      utterance.onstart = () => {
        setIsSynthesizing(false);
        setIsPlaying(true);
        startProgressSimulation();
      };

      utterance.onend = () => {
        stopAudio();
        setProgress(100);
        setActiveSentenceIndex(sentences.length - 1);
      };

      utterance.onerror = () => {
        // Fallback progress simulation if speech API is restricted
        setIsSynthesizing(false);
        setIsPlaying(true);
        startProgressSimulation();
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } else {
      // Browser doesn't support Web Speech, fallback to simulated play
      setIsSynthesizing(false);
      setIsPlaying(true);
      startProgressSimulation();
    }
  };

  const startProgressSimulation = () => {
    clearInterval(progressTimerRef.current);
    const totalDurationSeconds = 48 / playbackSpeed;
    const intervalMs = 250;
    const step = 100 / ((totalDurationSeconds * 1000) / intervalMs);

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        const sentenceIdx = Math.min(
          sentences.length - 1,
          Math.floor((next / 100) * sentences.length)
        );
        setActiveSentenceIndex(sentenceIdx);

        if (next >= 100) {
          clearInterval(progressTimerRef.current);
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
    }, intervalMs);
  };

  const pauseAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    clearInterval(progressTimerRef.current);
    setIsPlaying(false);
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    clearInterval(progressTimerRef.current);
    setIsPlaying(false);
    setProgress(0);
    setActiveSentenceIndex(0);
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      pauseAudio();
      setTimeout(() => playAudio(), 100);
    }
  };

  if (!isVoiceBriefingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-sky-500/20 via-indigo-500/10 to-transparent pointer-events-none" />

        {/* Header Bar */}
        <div className="relative px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  07:45 Sesli Sabah Brifingi
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Canlı Podcast
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ekranı açmadan güne 1-0 önde başla
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVoiceBriefingOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Voice Character Selection */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              Ses Karakteri & Tonlama
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedVoice('cem');
                  if (isPlaying) {
                    pauseAudio();
                    setTimeout(() => playAudio(), 100);
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedVoice === 'cem'
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Cem (Tok & Dingin)</span>
                  {selectedVoice === 'cem' && (
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Baş Danışman & Radyo Spikeri
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedVoice('elif');
                  if (isPlaying) {
                    pauseAudio();
                    setTimeout(() => playAudio(), 100);
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedVoice === 'elif'
                    ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-sm'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Elif (Bilişsel Mentör)</span>
                  {selectedVoice === 'elif' && (
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Şefkatli & Yüksek Berraklık
                </p>
              </button>
            </div>
          </div>

          {/* Audio Waveform & Equalizer Visualizer */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-end justify-center gap-1.5 h-14 w-full px-6">
              {[40, 75, 55, 95, 30, 85, 60, 100, 45, 90, 70, 80, 50, 65, 85, 40].map(
                (baseHeight, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlaying ? `${Math.max(15, (baseHeight * (i % 2 === 0 ? 0.9 : 1.2)))}%` : '18%',
                      animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    }}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-sky-500 to-cyan-300 shadow-xs shadow-cyan-400/50'
                        : 'bg-slate-700'
                    }`}
                  />
                )
              )}
            </div>

            {/* Scrubber Timeline */}
            <div className="w-full space-y-1">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-sky-400 to-indigo-400 h-full transition-all duration-300"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>00:{Math.floor((progress * 48) / 100).toString().padStart(2, '0')}</span>
                <span>00:48</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between w-full pt-1">
              {/* Speed Buttons */}
              <div className="flex items-center gap-1">
                {[1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changeSpeed(speed)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-sky-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Main Play / Pause Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={stopAudio}
                  title="Başa Sar"
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={playAudio}
                  disabled={isSynthesizing}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 hover:opacity-95 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-transform active:scale-95"
                >
                  {isSynthesizing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Ses Hazırlanıyor...</span>
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>Duraklat</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>Brifingi Dinle</span>
                    </>
                  )}
                </button>
              </div>

              {/* Voice icon */}
              <div className="flex items-center text-xs text-sky-400">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Dynamic Interactive Transcript */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-300">
                Canlı Metin Senkronizasyonu:
              </span>
              <span className="text-[10px] text-sky-400">
                Cümle {activeSentenceIndex + 1}/{sentences.length}
              </span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs leading-relaxed">
              {sentences.map((sentence, idx) => (
                <p
                  key={idx}
                  onClick={() => {
                    setActiveSentenceIndex(idx);
                    setProgress(Math.floor((idx / sentences.length) * 100));
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeSentenceIndex === idx
                      ? 'bg-sky-500/20 text-sky-200 border-l-2 border-sky-400 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sentence}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              setIsVoiceBriefingOpen(false);
              openAssistantWithQuery('Günün brifingiyle ilgili sorularım var.');
            }}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>AYZEK'e Soru Sor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsVoiceBriefingOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-200 text-slate-950 transition-colors"
          >
            Tamamlandı
          </button>
        </div>
      </div>
    </div>
  );
};
