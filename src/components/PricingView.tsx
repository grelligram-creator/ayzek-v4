import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRICING_PLANS, PricingPlan } from '../data/pricingPlans';
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  Lock,
  Headphones,
  Calendar,
} from 'lucide-react';

export const PricingView: React.FC = () => {
  const { userProfile, openCheckoutModal } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-8 pb-28 animate-fadeIn max-w-4xl mx-auto">
      {/* 1. Hero Header */}
      <section className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Bilişsel Gücünüzü En Üst Seviyeye Taşıyın</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-normal tracking-tight text-white">
          AYZEK OS Üyelik Paketleri
        </h1>
        <p className="text-xs sm:text-sm text-rose-200/70 max-w-xl mx-auto leading-relaxed">
          Zihinsel berraklık, iş-özel hayat dengesi ve kurumsal canlı senkronizasyon için ihtiyacınıza uygun paketi seçin. 14 gün koşulsuz deneme imkanı.
        </p>

        {/* Monthly / Yearly Switch in Smoked Glass */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="p-1 rounded-full bg-[#14060a]/90 border border-rose-500/25 inline-flex items-center shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'coral-gradient text-white shadow-md'
                  : 'text-rose-200/60 hover:text-white'
              }`}
            >
              Aylık Faturalama
            </button>

            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'coral-gradient text-white shadow-md'
                  : 'text-rose-200/60 hover:text-white'
              }`}
            >
              <span>Yıllık Faturalama</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                2 Ay Hediye
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = userProfile?.subscriptionTier === plan.id;
          const displayPrice = billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceYearly / 12);

          return (
            <div
              key={plan.id}
              className={`relative rounded-[32px] p-6 transition-all flex flex-col justify-between border ${
                plan.popular
                  ? 'crimson-glass border-2 border-rose-500 shadow-[0_0_35px_rgba(225,29,72,0.35)] scale-[1.02]'
                  : 'bg-[#14060a]/90 hover:bg-[#1e0710] border-rose-500/20 shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full coral-gradient text-white text-[11px] font-extrabold shadow-lg shadow-rose-950/60 uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-rose-200/70 mt-1 line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>
                  <span className="text-[10px] font-bold text-rose-400 block mt-2 font-mono">
                    🎯 {plan.targetAudience}
                  </span>
                </div>

                {/* Price Display */}
                <div className="pt-3 pb-2 border-b border-rose-500/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300/60 block font-mono">
                    Nihai Lisans Bedeli
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {plan.currency}{displayPrice}
                    </span>
                    <span className="text-xs text-rose-200/60 font-semibold">
                      / ay
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                      Nihai Yıllık Toplam: {plan.currency}{plan.priceYearly} (2 Ay Hediye)
                    </span>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block font-mono">
                    Paket Yetkinlikleri:
                  </span>
                  <ul className="space-y-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-rose-100/90">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button
                  onClick={() => openCheckoutModal(plan, billingCycle)}
                  disabled={isCurrent}
                  className={`w-full py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-white/10 text-rose-300/60 border border-white/10 cursor-default'
                      : plan.popular
                      ? 'coral-gradient hover:opacity-95 text-white shadow-rose-950/60'
                      : 'frosted-pill-button text-white'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Mevcut Paketiniz</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{plan.name}'e Geç</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Trust & Guarantee Badges in Smoked Crimson Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-white">14 Gün İade Garantisi</h5>
            <p className="text-[11px] text-rose-200/60">Koşulsuz para iade güvencesi</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center gap-3">
          <Lock className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-white">256-Bit Uçtan Uca Şifreleme</h5>
            <p className="text-[11px] text-rose-200/60">Tüm verileriniz izole kasada</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center gap-3">
          <Headphones className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-white">Öncelikli Yönetici Desteği</h5>
            <p className="text-[11px] text-rose-200/60">VIP birebir mimari danışmanlık</p>
          </div>
        </div>
      </div>
    </div>
  );
};
