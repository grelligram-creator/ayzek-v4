import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authenticatedFetch } from '../lib/api';
import {
  Zap,
  MessageSquare,
  Mail,
  Video,
  Calendar,
  ExternalLink,
  MessageCircle,
  Briefcase,
  Check,
  Settings,
  RefreshCw,
  Plus,
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  CreditCard,
  FileText,
  Heart,
  TrendingUp,
  Layers,
  Smartphone,
  X,
} from 'lucide-react';
import { ConnectedService } from '../types';
import { IntegrationSetupModal } from './IntegrationSetupModal';

export const MerkezView: React.FC = () => {
  const { services, openAssistantWithQuery } = useApp();
  const [selectedService, setSelectedService] = useState<ConnectedService | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'comm' | 'health' | 'finance' | 'work'>('all');

  const getServiceIcon = (icon: ConnectedService['icon']) => {
    switch (icon) {
      case 'teams':
        return (
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
        );
      case 'gmail':
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Mail className="w-6 h-6" />
          </div>
        );
      case 'meet':
        return (
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Video className="w-6 h-6" />
          </div>
        );
      case 'zoom':
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Video className="w-6 h-6" />
          </div>
        );
      case 'calendar':
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
        );
      case 'whatsapp':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <MessageSquare className="w-6 h-6" />
          </div>
        );
      case 'health':
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Heart className="w-6 h-6 fill-rose-500/30" />
          </div>
        );
      case 'banking':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <CreditCard className="w-6 h-6" />
          </div>
        );
      case 'notion':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
        );
    }
  };

  const handleOpenSetup = (service: ConnectedService) => {
    setSelectedService(service);
    setIsSetupOpen(true);
  };

  const handleManualSync = async (service: ConnectedService) => {
    setSyncingId(service.id);
    try {
      const res = await authenticatedFetch(`/api/integrations/sync/${service.id}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Eşitleme gerçekleştirilemedi.');
      setSyncSuccessToast(`${service.name}: Eşitleme tamamlandı.`);
      setTimeout(() => setSyncSuccessToast(null), 3000);
    } catch (error) {
      setSyncSuccessToast(error instanceof Error ? error.message : `${service.name}: Eşitleme gerçekleştirilemedi.`);
      setTimeout(() => setSyncSuccessToast(null), 3000);
    } finally {
      setSyncingId(null);
    }
  };

  const filteredServices = services.filter((s) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'comm')
      return s.id === 'whatsapp' || s.id === 'gmail' || s.id === 'meet' || s.id === 'zoom' || s.id === 'teams';
    if (categoryFilter === 'health') return s.id === 'health';
    if (categoryFilter === 'finance') return s.id === 'banking';
    if (categoryFilter === 'work') return s.id === 'notion' || s.id === 'calendar' || s.id === 'teams';
    return true;
  });

  const availableChannelsToConnect = [
    {
      id: 'slack',
      name: 'Slack / Linear',
      category: 'work' as const,
      icon: 'teams' as const,
      account: 'OAuth kurulumu gerekli',
      desc: 'Görev ve ekip bağlamı için planlanan OAuth sağlayıcısı',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      category: 'comm' as const,
      icon: 'whatsapp' as const,
      account: 'Destek değerlendirmede',
      desc: 'Resmî API uygunluğu doğrulanmadan bağlantı sunulmaz',
    },
    {
      id: 'garmin',
      name: 'Garmin / Oura',
      category: 'health' as const,
      icon: 'health' as const,
      account: 'OAuth kurulumu gerekli',
      desc: 'Sağlık verisi sağlayıcı izinleri ve veri politikası gerektirir',
    },
    {
      id: 'edevlet',
      name: 'Resmî bildirim hizmetleri',
      category: 'finance' as const,
      icon: 'banking' as const,
      account: 'Desteklenmiyor',
      desc: 'Resmî ve yetkili bir API olmadan bu tür veri erişimi sağlanmaz',
    },
  ];

  const handleAddNewChannel = (channel: (typeof availableChannelsToConnect)[0]) => {
    setIsAddChannelOpen(false);
    setSyncSuccessToast(`${channel.name} için canlı bağlantı henüz uygulanmadı. OAuth ve sağlayıcı yapılandırması gerekir.`);
    setTimeout(() => setSyncSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-28 animate-fadeIn max-w-4xl mx-auto">
      {/* Integration Setup Modal */}
      <IntegrationSetupModal
        service={selectedService}
        isOpen={isSetupOpen}
        onClose={() => {
          setIsSetupOpen(false);
          setSelectedService(null);
        }}
      />

      {/* Add New Channel Modal (Smoked Crimson Glass) */}
      {isAddChannelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-lg rounded-[32px] crimson-glass border border-rose-500/30 text-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full crimson-orb-glow flex items-center justify-center text-white">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Sağlayıcı durumu
                </h3>
              </div>
              <button
                onClick={() => setIsAddChannelOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-rose-200/70">
              Sağlayıcıların canlı bağlantı durumu burada görünür. OAuth yapılandırması olmayan hiçbir kanal bağlanmış gösterilmez.
            </p>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
              {availableChannelsToConnect.map((chan) => (
                <div
                  key={chan.id}
                  className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 hover:border-rose-400/50 transition-all flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white">
                      {chan.name}
                    </h4>
                    <p className="text-[11px] text-rose-200/60 leading-relaxed">
                      {chan.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddNewChannel(chan)}
                    className="coral-gradient hover:opacity-95 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Durumu göster</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {syncSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-xl flex items-center justify-between animate-fadeIn border border-emerald-400/40">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>{syncSuccessToast}</span>
          </div>
          <button onClick={() => setSyncSuccessToast(null)} className="cursor-pointer">
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header section with Editorial Typography */}
      <section className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full crimson-orb-glow flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-normal tracking-tight text-white">
              Entegrasyon & Veri Merkezi
            </h1>
          </div>
          <p className="text-xs text-rose-200/70 mt-1">
            Bağladığınız servislerin durumunu ve izinlerini buradan yönetirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddChannelOpen(true)}
            className="coral-gradient hover:opacity-95 text-white flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sağlayıcılar</span>
          </button>
        </div>
      </section>

      {/* 2. Sync Health Dashboard Banner (Smoked Crimson Glass) */}
      <section className="p-5 sm:p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl crimson-orb-glow text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Bağlantı Durumu:</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {services.filter((s) => s.isActive).length} / {services.length} Kanal Aktif
              </span>
            </div>
            <p className="text-xs text-rose-200/70 mt-0.5">
              Canlı eşitleme, yalnızca yetkilendirilmiş bir servis bağlantısı tamamlandıktan sonra başlar.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            services.filter((service) => service.isActive).forEach((service) => handleManualSync(service));
          }}
          disabled={!services.some((service) => service.isActive)}
          className="frosted-pill-button flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-rose-200 hover:text-white cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
          <span>Bağlı Kanalları Eşitle</span>
        </button>
      </section>

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
        {[
          { id: 'all', label: `Tümü (${services.length})` },
          { id: 'comm', label: 'İletişim & Toplantı' },
          { id: 'health', label: 'Sağlık & Biyo-Ritim' },
          { id: 'finance', label: 'Finans & Fatura' },
          { id: 'work', label: 'Görev & Projeler' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setCategoryFilter(f.id as any)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
              categoryFilter === f.id
                ? 'coral-gradient text-white font-bold border-rose-400 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-rose-200/70 border-rose-500/20 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 4. Grid of services in Smoked Crimson Obsidian Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="p-5 rounded-[28px] bg-[#14060a]/90 hover:bg-[#1e0710] border border-rose-500/20 hover:border-rose-400/50 shadow-xl space-y-4 transition-all flex flex-col justify-between group"
          >
            {/* Top row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getServiceIcon(service.icon)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-rose-200 transition-colors">
                        {service.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {service.status}
                      </span>
                    </div>
                    <p className="text-xs text-rose-200/60 truncate max-w-[190px] sm:max-w-xs mt-0.5">
                      {service.isActive ? service.account : 'Bağlantı kurulmadı'}
                    </p>
                  </div>
                </div>

                {service.toggleable && (
                  <button
                    onClick={() => handleOpenSetup(service)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      service.isActive ? 'coral-gradient' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        service.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Bullet points */}
              <ul className="space-y-1.5 pt-1 text-xs text-rose-100/80">
                {service.isActive ? service.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                )) : (
                  <li className="flex items-start gap-2 text-rose-200/60">
                    <span className="text-rose-400 font-bold">•</span>
                    <span className="leading-relaxed">Veri görmek için önce güvenli bağlantı kurulmalıdır.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-rose-500/15">
              <button
                onClick={() => handleManualSync(service)}
                disabled={syncingId === service.id || !service.isActive}
                className="frosted-pill-button flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold text-rose-200 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === service.id ? 'animate-spin' : ''}`} />
                <span>{syncingId === service.id ? 'Eşitleniyor...' : service.isActive ? 'Eşitle' : 'Bağlantı Gerekli'}</span>
              </button>

              <button
                onClick={() => handleOpenSetup(service)}
                className="flex-1 frosted-pill-button flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-full text-xs font-bold text-rose-200 hover:text-white cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-rose-400" />
                <span>Kurulum & Yetkiler</span>
              </button>

              <button
                onClick={() =>
                  openAssistantWithQuery(`${service.name} için bağlantı kurulumunda hangi izinlere ihtiyaç duyduğumu açıkla.`)
                }
                title="AYZEK'e Sor"
                className="w-9 h-9 rounded-full crimson-orb-glow flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
