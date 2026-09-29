import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

/** A non-transactional preview until a PCI-compliant provider is integrated. */
export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, setIsCheckoutModalOpen, checkoutPlan, checkoutBillingCycle } = useApp();
  const [previewed, setPreviewed] = useState(false);

  if (!isCheckoutModalOpen || !checkoutPlan) return null;

  const price = checkoutBillingCycle === 'monthly' ? checkoutPlan.priceMonthly : checkoutPlan.priceYearly;
  const close = () => {
    setPreviewed(false);
    setIsCheckoutModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="plan-preview-title">
      <div className="w-full max-w-lg rounded-[32px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl overflow-hidden">
        <header className="px-6 py-4 border-b border-rose-500/20 flex items-center justify-between bg-[#14050a]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl crimson-orb-glow flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
            <div><h3 id="plan-preview-title" className="text-sm font-bold">Plan önizlemesi</h3><p className="text-[11px] text-rose-200/60 font-mono">Ödeme altyapısı henüz bağlı değil</p></div>
          </div>
          <button onClick={close} aria-label="Kapat" className="w-8 h-8 rounded-full flex items-center justify-center text-rose-300 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
        </header>
        {previewed ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30"><CheckCircle2 className="w-10 h-10" /></div>
            <h3 className="text-xl font-bold">Plan önizlemesi hazır</h3>
            <p className="text-xs text-rose-200/70 leading-relaxed">Bu işlem üyeliğinizi değiştirmedi ve hiçbir ödeme alınmadı.</p>
            <button onClick={close} className="px-5 py-2.5 rounded-full frosted-pill-button text-xs font-bold">Kapat</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs"><span className="font-bold">{checkoutPlan.name} ({checkoutBillingCycle === 'monthly' ? 'Aylık' : 'Yıllık'})</span><span className="text-base font-black text-rose-300 font-mono">{checkoutPlan.currency}{price}</span></div>
              <p className="text-[11px] text-rose-200/60 leading-relaxed">{checkoutPlan.description}</p>
            </div>
            <div className="flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-amber-100"><Info className="w-5 h-5 shrink-0" /><p className="text-xs leading-relaxed">Bu sürüm bir ürün demosudur. Kart, CVV veya ödeme bilgisi istemez ve planı aktifleştirmez.</p></div>
            <button onClick={() => setPreviewed(true)} className="w-full py-3.5 rounded-full coral-gradient text-white font-bold text-xs sm:text-sm">Planı önizle</button>
          </div>
        )}
      </div>
    </div>
  );
};
