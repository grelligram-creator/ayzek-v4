import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authenticatedFetch } from '../lib/api';
import {
  X,
  Check,
  Zap,
  Shield,
  Copy,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  Mail,
  Video,
  Calendar,
  MessageSquare,
  Briefcase,
  AlertCircle,
  Activity,
  CreditCard,
  FileText,
  Layers,
  Heart,
  Plus,
} from 'lucide-react';
import { ConnectedService } from '../types';

interface IntegrationSetupModalProps {
  service: ConnectedService | null;
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: (serviceId: string, items: string[]) => void;
}

export const IntegrationSetupModal: React.FC<IntegrationSetupModalProps> = ({
  service,
  isOpen,
  onClose,
  onSyncSuccess,
}) => {
  const { openAssistantWithQuery, addTask } = useApp();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; items: string[]; time: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importedStatus, setImportedStatus] = useState(false);

  // Form states
  const [apiKey, setApiKey] = useState('');
  const [syncFreq, setSyncFreq] = useState('realtime');
  const [autoBuffer, setAutoBuffer] = useState(true);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(true);
  const [financialGuard, setFinancialGuard] = useState(true);
  const [healthSync, setHealthSync] = useState(true);

  if (!isOpen || !service) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ayzek.os';
  const webhookUrl = `${currentOrigin}/api/integrations/webhook/${service.id}`;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunSyncTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setImportedStatus(false);

    try {
      const res = await authenticatedFetch(`/api/integrations/sync/${service.id}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Eşitleme gerçekleştirilemedi.');
      }

      const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      setTestResult({
        success: true,
        items: data.syncedItems || service.items,
        time,
      });

      if (onSyncSuccess) {
        onSyncSuccess(service.id, data.syncedItems || service.items);
      }
    } catch (error) {
      const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      setTestResult({
        success: false,
        items: [error instanceof Error ? error.message : 'Eşitleme gerçekleştirilemedi.'],
        time,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleImportToPlan = () => {
    if (!testResult?.items) return;
    testResult.items.forEach((item, index) => {
      addTask({
        title: item.replace(/^[^:]+:\s*/, ''),
        category: service.id === 'banking' ? 'finans' : service.id === 'health' ? 'kisisel' : 'is',
        time: `${10 + index}:00`,
        highlight: `${service.name} bağlantısından aktarıldı`,
        details: `${service.name} senkronizasyon kaydı: ${item}`,
      });
    });
    setImportedStatus(true);
    setTimeout(() => setImportedStatus(false), 3500);
  };

  const renderServiceIcon = () => {
    switch (service.icon) {
      case 'teams':
        return <Briefcase className="w-6 h-6 text-indigo-400" />;
      case 'gmail':
        return <Mail className="w-6 h-6 text-rose-400" />;
      case 'meet':
      case 'zoom':
        return <Video className="w-6 h-6 text-cyan-400" />;
      case 'calendar':
        return <Calendar className="w-6 h-6 text-rose-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-6 h-6 text-emerald-400" />;
      case 'health':
        return <Activity className="w-6 h-6 text-rose-400" />;
      case 'banking':
        return <CreditCard className="w-6 h-6 text-emerald-400" />;
      case 'notion':
        return <FileText className="w-6 h-6 text-amber-400" />;
      default:
        return <Zap className="w-6 h-6 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-xl rounded-[32px] bg-[#0d0205] border border-rose-500/30 text-white shadow-2xl overflow-hidden flex flex-col transition-all max-h-[90vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-[#1b050f] via-[#280716] to-[#120309] text-white flex items-center justify-between border-b border-rose-500/20 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-rose-500/30 flex items-center justify-center font-bold shadow-md">
              {renderServiceIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">{service.name}</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Bağlantı kurulmadı
                </span>
              </div>
              <p className="text-xs text-rose-200/70 mt-0.5">{service.account}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator bar */}
        <div className="flex border-b border-rose-500/20 bg-[#120409] text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { step: 1, label: '1. Yetki & İzinler' },
            { step: 2, label: '2. Protokol Ayarı' },
            { step: 3, label: '3. Canlı Veri Çekme' },
            { step: 4, label: '4. Bilişsel Kurallar' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step as any)}
              className={`flex-1 py-3 px-3 text-center whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeStep === s.step
                  ? 'border-rose-500 text-rose-300 bg-[#16050b] font-bold'
                  : 'border-transparent text-rose-200/50 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 no-scrollbar">
          {/* STEP 1: Yetki & İzinler */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/25 flex items-start gap-3">
                <Shield className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Uçtan Uca İzolasyon ve Sıfır Bilgi Güvenliği
                  </h4>
                  <p className="text-[11px] text-rose-200/70 mt-1 leading-relaxed">
                    AYZEK, {service.name} hesabınıza bağlandığında verilerinizi asla üçüncü taraflarla paylaşmaz ve genel LLM modellerine sızdırmaz. Tüm bilişsel analizler sizin özel şifrelenmiş alanınızda işlenir.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
                  İstenen Erişim İzinleri:
                </span>

                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-rose-100">
                        {service.id === 'whatsapp'
                          ? 'Gelen Mesajları Dinleme & Empati Taraması'
                          : service.id === 'health'
                          ? 'Biyo-Sensör Uyku & HRV Verisi Okuma'
                          : service.id === 'banking'
                          ? 'Fatura Son Ödeme Tarihi & Güvenli Bakiye Radarı'
                          : 'Takvim & Etkinlik Okuma / Yazma'}
                      </span>
                    </div>
                    <span className="text-[10px] text-rose-300/60 font-mono">Gerekli</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-rose-100">
                        {service.id === 'gmail'
                          ? 'Fatura & Acil E-posta Taraması'
                          : service.id === 'health'
                          ? 'Foliküler / Luteal Evre Bilişsel Eşitleme'
                          : service.id === 'banking'
                          ? 'Otomatik Harcama & Abonelik Leak Taraması'
                          : 'Gerçek Zamanlı Webhook Bildirimleri'}
                      </span>
                    </div>
                    <span className="text-[10px] text-rose-300/60 font-mono">Gerekli</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-rose-100">
                        15 Dakikalık Akıllı Denge Tamponu & Koruma
                      </span>
                    </div>
                    <span className="text-[10px] text-rose-400 font-bold font-mono">Önerilen</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full py-3.5 rounded-full coral-gradient hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>İzinleri Onayla ve Protokol Ayarına Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Kurulum Parametreleri & Webhook / API URL */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Bağlantı Türü:</span>
                  <span className="font-mono text-[11px] font-bold text-rose-400">
                    {service.id === 'health'
                      ? 'Apple HealthKit Yerel Köprü'
                      : service.id === 'banking'
                      ? 'Açık Bankacılık PSD2 REST'
                      : 'Canlı Webhook & OAuth 2.0'}
                  </span>
                </div>
                <p className="text-[11px] text-rose-200/70">
                  {service.name} servisinden çift yönlü veri akışını sağlayan güvenli kanal parametreleri.
                </p>
              </div>

              {service.id !== 'health' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-200">
                    Canlı Webhook / API Callback URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-rose-100 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                      className="frosted-pill-button px-4 py-2.5 rounded-full text-xs font-bold text-white shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'webhook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'webhook' ? 'Kopyalandı' : 'Kopyala'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-rose-200/60">
                    {service.name} paneline bu URL'i yapıştırarak gerçek zamanlı olay bildirimlerini açabilirsiniz.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-200">
                  {service.id === 'banking'
                    ? 'Açık Bankacılık Müşteri / API Belirteci:'
                    : service.id === 'health'
                    ? 'HealthKit Cihaz Eşleşme Anahtarı:'
                    : 'API Erişim Anahtarı (Token):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(apiKey, 'apiKey')}
                    className="frosted-pill-button p-2.5 rounded-full text-xs shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'apiKey' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-200">
                  Otomatik Senkronizasyon Sıklığı:
                </label>
                <select
                  value={syncFreq}
                  onChange={(e) => setSyncFreq(e.target.value)}
                  className="w-full p-3 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white cursor-pointer"
                >
                  <option value="realtime">Anlık Canlı Olay (Önerilen)</option>
                  <option value="5min">Her 5 Dakikada Bir</option>
                  <option value="15min">Her 15 Dakikada Bir</option>
                  <option value="hourly">Saatlik Kontrol</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="frosted-pill-button px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="flex-1 py-3 rounded-full text-xs font-bold coral-gradient hover:opacity-95 text-white shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ayarları Kaydet & Canlı Teste Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Canlı Veri Çekme & Test */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-5 rounded-[28px] bg-[#14060a]/90 border border-rose-500/20 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-bold text-white">
                      Canlı Veri Çekme Motoru (Live Data Pull)
                    </h4>
                  </div>
                  <span className="text-[10px] text-rose-300/60 font-mono">REST / Webhook Handshake</span>
                </div>

                <p className="text-xs text-rose-200/70 leading-relaxed">
                  Aşağıdaki butona basarak <strong>{service.name}</strong> sunucularına canlı istek atabilir ve gelen gerçek verilerin AYZEK bilişsel ajandasına nasıl aktarıldığını anında inceleyebilirsiniz.
                </p>

                <button
                  type="button"
                  onClick={handleRunSyncTest}
                  disabled={isTesting}
                  className="w-full py-3.5 rounded-full coral-gradient hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Bağlantı Kuruluyor & Canlı Veri Çekiliyor...' : 'Bağlantıyı Doğrula & Verileri Çek'}</span>
                </button>
              </div>

              {testResult && testResult.success && (
                <div className="p-5 rounded-[28px] bg-[#14060a]/90 border border-emerald-500/30 space-y-3 animate-fadeIn shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Canlı Veri Başarıyla Çekildi ({testResult.time})</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold font-mono">200 OK · Senkron</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 font-mono">
                      İçeri Alınan Aktiviteler ve Sinyaller:
                    </span>
                    <ul className="space-y-1.5">
                      {testResult.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-2xl bg-black/40 border border-rose-500/20 text-xs text-rose-100 flex items-start gap-2 shadow-xs"
                        >
                          <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Import to Agenda action */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleImportToPlan}
                      className="w-full py-3 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{importedStatus ? '✓ Veriler AYZEK Ajandasına Eklendi!' : 'Bu Verileri AYZEK Ajandama & Görevlerime Aktar'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="frosted-pill-button px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="flex-1 py-3 rounded-full text-xs font-bold coral-gradient hover:opacity-95 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Bilişsel Otonom Kuralları Ayarla</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Bilişsel Kurallar & Akıllı Eylemler */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  AYZEK Otonom Davranış Kuralları:
                </h4>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 cursor-pointer hover:border-rose-400/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={autoBuffer}
                    onChange={(e) => setAutoBuffer(e.target.checked)}
                    className="mt-0.5 accent-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      15 Dakikalık Akıllı Nefes Tamponu
                    </span>
                    <span className="text-[11px] text-rose-200/60 leading-relaxed">
                      Görüşme veya toplantı bittiğinde takvime otomatik 15 dakika koruma ekler; arka arkaya toplantı stresini ve karar yorgunluğunu sıfırlar.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 cursor-pointer hover:border-rose-400/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={sentimentAnalysis}
                    onChange={(e) => setSentimentAnalysis(e.target.checked)}
                    className="mt-0.5 accent-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Duygu & Empati Analizörü (WhatsApp / Teams)
                    </span>
                    <span className="text-[11px] text-rose-200/60 leading-relaxed">
                      Önem verdiğiniz yakınlarınızın ve ekip arkadaşlarınızın mesajlarındaki stres veya sevinç durumunu algılayıp size en uygun dille hatırlatır.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 cursor-pointer hover:border-rose-400/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={financialGuard}
                    onChange={(e) => setFinancialGuard(e.target.checked)}
                    className="mt-0.5 accent-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Finansal Fatura & Süreç Nöbetçisi
                    </span>
                    <span className="text-[11px] text-rose-200/60 leading-relaxed">
                      Son ödeme tarihleri yaklaşan faturaları ve gereksiz yinelenen abonelikleri kullanıcıyı strese sokmadan önce nazikçe uyarır.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 cursor-pointer hover:border-rose-400/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={healthSync}
                    onChange={(e) => setHealthSync(e.target.checked)}
                    className="mt-0.5 accent-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Biyo-Ritim ve Kronobiyolojik Takvim Eşitlemesi
                    </span>
                    <span className="text-[11px] text-rose-200/60 leading-relaxed">
                      Yüksek zihinsel efor gerektiren kritik kararları, Apple Health HRV ve foliküler faz enerji zirvenizle otomatik eşleştirir.
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white">
                    Kurulum Tamamlandı!
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">Canlı Eşitleniyor</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="frosted-pill-button px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-full text-xs font-bold coral-gradient hover:opacity-95 text-white shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
                >
                  Kurulumu Bitir & Merkeze Dön
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
