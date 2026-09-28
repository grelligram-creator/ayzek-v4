// Premium SaaS Pricing Model for AYZEK OS
// Designed for Executives, Founders, Knowledge Workers, and High-Performance Teams.

export interface PricingPlan {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  badge?: string;
  popular?: boolean;
  priceMonthly: number; // Final monthly price in TL
  priceYearly: number; // Final annual price with savings
  currency: string;
  description: string;
  targetAudience: string;
  features: string[];
  limits: {
    aiPromptsPerMonth: string;
    connectedAccounts: string;
    decisionMatrixLimit: string;
    proactiveSyncInterval: string;
    smartGuard: boolean;
    whatsappAnalysis: boolean;
  };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'AYZEK Starter',
    badge: 'Bireysel Odak',
    priceMonthly: 429,
    priceYearly: 4120, // ~343 TL/ay (2 ay hediye)
    currency: '₺',
    description: 'Bilişsel kararlar ve günlük rutinini dengelemek isteyen profesyoneller için temel paket.',
    targetAudience: 'Bireysel uzmanlar, danışmanlar ve serbest çalışanlar',
    features: [
      'Günde 50 Yapay Zeka senkronize eylemi',
      '2 Entegre Servis (Google Takvim & Gmail)',
      'Smart Guard 18:00 Denge Kalkanı',
      'Haftalık 5 Karar Matrisi analizi',
      'Biyolojik Hormonal Ritim takibi',
      'iOS Web App (PWA) tam dokunmatik desteği',
      'Temel e-posta ve takvim optimizasyonu',
    ],
    limits: {
      aiPromptsPerMonth: '1,500 aksiyon / ay',
      connectedAccounts: '2 Servis',
      decisionMatrixLimit: '20 İkilem / ay',
      proactiveSyncInterval: 'Saatlik senkronizasyon',
      smartGuard: true,
      whatsappAnalysis: false,
    },
  },
  {
    id: 'pro',
    name: 'AYZEK Executive Pro',
    badge: 'En Çok Tercih Edilen',
    popular: true,
    priceMonthly: 849,
    priceYearly: 8150, // ~679 TL/ay
    currency: '₺',
    description: 'Yöneticiler, girişimciler ve yoğun çalışanlar için sınırsız entegrasyon ve akıllı yaşam asistanı.',
    targetAudience: 'Şirket kurucuları, üst düzey yöneticiler ve liderler',
    features: [
      'Sınırsız Yapay Zeka senkronize eylemi (Öncelikli Gemini 3.8 Flash)',
      'Tüm Servisler (Teams, Gmail, Meet, Zoom, Takvimler, WhatsApp)',
      'WhatsApp İzinli Konuşma & Empati Analizörü',
      'Sınırsız Karar Matrisi & Psikolog Stratejisi',
      'Proaktif Zamanında Bildirimler & Otonom Arka Plan Taraması',
      'Vefa Mektup Motoru & Sosyal Sermaye Senkronu',
      'iOS Tam Ekran PWA & Haptic Dokunma optimizasyonu',
      'Bilişsel Sırdaş & Zihin Odası (Duygusal Deşarj)',
    ],
    limits: {
      aiPromptsPerMonth: 'Sınırsız (Adil Kullanım)',
      connectedAccounts: 'Sınırsız (Tüm Servisler)',
      decisionMatrixLimit: 'Sınırsız',
      proactiveSyncInterval: 'Anlık / Gerçek Zamanlı',
      smartGuard: true,
      whatsappAnalysis: true,
    },
  },
  {
    id: 'enterprise',
    name: 'AYZEK Corporate Team',
    badge: 'Kurumsal & Ekipler',
    priceMonthly: 1690,
    priceYearly: 16200,
    currency: '₺',
    description: 'Şirket liderleri ve ekipler için toplu denge koruması, tükenmişlik önleme ve kurumsal entegrasyon.',
    targetAudience: 'Yüksek büyüme gösteren ekipler ve kurumsal şirketler',
    features: [
      'Tüm Pro özellikleri dahil',
      'Ekip genelinde Tükenmişlik (Burnout) Erken Uyarı Radarı',
      'Kurumsal Microsoft 365 & Google Workspace Admin Entegrasyonu',
      'Özel Bilişsel Şirket Kültürü Mentörü',
      'Özel Müşteri Temsilcisi & 7/24 Öncelikli Canlı Destek',
      'Kurumsal SOC2 & KVKK Uyumlu İzolasyon',
      'Toplu Verimlilik ve Denge Raporları',
    ],
    limits: {
      aiPromptsPerMonth: 'Sınırsız Yüksek Hacim',
      connectedAccounts: 'Sınırsız Kurumsal Hesap',
      decisionMatrixLimit: 'Sınırsız',
      proactiveSyncInterval: 'Öncelikli Anlık Dağıtım',
      smartGuard: true,
      whatsappAnalysis: true,
    },
  },
];
