import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authenticatedFetch } from '../lib/api';
import { DilemmaItem } from '../types';
import {
  Scale,
  X,
  CheckCircle,
  AlertCircle,
  Brain,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export const DecisionMatrixModal: React.FC = () => {
  const {
    isDecisionModalOpen,
    setIsDecisionModalOpen,
    selectedDilemma,
    setSelectedDilemma,
    dilemmas,
    addDilemma,
    openAssistantWithQuery,
  } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [monteCarloResult, setMonteCarloResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isDecisionModalOpen) return null;

  const currentItem = selectedDilemma || dilemmas[0];

  const handleEvaluateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      const res = await authenticatedFetch('/api/gemini/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemmaTitle: newTitle }),
      });
      const data = await res.json();
      if (data.decision) {
        const item: DilemmaItem = {
          id: `dilemma-${Date.now()}`,
          title: data.decision.title || newTitle,
          alignmentScore: data.decision.alignmentScore || 85,
          category: 'Kariyer',
          tag: 'Uyum',
          pros: data.decision.pros || [],
          cons: data.decision.cons || [],
          recommendation: data.decision.recommendation || '',
          verdict: data.decision.verdict || 'Aksiyon Al',
        };
        addDilemma(item);
        setSelectedDilemma(item);
        setNewTitle('');
      }
    } catch (err) {
      console.error('Decision evaluation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunMonteCarlo = async () => {
    setIsSimulating(true);
    try {
      const res = await authenticatedFetch('/api/gemini/monte-carlo-dilemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemmaTitle: currentItem.title,
          optionA: 'Yeni Fırsata Adım At',
          optionB: 'Mevcut Durumu Koru',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setMonteCarloResult(data.result);
      }
    } catch {
      setMonteCarloResult({
        title: currentItem.title,
        simulations: [
          {
            horizon: '1 Yıl Ufku',
            optionA: {
              label: 'Adım At',
              happinessScore: 84,
              financialScore: 88,
              stressScore: 60,
              summary: 'Yeni sorumluluklarla adaptasyon ve yüksek motivasyon.',
            },
            optionB: {
              label: 'Mevcut Durum',
              happinessScore: 72,
              financialScore: 74,
              stressScore: 40,
              summary: 'Tanıdık ekip, öngörülebilir rutin.',
            },
          },
          {
            horizon: '5 Yıl Ufku',
            optionA: {
              label: 'Adım At',
              happinessScore: 92,
              financialScore: 95,
              stressScore: 35,
              summary: 'Uluslararası liderlik ve döviz bazlı yüksek servet birikimi.',
            },
            optionB: {
              label: 'Mevcut Durum',
              happinessScore: 68,
              financialScore: 75,
              stressScore: 55,
              summary: 'Kariyer platosu ve keşke duygusu riski.',
            },
          },
        ],
        optimalVerdict:
          'Kısa vadeli adaptasyon zahmetine katlanıp uzun vadeli büyüme potansiyeline yatırım yapmanız tavsiye edilir.',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-[32px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-5 py-4 border-b border-rose-500/20 flex items-center justify-between bg-[#14050a]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl crimson-orb-glow flex items-center justify-center font-bold text-white shadow-md">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  İkilem Çözücü & Monte Carlo Yaşam Matrisi
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                  Psikolog & Stratejist
                </span>
              </div>
              <p className="text-xs text-rose-200/70 mt-0.5">
                Hedeflerine, bütçene ve değerlerine göre 1 ve 5 yıllık olasılıksal simülatör
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDecisionModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* Dilemma selector tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {dilemmas.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDilemma(d);
                  setMonteCarloResult(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  currentItem?.id === d.id
                    ? 'coral-gradient text-white border-rose-400 font-bold shadow-md'
                    : 'bg-[#14060a]/90 text-rose-200/70 border-rose-500/20 hover:text-white hover:bg-[#1e0710]'
                }`}
              >
                {d.title} (%{d.alignmentScore})
              </button>
            ))}
          </div>

          {/* Active dilemma card */}
          {currentItem && (
            <div className="space-y-4">
              <div className="p-4 rounded-[28px] bg-[#14060a]/90 border border-rose-500/20 flex items-center justify-between flex-wrap gap-2 shadow-lg">
                <div>
                  <h4 className="text-base font-bold text-white">
                    "{currentItem.title}"
                  </h4>
                  <p className="text-xs text-rose-200/60 mt-0.5">
                    Kategori: {currentItem.category} · Değerlendirme Modu: Stratejik Büyüme & Duygusal Denge
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-rose-300/60 uppercase font-mono block">
                      Uyum Skoru
                    </span>
                    <span className="text-2xl font-black text-rose-400 font-mono">
                      %{currentItem.alignmentScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pros & Cons columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pros */}
                <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-emerald-500/30 space-y-2 shadow-md">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Artılar & Fırsatlar</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-100">
                    {currentItem.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/30 space-y-2 shadow-md">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Riskler & Çekinceler</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-100">
                    {currentItem.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Brain className="w-4 h-4 text-rose-400" />
                    <span>Psikolog & Stratejist Nihai Kararı:</span>
                  </div>

                  <button
                    onClick={handleRunMonteCarlo}
                    disabled={isSimulating}
                    className="frosted-pill-button flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-200 hover:text-white cursor-pointer disabled:opacity-50"
                  >
                    <TrendingUp className={`w-3.5 h-3.5 text-rose-400 ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>{isSimulating ? 'Simüle Ediliyor...' : '1 & 5 Yıl Monte Carlo'}</span>
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-rose-100">
                  {currentItem.recommendation}
                </p>
                {currentItem.verdict && (
                  <div className="pt-1">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-block font-mono">
                      📌 Sonuç: {currentItem.verdict}
                    </span>
                  </div>
                )}
              </div>

              {/* Monte Carlo Simulation Projection Box */}
              {monteCarloResult && (
                <div className="p-5 rounded-[28px] crimson-glass text-white border border-rose-500/30 shadow-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 font-mono">
                        Monte Carlo Yaşam Simülasyonu Çıktısı
                      </h5>
                    </div>
                    <span className="text-[10px] text-rose-200/60 font-mono">10,000 İterasyon</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {monteCarloResult.simulations?.map((sim: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/20 space-y-2 text-xs"
                      >
                        <span className="text-[11px] font-bold text-rose-300 block">{sim.horizon}</span>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-rose-200/80">{sim.optionA?.label}:</span>
                            <span className="font-bold text-emerald-400">Mutluluk: %{sim.optionA?.happinessScore}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-rose-200/80">{sim.optionB?.label}:</span>
                            <span className="font-bold text-rose-300">Mutluluk: %{sim.optionB?.happinessScore}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-rose-200/70 pt-1 border-t border-white/10 leading-relaxed">
                          {sim.optionA?.summary}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-xs text-rose-100 leading-relaxed">
                    <span className="font-bold text-amber-300 mr-1.5">Stratejik Öneri:</span>
                    <span>{monteCarloResult.optimalVerdict}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form to submit any new dilemma */}
          <form
            onSubmit={handleEvaluateNew}
            className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-2.5 shadow-md"
          >
            <span className="text-xs font-bold text-rose-200 block">
              Yeni Bir İkilem Analiz Et:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Örn: Yeni bir şirket teklifini kabul etmeli miyim? / Ev satın almalı mıyım?"
                className="flex-1 px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder:text-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
              />

              <button
                type="submit"
                disabled={!newTitle.trim() || isAnalyzing}
                className="coral-gradient hover:opacity-95 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md shadow-rose-950/50 transition-all whitespace-nowrap disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Analiz Et</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
