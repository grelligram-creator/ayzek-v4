import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    checkoutPlan,
    checkoutBillingCycle,
    upgradeSubscription,
  } = useApp();

  const [cardHolder, setCardHolder] = useState('Görkem Elligram');
  const [cardNumber, setCardNumber] = useState('4543 8921 7734 9821');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('842');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isCheckoutModalOpen || !checkoutPlan) return null;

  const price =
    checkoutBillingCycle === 'monthly'
      ? checkoutPlan.priceMonthly
      : checkoutPlan.priceYearly;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate instant payment gateway handshake (3D Secure compatible)
    setTimeout(async () => {
      try {
        await upgradeSubscription(checkoutPlan.id, checkoutBillingCycle);
        setIsProcessing(false);
        setSuccess(true);

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti if canvas fails
        }

        setTimeout(() => {
          setSuccess(false);
          setIsCheckoutModalOpen(false);
        }, 2200);
      } catch {
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-lg rounded-[32px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-500/20 flex items-center justify-between bg-[#14050a]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl crimson-orb-glow flex items-center justify-center font-bold text-white shadow-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Güvenli 256-Bit Ödeme
              </h3>
              <p className="text-[11px] text-rose-200/60 font-mono">
                AYZEK OS Lisans Aktivasyonu
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Tebrikler! Paketiniz Aktifleştirildi
            </h3>
            <p className="text-xs text-rose-200/70 max-w-sm mx-auto leading-relaxed">
              <strong>{checkoutPlan.name}</strong> üyeliğiniz hesabınıza tanımlandı. Tüm bilişsel özellikler ve servis entegrasyonları anında açıldı.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-4">
            {/* Order summary box */}
            <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-2 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {checkoutPlan.name} ({checkoutBillingCycle === 'monthly' ? 'Aylık' : 'Yıllık'})
                </span>
                <span className="text-base font-black text-rose-300 font-mono">
                  {checkoutPlan.currency}{price}
                </span>
              </div>
              <p className="text-[11px] text-rose-200/60 leading-relaxed">
                {checkoutPlan.description}
              </p>
              <div className="text-[10px] text-emerald-300 font-semibold pt-1 border-t border-rose-500/15 flex items-center justify-between font-mono">
                <span>🛡️ 256-bit SSL Güvenli Altyapı</span>
                <span>Anında Canlı Aktivasyon</span>
              </div>
            </div>

            {/* Credit Card inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-rose-200">
                  Kart Üzerindeki İsim
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Görkem Elligram"
                  className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-rose-200">
                  Kart Numarası
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4543 •••• •••• 9821"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder:text-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-rose-200">
                    Son Kullanma (AA/YY)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="08/28"
                    className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white text-center focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-rose-200">
                    Güvenlik Kodu (CVV)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white text-center focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-rose-200/60 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3D Secure ve SSL ile şifrelenmiştir. İstediğiniz an iptal edebilirsiniz.</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-full coral-gradient hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isProcessing ? 'Ödeme Doğrulanıyor...' : `${checkoutPlan.currency}${price} Güvenli Öde`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
