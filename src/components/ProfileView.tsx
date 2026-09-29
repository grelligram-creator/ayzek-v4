import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { authenticatedFetch } from '../lib/api';
import { AyzekLogo } from './AyzekLogo';
import { deleteMemory, exportUserData, listMemories, saveExplicitMemory } from '../services/firestoreService';
import { MemoryItem, NotificationPreferences } from '../types';
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Smartphone,
  LogOut,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Share2,
  Download,
  Sliders,
  ChevronRight,
  MapPin,
  Heart,
  Compass,
  Zap,
  Edit3,
  Trash2,
  Plus,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    user,
    logout,
    setActiveTab,
    setIsIosInstallModalOpen,
    setIsOnboardingOpen,
    setIsQuickTourOpen,
    updateProfileInfo,
    clearConversationHistory,
  } = useApp();

  const [jobTitle, setJobTitle] = useState(userProfile?.jobTitle || '');
  const [company, setCompany] = useState(userProfile?.company || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [lifeMission, setLifeMission] = useState(userProfile?.lifeMission || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [memoryNote, setMemoryNote] = useState('');
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => userProfile?.notificationPreferences || {
    reminders: true, tasks: true, recommendations: false, integrationProblems: true, security: true,
  });

  useEffect(() => {
    if (!user?.uid) {
      setMemories([]);
      return;
    }
    listMemories(user.uid).then(setMemories).catch(() => setMemoryError('Hafıza kayıtları yüklenemedi.'));
  }, [user?.uid]);

  const handleSaveMemory = async () => {
    if (!user?.uid) return;
    setMemoryError(null);
    try {
      const memory = await saveExplicitMemory(user.uid, memoryNote);
      setMemories((previous) => [memory, ...previous]);
      setMemoryNote('');
    } catch (error) {
      setMemoryError(error instanceof Error ? error.message : 'Hafıza kaydedilemedi.');
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    if (!user?.uid) return;
    setMemoryError(null);
    try {
      await deleteMemory(user.uid, memoryId);
      setMemories((previous) => previous.filter((memory) => memory.id !== memoryId));
    } catch {
      setMemoryError('Hafıza silinemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    try {
      await updateProfileInfo({ jobTitle, company, location, lifeMission, notificationPreferences });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Profil kaydedilemedi.');
    }
  };

  const handleExport = async () => {
    if (!user?.uid) return;
    setExportError(null);
    try {
      const data = await exportUserData(user.uid);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ayzek-verilerim-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError('Veriler dışa aktarılamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleAccountDeletion = async () => {
    const confirmation = window.prompt('Bu işlem geri alınamaz. Devam etmek için DELETE_MY_ACCOUNT yazın.');
    if (confirmation !== 'DELETE_MY_ACCOUNT') return;
    setDeleteError(null);
    try {
      const response = await authenticatedFetch('/api/account', {
        method: 'DELETE',
        body: JSON.stringify({ confirmation }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Hesap silinemedi.');
      }
      await logout();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Hesap silinemedi.');
    }
  };

  const handleClearConversationHistory = async () => {
    const confirmation = window.prompt('Sohbet geçmişini kalıcı olarak silmek için CLEAR_CONVERSATION_HISTORY yazın.');
    if (confirmation !== 'CLEAR_CONVERSATION_HISTORY') return;
    setDeleteError(null);
    try {
      await clearConversationHistory();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Sohbet geçmişi silinemedi.');
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-fadeIn max-w-2xl mx-auto">
      {/* 1. Header Profile Card (Crimson Glass) */}
      <section className="p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full ring-2 ring-rose-400 p-0.5 crimson-orb-glow text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-rose-950/70 shrink-0">
              {userProfile?.displayName?.charAt(0) || '?'}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#080204]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {userProfile?.displayName || 'Profilini tamamla'}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                {(userProfile?.subscriptionTier || 'free').toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-rose-200/70 mt-0.5 truncate">
              {userProfile?.email || user?.email || 'E-posta eklenmedi'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-rose-200/60 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{userProfile?.location || 'Konum eklenmedi'}</span>
            </div>
          </div>
        </div>

        {/* Holographic Obsidian & Crimson Metal Executive Member Card */}
        <div className="relative overflow-hidden p-6 rounded-[28px] bg-gradient-to-br from-[#1a050e] via-[#240612] to-[#0d0206] text-white shadow-2xl border border-rose-500/35 space-y-5 group">
          {/* Card subtle radiant glows */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top row */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AyzekLogo size={34} theme="crimson" variant="boxed" glow={false} />
              <div>
                <span className="text-xs font-black tracking-widest text-rose-300 uppercase block font-mono">
                  AYZEK OS BİLİŞSEL KART
                </span>
                <span className="text-[10px] text-rose-200/60 font-mono tracking-wider">
                  {userProfile?.membershipId || 'Üyelik kimliği oluşturulmadı'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{userProfile?.subscriptionStatus === 'active' ? 'Aktif Üyelik' : 'Deneme'}</span>
            </div>
          </div>

          {/* Chip & NFC Tag */}
          <div className="relative z-10 flex items-center justify-between pt-1">
            <div className="w-11 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-600 border border-amber-300/40 shadow-xs flex items-center justify-center">
              <div className="w-8 h-4 border border-amber-800/40 rounded-xs grid grid-cols-2 gap-0.5" />
            </div>

            <div className="flex items-center gap-1.5 text-rose-200/60 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-widest">GÜVENLİ HESAP</span>
              <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
            </div>
          </div>

          {/* Middle tier info */}
          <div className="relative z-10 flex items-baseline justify-between pt-2">
            <div>
              <span className="text-[10px] text-rose-200/60 uppercase tracking-widest block font-mono">
                Üyelik Seviyesi
              </span>
              <h3 className="text-lg font-black tracking-tight text-white capitalize">
                {userProfile?.subscriptionTier === 'enterprise'
                  ? 'Corporate Team Plan'
                  : userProfile?.subscriptionTier === 'pro'
                  ? 'Executive Pro Plan'
                  : 'Starter Plan'}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-rose-200/60 uppercase tracking-widest block font-mono">
                Ödeme Yöntemi
              </span>
              <div className="flex items-center gap-1.5 justify-end mt-0.5 text-xs font-bold text-rose-100">
                <CreditCard className="w-4 h-4 text-rose-400" />
                <span>{userProfile?.cardBrand && userProfile?.cardLast4 ? `${userProfile.cardBrand} •••• ${userProfile.cardLast4}` : 'Ödeme altyapısı bağlı değil'}</span>
              </div>
            </div>
          </div>

          {/* Quota breakdown */}
          <div className="relative z-10 pt-3 border-t border-rose-500/20 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-rose-200/70">Yapay zekâ kullanım durumu:</span>
              <span className="font-bold text-rose-300 font-mono">Henüz ölçülmedi</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-rose-500/20">
              <div className="h-full coral-gradient rounded-full w-0" />
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-[11px] text-rose-200/70">
              <span>
                {userProfile?.renewalDate ? `Yenilenme: ${userProfile.renewalDate}` : 'Abonelik işlemleri yakında sunulacak.'}
              </span>
              <button
                onClick={() => setActiveTab('pricing')}
                className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Planı Yönet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Synced devices and Autonomous Engine Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl crimson-orb-glow text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-rose-200/60 uppercase font-bold tracking-wider block font-mono">
                Bağlı Cihazlar
              </span>
              <span className="text-xs font-bold text-white">
                Henüz cihaz bilgisi yok
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-rose-200/60 uppercase font-bold tracking-wider block font-mono">
                Arka Plan Otonom Motor
              </span>
              <span className="text-xs font-bold text-emerald-300">
                Bağlantı kurulmadı
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hafıza & Kişisel Tanıma Rehberi (Smoked Crimson Glass) */}
      <section className="p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">
              AYZEK Bilişsel Hafızası (Seni Tanıma Profili)
            </h3>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>Tanıtımı Tekrarla</span>
          </button>
          <button
            type="button"
            onClick={() => setIsQuickTourOpen(true)}
            className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Hızlı tur</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs text-rose-200/70 leading-relaxed">
          AYZEK yalnızca eklediğiniz profil bilgileri ve açıkça izin verdiğiniz bağlantılar üzerinden kişiselleştirilir.
        </p>

        {/* Hobbies badges */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block font-mono">
            İlgi Alanları & Hobiler:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {(userProfile?.hobbies || []).length === 0 && <span className="text-xs text-rose-200/60">Henüz ilgi alanı eklenmedi.</span>}
            {(userProfile?.hobbies || []).map((h, i) => (
              <span
                key={i}
                className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#14060a]/90 text-rose-200 border border-rose-500/25"
              >
                ⛵ {h}
              </span>
            ))}
          </div>
        </div>

        {/* Life Mission */}
        <div className="p-4 rounded-2xl bg-[#14060a]/90 border border-rose-500/20 space-y-1">
          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block font-mono">
            Hayat Misyonu & Değerler:
          </span>
          <p className="text-xs italic text-rose-100 leading-relaxed">
            {userProfile?.lifeMission ? `“${userProfile.lifeMission}”` : 'Henüz hayat misyonu veya değer notu eklenmedi.'}
          </p>
        </div>

        <div className="pt-2 space-y-2">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block font-mono">
            Açıkça kaydettiğiniz notlar
          </span>
          <p className="text-[11px] text-rose-200/60">Yalnızca buradan eklediğiniz notlar uzun dönem hafızaya alınır. İstediğiniz zaman silebilirsiniz.</p>
          <div className="flex gap-2">
            <input
              value={memoryNote}
              onChange={(event) => setMemoryNote(event.target.value)}
              maxLength={500}
              placeholder="Örn. Sabah planlamasını kısa ve maddeli istiyorum"
              className="min-w-0 flex-1 px-3 py-2 rounded-xl text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
            <button type="button" onClick={handleSaveMemory} className="px-3 rounded-xl border border-rose-500/30 text-rose-200 hover:text-white">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {memoryError && <p className="text-[11px] text-amber-300">{memoryError}</p>}
          {memories.length === 0 ? (
            <p className="text-xs text-rose-200/60">Henüz açıkça kaydedilmiş bir hafıza notu yok.</p>
          ) : (
            <div className="space-y-1.5">
              {memories.map((memory) => (
                <div key={memory.id} className="flex items-start justify-between gap-3 rounded-xl bg-[#14060a]/90 border border-rose-500/15 px-3 py-2 text-xs text-rose-100">
                  <span>{memory.content}</span>
                  <button type="button" onClick={() => handleDeleteMemory(memory.id)} aria-label="Hafıza notunu sil" className="shrink-0 text-rose-300 hover:text-rose-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="p-5 rounded-[28px] crimson-glass border border-rose-500/25 text-white shadow-xl space-y-3">
        <div>
          <h3 className="text-sm font-bold">Bildirim tercihleri</h3>
          <p className="mt-1 text-xs text-rose-200/70">Bu ayarlar hangi bildirim kategorilerinin ileride gönderilebileceğini belirler. Tarayıcı izni henüz istenmez.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ['reminders', 'Hatırlatmalar'],
            ['tasks', 'Görev güncellemeleri'],
            ['recommendations', 'AI önerileri'],
            ['integrationProblems', 'Entegrasyon sorunları'],
            ['security', 'Güvenlik bildirimleri'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-[#14060a]/80 px-3 py-2.5 text-xs text-rose-100 cursor-pointer">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={notificationPreferences[key as keyof NotificationPreferences]}
                onChange={(event) => setNotificationPreferences((previous) => ({ ...previous, [key]: event.target.checked }))}
                className="accent-rose-500"
              />
            </label>
          ))}
        </div>
        <p className="text-[11px] text-rose-200/55">Değişiklikleri kalıcılaştırmak için aşağıdaki profil kaydet düğmesini kullan.</p>
      </section>

      <section className="p-5 rounded-[28px] crimson-glass border border-rose-500/25 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold">Verilerim ve gizlilik</h3>
            <p className="text-xs text-rose-200/70 mt-1">Profil, çalışma alanı, konuşmalar ve açıkça kaydettiğiniz hafıza notları JSON olarak indirilir.</p>
          </div>
          <button type="button" onClick={handleExport} className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-rose-500/30 text-xs font-bold text-rose-100 hover:bg-rose-500/10">
            <Download className="w-4 h-4" /> Dışa aktar
          </button>
        </div>
        {exportError && <p className="text-xs text-amber-300">{exportError}</p>}
        <p className="text-[11px] text-rose-200/50">Şifre, erişim anahtarı ve token alanları dışa aktarımın dışında tutulur.</p>
        <div className="pt-2 border-t border-rose-500/15 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-rose-200">Sohbet geçmişini temizle</p>
            <p className="text-[11px] text-rose-200/55">Tüm konuşmalar ve mesajlar kalıcı olarak silinir; profil ve görevler korunur.</p>
          </div>
          <button type="button" onClick={handleClearConversationHistory} className="shrink-0 px-3 py-2 rounded-xl border border-rose-500/40 text-xs font-bold text-rose-200 hover:bg-rose-500/15">
            Geçmişi temizle
          </button>
        </div>
        <div className="pt-2 border-t border-rose-500/15 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-rose-200">Hesabı sil</p>
            <p className="text-[11px] text-rose-200/55">Bu işlem profilinizi, çalışma alanınızı, konuşmalarınızı ve hafıza notlarınızı kalıcı olarak siler.</p>
          </div>
          <button type="button" onClick={handleAccountDeletion} className="shrink-0 px-3 py-2 rounded-xl border border-rose-500/50 text-xs font-bold text-rose-200 hover:bg-rose-500/15">
            Hesabı sil
          </button>
        </div>
        {deleteError && <p className="text-xs text-amber-300">{deleteError}</p>}
      </section>

      {/* 3. iOS App installation card */}
      <section className="p-6 rounded-[32px] bg-gradient-to-r from-[#1b050f] via-[#280716] to-[#120309] text-white border border-rose-500/35 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl crimson-orb-glow flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                iPhone / iPad'e Kur (PWA)
              </h3>
              <p className="text-xs text-rose-200/70 mt-0.5">
                Safari üzerinden ana ekrana tam ekran native uygulama olarak tek tıkla ekleyin
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsIosInstallModalOpen(true)}
            className="coral-gradient hover:opacity-95 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-rose-950/60 cursor-pointer"
          >
            Nasıl Kurulur?
          </button>
        </div>
      </section>

      {/* 4. Profile info edit form */}
      <form onSubmit={handleSave} className="p-6 rounded-[32px] crimson-glass border border-rose-500/25 text-white shadow-2xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
          Kişisel Bilgileri Düzenle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-200">
              Ünvan / Rol
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-rose-200">
              Şirket / Organizasyon
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-rose-200">
            Yaşadığınız Konum / Açık Adres Bölgesi
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-rose-200">
            Hayat Misyonu
          </label>
          <textarea
            rows={2}
            value={lifeMission}
            onChange={(e) => setLifeMission(e.target.value)}
            className="w-full p-3.5 rounded-2xl text-xs bg-[#130509]/90 border border-rose-500/25 text-white placeholder-rose-200/40 focus:outline-hidden focus:ring-2 focus:ring-rose-500 resize-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Profil ve hafıza güncellendi
            </span>
          )}
          {saveError && <span className="text-xs font-semibold text-amber-300">{saveError}</span>}
          <button
            type="submit"
            className="ml-auto coral-gradient hover:opacity-95 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-rose-950/60 cursor-pointer"
          >
            Kaydet
          </button>
        </div>
      </form>

      {/* Logout button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl border border-rose-500/30 bg-[#16040a]/90 hover:bg-[#20050f] text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Oturumu Kapat</span>
        </button>
      </div>
    </div>
  );
};
