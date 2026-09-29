import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { authenticatedFetch } from '../lib/api';
import {
  ThemeMode,
  ViewMode,
  NavTab,
  UserProfile,
  MoodCheckin,
  WorkLifeBalance,
  CoachGoal,
  RoutineSummary,
  BiologicalRhythm,
  DilemmaItem,
  ProactiveAlert,
  TaskItem,
  ConnectedService,
  ChatMessage,
  ConversationSummary,
  AppAction,
  AutonomousLog,
  ProactiveInsight,
  NotificationItem,
  MemoryCandidate,
} from '../types';
import { PricingPlan } from '../data/pricingPlans';
import {
  getOrCreateUserProfile,
  getUserData,
  listConversations,
  createConversation,
  archiveConversation,
  loadConversationMessages,
  renameConversation,
  saveUserData,
  saveConversationMessage,
  updateUserProfileDetails,
  saveExplicitMemory,
} from '../services/firestoreService';

export interface AuthUserState {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AppContextType {
  // Auth state
  user: User | AuthUserState | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileInfo: (details: Partial<UserProfile>) => Promise<void>;

  // Autonomous background worker & Proactive feed
  autonomousLogs: AutonomousLog[];
  runAutonomousScan: () => Promise<void>;
  isScanningLogs: boolean;
  proactiveInsights: ProactiveInsight[];

  // First stars onboarding
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isQuickTourOpen: boolean;
  setIsQuickTourOpen: (open: boolean) => void;
  completeQuickTour: () => Promise<void>;
  notifications: NotificationItem[];
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationsRead: () => void;
  memoryCandidate: MemoryCandidate | null;
  acceptMemoryCandidate: () => Promise<void>;
  dismissMemoryCandidate: () => void;

  // Theme & Navigation
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Workspace Data
  checkin: MoodCheckin;
  updateCheckin: (fields: Partial<MoodCheckin>) => void;
  fetchPersonalAdvice: () => Promise<void>;
  isAdviceLoading: boolean;
  balance: WorkLifeBalance;
  toggleSmartGuard: () => void;
  coachGoal: CoachGoal;
  updateCoachProgress: (delta: number) => void;
  bioRhythm: BiologicalRhythm;
  routineSummary: RoutineSummary;
  dilemmas: DilemmaItem[];
  addDilemma: (dilemma: Partial<DilemmaItem>) => void;
  isDecisionModalOpen: boolean;
  setIsDecisionModalOpen: (open: boolean) => void;
  selectedDilemma: DilemmaItem | null;
  setSelectedDilemma: (dilemma: DilemmaItem | null) => void;
  proactiveAlert: ProactiveAlert | null;
  dismissProactiveAlert: () => void;
  triggerProactiveTest: () => void;
  tasks: TaskItem[];
  toggleTask: (id: string) => void;
  addTask: (task: Partial<TaskItem>) => void;
  updateTask: (id: string, changes: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  services: ConnectedService[];
  toggleService: (id: string) => void;

  // AI Chat & Sync
  messages: ChatMessage[];
  conversations: ConversationSummary[];
  activeConversationId: string;
  startConversation: () => Promise<void>;
  switchConversation: (conversationId: string) => Promise<void>;
  renameActiveConversation: (title: string) => Promise<void>;
  archiveActiveConversation: () => Promise<void>;
  deleteActiveConversation: () => Promise<void>;
  clearConversationHistory: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  openAssistantWithQuery: (query: string) => void;
  syncToast: { show: boolean; text: string } | null;
  clearSyncToast: () => void;
  showSyncNotification: (text: string) => void;

  // Modals
  isSanctuaryOpen: boolean;
  setIsSanctuaryOpen: (open: boolean) => void;
  isDraftModalOpen: boolean;
  setIsDraftModalOpen: (open: boolean) => void;
  draftContent: string;
  generateDraft: (recipient: string, occasion: string) => Promise<void>;
  isDraftLoading: boolean;

  // Pricing & Checkout
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  checkoutPlan: PricingPlan | null;
  checkoutBillingCycle: 'monthly' | 'yearly';
  openCheckoutModal: (plan: PricingPlan, cycle: 'monthly' | 'yearly') => void;

  // iOS PWA Install Guide
  isIosInstallModalOpen: boolean;
  setIsIosInstallModalOpen: (open: boolean) => void;

  // Hayatın Merkezi 2026 Vision Showcase
  isVisionModalOpen: boolean;
  setIsVisionModalOpen: (open: boolean) => void;
  connectService: (service: Partial<ConnectedService> & { id: string; name: string }) => void;

  // 6 Ultra-Attractive Experience Modals
  isVoiceBriefingOpen: boolean;
  setIsVoiceBriefingOpen: (open: boolean) => void;
  isCognitiveWrappedOpen: boolean;
  setIsCognitiveWrappedOpen: (open: boolean) => void;
  isPoliteDeclineOpen: boolean;
  setIsPoliteDeclineOpen: (open: boolean) => void;
  isAlwaysOnWatchOpen: boolean;
  setIsAlwaysOnWatchOpen: (open: boolean) => void;
  isMeetingShadowOpen: boolean;
  setIsMeetingShadowOpen: (open: boolean) => void;
  isFutureSelfOpen: boolean;
  setIsFutureSelfOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ayzek_theme');
    return (saved as ThemeMode) || 'crimson';
  });

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('ayzek_view_mode');
    return (saved as ViewMode) || 'desktop';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('akis');

  // Auth state: never invent an authenticated user when Firebase is unavailable.
  const [user, setUser] = useState<User | AuthUserState | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isWorkspaceHydrated, setIsWorkspaceHydrated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isQuickTourOpen, setIsQuickTourOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [memoryCandidate, setMemoryCandidate] = useState<MemoryCandidate | null>(null);

  // Autonomous background worker logs (User away from app intelligence)
  const [autonomousLogs, setAutonomousLogs] = useState<AutonomousLog[]>([
    {
      id: 'auto-1',
      time: '06:45',
      title: 'Hava & Güzergah Analizi',
      detail: 'Moda Sahil güzergahında sabah trafiği analiz edildi. 09:00 mesaisi için en sakin rota belirlendi.',
      category: 'commute',
      status: 'completed',
    },
    {
      id: 'auto-2',
      time: '08:15',
      title: 'Takvim Çakışması & Tampon Ekleme',
      detail: '11:00 Google Meet toplantısının ardına 15 dk Akıllı Nefes Tamponu eklendi; toplantı stresi önlendi.',
      category: 'calendar',
      status: 'completed',
    },
    {
      id: 'auto-3',
      time: '12:30',
      title: 'E-Posta & Fatura Taraması',
      detail: 'Gmail taranarak Enerjisa faturasının yarınki son ödeme tarihi ajandaya "Öncelikli Finans" olarak işlendi.',
      category: 'email',
      status: 'completed',
    },
    {
      id: 'auto-4',
      time: '14:00',
      title: 'Bilişsel & Biyoritim Eşitlemesi',
      detail: 'Foliküler evre için yüksek yaratıcılık gerektiren "C1 İngilizce Sunum Hazırlığı" öğleden sonraya konumlandırıldı.',
      category: 'balance',
      status: 'completed',
    },
    {
      id: 'auto-5',
      time: '17:45',
      title: 'Smart Guard 18:00 Koruma Kalkanı',
      detail: 'Mesai bitiminde yeni toplantı davetleri otomatik beklemeye alındı, akşam zihinsel dinlenme korundu.',
      category: 'balance',
      status: 'completed',
    },
  ]);
  const [isScanningLogs, setIsScanningLogs] = useState(false);

  // Proactive Insights based on location, hobbies, psychology
  const [proactiveInsights, setProactiveInsights] = useState<ProactiveInsight[]>([
    {
      id: 'ins-1',
      type: 'location',
      badge: 'Lokasyon & Dinginlik',
      icon: 'MapPin',
      title: 'Moda Sahilinde 20 Dk Zihinsel Boşalım Yürüyüşü',
      snippet: 'Kadıköy/Moda havası şu an 21°C ve rüzgarsız. 15:30 toplantısı öncesi 20 dakikalık yürüyüş kortizol seviyeni %28 düşürür.',
      fullContent: 'Lokasyon verin (Moda, Kadıköy) ve takvimindeki 15:30 boşluğu eşleştirildi. Yürüyüş rotasında Moda İskelesi tarafı tercih edilirse deniz havası zihinsel netliğini destekleyecektir.',
      actionPrompt: 'AYZEK, bu yürüyüşü takvime tampon olarak ekle ve beni 10 dakika önce uyar.',
    },
    {
      id: 'ins-2',
      type: 'hobby',
      badge: 'Hobi & İlgi Alanı',
      icon: 'Compass',
      title: 'Filtre Kahve & Yelken: Hafta Sonu Rüzgar Analizi',
      snippet: 'Kalamış Marina için hafta sonu 12 knot güneybatı rüzgarı öngörülüyor. Pazar sabahı için harika bir seyir fırsatı.',
      fullContent: 'Hobilerin (Yelken ve Filtre Kahve Demleme) doğrultusunda hava tahmin motoruyla senkronize olundu. Cumartesi sabahı Etiyopya Yirgacheffe demlemesi eşliğinde rota planlaması yapman önerilir.',
      actionPrompt: 'Hafta sonu yelken seyri için ajandama 3 saatlik blok oluştur ve gerekli hazırlıkları listele.',
    },
    {
      id: 'ins-3',
      type: 'psychology',
      badge: 'Sırdaş & Psikolog',
      icon: 'Heart',
      title: 'İçsel Yükü Paylaş: Bugün Zihnini Ne Meşgul Ediyor?',
      snippet: 'Son 48 saattir iş kararlarında yoğun efor sarf ettin. Karar yorgunluğu hissettiğinde iç sesini yargılamadan dinlemeye hazırım.',
      fullContent: 'AYZEK bilişsel modeli seni sadece bir profesyonel değil, bir insan olarak dengede tutar. İster şirket ikilemi ister özel hayatındaki hislerin olsun, bana bir dostuna anlatır gibi yazabilirsin.',
      actionPrompt: 'Merhaba AYZEK, seninle biraz dertleşmek ve kafamı toparlamak istiyorum...',
    },
    {
      id: 'ins-4',
      type: 'research',
      badge: '2026 Bilişsel Bilim',
      icon: 'Sparkles',
      title: 'Derin Odak & Dopamin Regülasyonu Araştırması',
      snippet: 'Nature Neuroscience 2026: Günün ilk 90 dakikasında ekran maruziyeti yerine 10 dakika doğal ışık alan liderlerde tükenmişlik %40 daha az.',
      fullContent: 'Bilişsel bilim ilgi alanına yönelik taranan son akademik yayınlar; sabah ilk saatlerde doğrudan bildirimlere bakmak yerine gökyüzüne bakmanın prefrontal korteksi koruduğunu gösteriyor.',
      actionPrompt: 'AYZEK, yarın sabah için bu bilişsel rutini takvimime entegre et.',
    },
  ]);

  // Check-in state
  const [checkin, setCheckin] = useState<MoodCheckin>({
    energy: 'balanced',
    mood: 'calm',
    focus: 'balanced',
    note: '',
    aiAdvice: 'Öğleden sonra derin odak gerektiren görevlerinizi 15:30 öncesinde tamamlayın, akşam 18:00 koruması aktif.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  // Work Life balance (Defaults to false per user request: never activates unless user explicitly enables it)
  const [balance, setBalance] = useState<WorkLifeBalance>(() => {
    const saved = localStorage.getItem('ayzek_balance_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          score: parsed.score || 78,
          status: parsed.status || 'Dengeli',
          smartGuardActive: parsed.smartGuardActive === true, // Only if explicitly user-activated
          cutOffTime: parsed.cutOffTime || '18:00',
          connectedCount: parsed.connectedCount || 9,
        };
      } catch {}
    }
    return {
      score: 78,
      status: 'Dengeli',
      smartGuardActive: false, // Default is strictly FALSE unless user explicitly enables
      cutOffTime: '18:00',
      connectedCount: 9,
    };
  });

  // Coach goal
  const [coachGoal, setCoachGoal] = useState<CoachGoal>({
    id: 'goal-c1',
    title: 'İngilizceyi Akıcı Konuşmak (C1 Profesyonel İletişim)',
    category: 'Yabancı Dil',
    timeline: 'Ufuk: 6 Ay',
    subtext: 'Global projelerde rahat sunum yapmak ve uluslararası paydaşlarla akıcı diyalog kurmak.',
    progress: 45,
    progressDelta: '+5%',
    quote: 'Dilde mükemmellik değil, temas sıklığı kazandırır. Bugün sadece 10 dakika ilgilendiğin bir konuda İngilizce podcast dinlemek bile zihnindeki sinirsel bağları canlı tutar.',
    microStep: 'Haftada 3 gün işe giderken 15 dk İngilizce podcast dinleme.',
  });

  // Bio rhythm
  const [bioRhythm, setBioRhythm] = useState<BiologicalRhythm>({
    phase: 'Foliküler Evre (Yüksek Enerji & Odak)',
    day: 8,
    physicalAdvice: 'Kuvvet antrenmanları, yeni projelere başlama ve tempolu kardiyo için harika zaman.',
    mentalAdvice: 'Yaratıcılık, dil öğrenimi ve stratejik kararlar için zihnin en berrak olduğu evre.',
    nextExpectedDate: '2026-10-15',
  });

  // Routine summary
  const [routineSummary, setRoutineSummary] = useState<RoutineSummary>({
    workHours: '09:00 - 18:00 Mesai',
    completedCount: 2,
    remainingCount: 2,
    eveningFreeMinutes: 50,
  });

  // Decision dilemmas
  const [dilemmas, setDilemmas] = useState<DilemmaItem[]>([
    {
      id: 'dilemma-1',
      title: "Grispi'den başka şirkete geçmeli miyim?",
      alignmentScore: 88,
      category: 'Kariyer',
      tag: 'Uyum',
      pros: [
        'Uluslararası çalışma imkanı ve döviz bazlı gelir potansiyeli',
        'Yeni teknoloji yığını ile kendini geliştirme fırsatı',
        'Zihinsel tazelenme ve daha geniş bir profesyonel ağ',
      ],
      cons: [
        'İlk 90 gün boyunca yeni ekip ve şirket kültürüne adaptasyon eforu',
        'Grispi içerisindeki mevcut güven ve kıdem konfor alanından çıkış',
      ],
      recommendation:
        'Kariyer hedefleriniz ve uzun vadeli vizyonunuzla %88 uyumlu. Teklif detaylarında esnek çalışma saatlerini ve yıllık izin politikalarını netleştirdikten sonra adım atılması tavsiye edilir.',
      verdict: 'Koşulları Netleştirip Adım At',
    },
    {
      id: 'dilemma-2',
      title: 'Bu arabayı şimdi almalı mıyım?',
      alignmentScore: 92,
      category: 'Finans',
      tag: 'Yatırım',
      pros: [
        'Enflasyonist ortamda değer koruma potansiyeli',
        'Hafta sonu kişisel mobilite ve seyahat özgürlüğü artışı',
        'Düşük faizli taşıt kredisi imkanı',
      ],
      cons: [
        'Kasko, sigorta ve yıllık bakım maliyetlerinin bütçeye ek yükü',
        'Aylık nakit akışında %12 oranında geçici daralma',
      ],
      recommendation:
        'Finansal tampon fonunuzu koruduğunuz sürece %92 oranında mantıklı bir yatırım.',
      verdict: 'Finansal Rezervi Koru & İlerle',
    },
  ]);

  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedDilemma, setSelectedDilemma] = useState<DilemmaItem | null>(null);

  // Proactive Alert
  const [proactiveAlert, setProactiveAlert] = useState<ProactiveAlert | null>({
    id: 'alert-market',
    title: 'AYZEK PROAKTİF HATIRLATMA',
    time: 'Şimdi',
    content: 'İşten çıkmana 15 dakika kaldı. Eve gitmeden markete uğrayacaktın. Süt, yumurta ve kahve listendeydi. 🛒',
    actionLabel: 'Listeyi Gör',
    dismissLabel: 'Gitmeyeceğim',
    active: true,
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const createTaskId = () => `task-${crypto.randomUUID()}`;

  // Tasks & Timeline Items
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-market',
      title: 'Market Alışverişi',
      category: 'alisveris',
      time: '17:45 · İş Çıkışı · 15 dk kala',
      date: todayStr,
      highlight: '⚡ AYZEK ile Yaşam Senkronizasyonunu Tamamla',
      isCompleted: false,
      details: 'Alınacaklar: Organik süt (2lt), taze yumurta, filtre kahve çekirdeği.',
      actionType: 'view_list',
    },
    {
      id: 'task-bill',
      title: 'Elektrik Faturası',
      category: 'finans',
      time: 'Yarın · Son Gün',
      date: todayStr,
      highlight: 'Enerjisa fatura ödeme hatırlatıcısı aktif · 780 TL',
      isCompleted: false,
      badgeText: '780 TL Son Gün',
      actionType: 'pay_bill',
    },
    {
      id: 'task-birthday',
      title: 'Annemin Doğum Günü',
      category: 'aile',
      time: '4 Gün Kaldı · 28 Eylül',
      date: todayStr,
      highlight: 'Anılardan üretilen mektup taslağını ve hediye planını gör 🎁',
      isCompleted: false,
      badgeText: '28 Eylül',
      actionType: 'draft_message',
    },
    {
      id: 'task-sprint',
      title: 'Grispi Q3 Sprint Planlama Toplantısı',
      category: 'is',
      time: '14:00 - 15:30 · Microsoft Teams',
      date: todayStr,
      highlight: 'Toplantı sonrası 15 dk akıllı tampon korundu',
      isCompleted: true,
      actionType: 'default',
    },
    {
      id: 'task-lunch',
      title: 'Öğle Molası & 15 Dk Temiz Hava Yürüyüşü',
      category: 'kisisel',
      time: '12:30 - 13:30',
      date: todayStr,
      highlight: 'Fiziksel zindelik ve foliküler evre için önerilen hareket',
      isCompleted: true,
      actionType: 'default',
    },
  ]);

  // Connected Services Hub
  const [services, setServices] = useState<ConnectedService[]>([
    {
      id: 'teams',
      name: 'Microsoft Teams',
      account: 'Demo hesabı',
      status: 'Bağlı Değil',
      icon: 'teams',
      items: [
        'Toplantı: Grispi Q3 Sprint Planlama (14:00)',
        'Kanal Uyarısı: Mimari & Altyapı yol haritası onaylandı',
      ],
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 'gmail',
      name: 'Gmail & Google Workspace',
      account: 'Demo hesabı',
      status: 'Bağlı Değil',
      icon: 'gmail',
      items: [
        'E-fatura: Enerjisa Elektrik 780 TL (Ödeme Vadesi: Yarın)',
        'Rezervasyon: Moda sahilinde cuma akşam yemeği teyit edildi',
      ],
      unreadCount: 1,
      toggleable: true,
      isActive: false,
    },
    {
      id: 'meet',
      name: 'Google Meet',
      account: 'Demo hesabı',
      status: 'Bağlı Değil',
      icon: 'meet',
      items: [
        'Günün Görüşmesi: 11:00 Q3 Büyüme Değerlendirmesi',
        'Akıllı Tampon: Toplantı sonrasına 15 dk koruma eklendi',
      ],
      unreadCount: 0,
      toggleable: true,
      isActive: false,
    },
    {
      id: 'zoom',
      name: 'Zoom Pro Meetings',
      account: 'Demo hesabı',
      status: 'Bağlı Değil',
      icon: 'zoom',
      items: [
        'Yatırımcı Görüşmesi: Perşembe 16:30 takvime işlendi',
        'Transkript Motoru: Toplantı bittiğinde aksiyonlar AYZEK ajandasına düşecek',
      ],
      unreadCount: 0,
      isActive: false,
    },
    {
      id: 'calendar',
      name: 'Google & Outlook Takvimler',
      account: 'Demo takvim',
      status: 'Bağlı Değil',
      icon: 'calendar',
      items: [
        'Denge Koruması (Smart Guard): 18:00 sonrası toplantı blokajı devrede',
        'Birleşik Çizelge: İş toplantıları mavi, kişisel randevular mor',
      ],
      unreadCount: 0,
      toggleable: true,
      isActive: false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp (İzinli Konuşma Analizörü)',
      account: 'Demo kanal',
      status: 'Bağlı Değil',
      icon: 'whatsapp',
      category: 'comm',
      syncType: 'webhook',
      items: [
        'Zeynep Sohbeti: "Akşam gelirken marketten kahve almayı unutma"',
        'Psikolog Koçluğu: Zeynep son mesajda biraz yorgun görünüyordu, empati hatırlatıcısı oluşturuldu',
      ],
      unreadCount: 3,
      isActive: false,
    },
    {
      id: 'health',
      name: 'Apple Health & Biyo-Sensörler',
      account: 'Apple HealthKit + Oura Ring Gen3',
      status: 'Bağlı Değil',
      icon: 'health',
      category: 'health',
      syncType: 'healthkit',
      items: [
        'Uyku Kalitesi: %86 Derin Uyku Skoru (7s 42dk)',
        'HRV: 64ms · Otonom Sinir Sistemi Dengede',
        'Foliküler Faz: Yüksek Bilişsel Kapasite Penceresi Aktif',
      ],
      unreadCount: 0,
      toggleable: true,
      isActive: false,
    },
    {
      id: 'banking',
      name: 'Açık Bankacılık & Finart Radar',
      account: 'Demo finans sağlayıcısı',
      status: 'Bağlı Değil',
      icon: 'banking',
      category: 'finance',
      syncType: 'rest',
      items: [
        'Enerjisa 780 TL: Son Ödeme Tarihi Yarın',
        'Finansal Tampon: 3.2 Aylık Acil Rezerv Güvende',
        'Abonelik Taraması: 1 Aktif Olmayan Yazılım Tespit Edildi',
      ],
      unreadCount: 1,
      toggleable: true,
      isActive: false,
    },
    {
      id: 'notion',
      name: 'Notion & Jira Workspace',
      account: 'Demo çalışma alanı',
      status: 'Bağlı Değil',
      icon: 'notion',
      category: 'work',
      syncType: 'webhook',
      items: [
        'Notion: "C1 İngilizce Sunum Taslağı" 2 yeni not eklendi',
        'Jira Sprint: Q3 Mimari Entegrasyon bileti yayına hazır',
      ],
      unreadCount: 2,
      toggleable: true,
      isActive: false,
    },
  ]);

  // Hayatın Merkezi 2026 Vision Showcase modal
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);

  // Connect or update service helper
  const connectService = (newService: Partial<ConnectedService> & { id: string; name: string }) => {
    setServices((prev) => {
      const exists = prev.find((s) => s.id === newService.id);
      if (exists) {
        return prev.map((s) => (s.id === newService.id ? { ...s, ...newService, status: 'Bağlı Değil' as const, isActive: false } : s));
      }
      const fullService: ConnectedService = {
        id: newService.id,
        name: newService.name,
        account: newService.account || 'Bağlantı kurulmadı',
        status: 'Bağlı Değil',
        icon: (newService.icon as any) || 'calendar',
        items: newService.items || [],
        unreadCount: 0,
        toggleable: true,
        isActive: false,
        category: newService.category || 'work',
        syncType: newService.syncType || 'rest',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      return [...prev, fullService];
    });
  };

  // Assistant & Messages
  const generalConversation: ConversationSummary = { id: 'default', title: 'Genel konuşma', createdAt: '', updatedAt: '' };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([generalConversation]);
  const [activeConversationId, setActiveConversationId] = useState('default');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sync toast indicator
  const [syncToast, setSyncToast] = useState<{ show: boolean; text: string } | null>(null);

  // Cognitive Sanctuary / Sırdaş modal
  const [isSanctuaryOpen, setIsSanctuaryOpen] = useState(false);

  // Birthday / Letter draft modal
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [isDraftLoading, setIsDraftLoading] = useState(false);

  // Checkout modal
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);
  const [checkoutBillingCycle, setCheckoutBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // iOS PWA Install Modal
  const [isIosInstallModalOpen, setIsIosInstallModalOpen] = useState(false);

  // 6 Ultra-Attractive Features State
  const [isVoiceBriefingOpen, setIsVoiceBriefingOpen] = useState(false);
  const [isCognitiveWrappedOpen, setIsCognitiveWrappedOpen] = useState(false);
  const [isPoliteDeclineOpen, setIsPoliteDeclineOpen] = useState(false);
  const [isAlwaysOnWatchOpen, setIsAlwaysOnWatchOpen] = useState(false);
  const [isMeetingShadowOpen, setIsMeetingShadowOpen] = useState(false);
  const [isFutureSelfOpen, setIsFutureSelfOpen] = useState(false);

  // Clear legacy fixture state as soon as the app starts. Authenticated users are
  // then hydrated from their own Firestore workspace; visitors see only neutral
  // empty states while that happens.
  useEffect(() => {
    setAutonomousLogs([]);
    setProactiveInsights([]);
    setProactiveAlert(null);
    setTasks([]);
    setNotifications([]);
    setDilemmas([]);
    setBalance({ score: 0, status: 'Dengeli', smartGuardActive: false, cutOffTime: '18:00', connectedCount: 0 });
    setCheckin({ energy: 'balanced', mood: 'calm', focus: 'balanced', note: '', aiAdvice: '', updatedAt: '' });
    setCoachGoal({
      id: 'goal-new', title: 'İlk hedefini oluştur', category: 'Başlangıç', timeline: 'Hazır olduğunda',
      subtext: 'AYZEK, seçtiğin hedefe göre kişisel bir plan hazırlayacak.', progress: 0, progressDelta: '',
      quote: 'Küçük ve net bir başlangıç, sürdürülebilir bir değişimin ilk adımıdır.', microStep: 'Bir hedef belirle ve ilk adımı seç.',
    });
    setBioRhythm({ phase: 'Ayarlanmadı', day: 0, physicalAdvice: 'Bu alanı istersen kişisel tercihlerinle ayarlayabilirsin.', mentalAdvice: 'Henüz bir ritim değerlendirmesi yapılmadı.', nextExpectedDate: '—' });
    setRoutineSummary({ workHours: 'Planlanmadı', completedCount: 0, remainingCount: 0, eveningFreeMinutes: 0 });
    setServices((current) => current.map((service) => ({ ...service, account: 'Bağlantı kurulmadı', items: [], unreadCount: 0, isActive: false })));
  }, []);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsWorkspaceHydrated(false);
        setMessages([]);
        setActiveConversationId('default');
        try {
          const profile = await getOrCreateUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
          setUserProfile(profile);

          const savedData = await getUserData(firebaseUser.uid);
          if (savedData) {
            if (savedData.balance) setBalance(savedData.balance);
            if (savedData.checkin) setCheckin(savedData.checkin);
            if (savedData.tasks) setTasks(savedData.tasks);
            if (savedData.dilemmas) setDilemmas(savedData.dilemmas);
            if (savedData.services) setServices(savedData.services);
            if (savedData.coachGoal) setCoachGoal(savedData.coachGoal);
            if (savedData.notifications) setNotifications(savedData.notifications);
          } else {
            // A new workspace starts empty. Personal-looking fixture data must
            // never be presented as if it belonged to the signed-in user.
            setBalance({ score: 0, status: 'Dengeli', smartGuardActive: false, cutOffTime: '18:00', connectedCount: 0 });
            setCheckin({ energy: 'balanced', mood: 'calm', focus: 'balanced', note: '', aiAdvice: '', updatedAt: '' });
            setTasks([]);
            setNotifications([]);
            setDilemmas([]);
            setAutonomousLogs([]);
            setProactiveInsights([]);
            setProactiveAlert(null);
            setCoachGoal({
              id: 'goal-new', title: 'İlk hedefini oluştur', category: 'Başlangıç', timeline: 'Hazır olduğunda',
              subtext: 'AYZEK, seçtiğin hedefe göre kişisel bir plan hazırlayacak.', progress: 0, progressDelta: '',
              quote: 'Küçük ve net bir başlangıç, sürdürülebilir bir değişimin ilk adımıdır.', microStep: 'Bir hedef belirle ve ilk adımı seç.',
            });
            setBioRhythm({ phase: 'Ayarlanmadı', day: 0, physicalAdvice: 'Bu alanı istersen kişisel tercihlerinle ayarlayabilirsin.', mentalAdvice: 'Henüz bir ritim değerlendirmesi yapılmadı.', nextExpectedDate: '—' });
            setRoutineSummary({ workHours: 'Planlanmadı', completedCount: 0, remainingCount: 0, eveningFreeMinutes: 0 });
            setServices((current) => current.map((service) => ({ ...service, account: 'Bağlantı kurulmadı', items: [], unreadCount: 0, isActive: false })));
          }

          const storedConversations = await listConversations(firebaseUser.uid);
          setConversations([
            generalConversation,
            ...storedConversations.filter((conversation) => conversation.id !== generalConversation.id),
          ]);
          const storedMessages = await loadConversationMessages(firebaseUser.uid, generalConversation.id);
          setMessages(storedMessages);
        } catch (err) {
          console.error('Firestore profile sync error:', err);
        } finally {
          setIsWorkspaceHydrated(true);
        }
      } else {
        setIsWorkspaceHydrated(false);
        setMessages([]);
        setNotifications([]);
        setConversations([generalConversation]);
        setActiveConversationId('default');
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to Firestore when important user states change
  useEffect(() => {
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid || !isWorkspaceHydrated) return;
    const timeout = setTimeout(() => {
      saveUserData(currentUid, {
        balance,
        checkin,
        tasks,
        dilemmas,
        services,
        coachGoal,
        notifications,
      }).catch((e) => console.error('Kullanıcı verisi senkronu başarısız:', e));
    }, 1500);

    return () => clearTimeout(timeout);
  }, [user, userProfile, isWorkspaceHydrated, balance, checkin, tasks, dilemmas, services, coachGoal, notifications]);

  // Auth methods must fail closed; a failed login cannot create a paid local session.
  const loginWithEmail = async (email: string, pass: string) => {
    setIsAuthLoading(true);
    let resolvedUser: AuthUserState;
    let resolvedProfile: UserProfile;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      resolvedUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
      };
      resolvedProfile = await getOrCreateUserProfile({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
      });
    } catch {
      setIsAuthLoading(false);
      throw new Error('Giriş yapılamadı. Lütfen bilgilerinizi ve Firebase yapılandırmasını kontrol edin.');
    }

    setUser(resolvedUser);
    setUserProfile(resolvedProfile);
    showSyncNotification(`Hoş geldiniz, ${resolvedProfile.displayName}!`);
    setIsAuthLoading(false);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setIsAuthLoading(true);
    let resolvedUser: AuthUserState;
    let resolvedProfile: UserProfile;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      resolvedUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name || cred.user.displayName || email.split('@')[0],
      };
      resolvedProfile = await getOrCreateUserProfile({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
      });
      await sendEmailVerification(cred.user).catch((error) => {
        console.warn('E-posta doğrulama bağlantısı gönderilemedi:', error);
      });
    } catch {
      setIsAuthLoading(false);
      throw new Error('Hesap oluşturulamadı. Lütfen Firebase yapılandırmasını kontrol edin.');
    }

    setUser(resolvedUser);
    setUserProfile(resolvedProfile);
    showSyncNotification(`Hesabınız oluşturuldu: ${resolvedProfile.displayName}. Doğrulama e-postasını kontrol edin.`);
    setIsAuthLoading(false);

    // Launch First Stars Onboarding
    setTimeout(() => {
      setIsOnboardingOpen(true);
    }, 400);
  };

  const requestPasswordReset = async (email: string) => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) throw new Error('Parola sıfırlama için e-posta adresinizi girin.');
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
    } catch {
      throw new Error('Sıfırlama bağlantısı gönderilemedi. Firebase e-posta sağlayıcısını ve adresinizi kontrol edin.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setUser(null);
    setUserProfile(null);
    setIsWorkspaceHydrated(false);
    setMessages([]);
    setConversations([generalConversation]);
    setActiveConversationId('default');
    showSyncNotification('Oturum kapatıldı.');
  };

  // Run autonomous scan in background
  const runAutonomousScan = async () => {
    setIsScanningLogs(true);
    // No external source is queried until a provider-specific integration exists.
    await new Promise((r) => setTimeout(r, 300));
    setIsScanningLogs(false);
    showSyncNotification('Tarama için henüz yetkilendirilmiş bir veri kaynağı yok. Önce bir servis bağlantısı kurun.');
  };

  const updateProfileInfo = async (details: Partial<UserProfile>) => {
    const previousProfile = userProfile;
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid) {
      throw new Error('Profil kaydı için oturum açmanız gerekiyor.');
    }
    setUserProfile((prev) => (prev ? { ...prev, ...details } : null));
    try {
      await updateUserProfileDetails(currentUid, details);
    } catch (error) {
      setUserProfile(previousProfile);
      throw error;
    }
    showSyncNotification('Kullanıcı hafıza ve profil bilgileri güncellendi.');
  };

  const completeQuickTour = async () => {
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid) {
      setIsQuickTourOpen(false);
      return;
    }
    await updateUserProfileDetails(currentUid, { quickTourCompleted: true });
    setUserProfile((previous) => previous ? { ...previous, quickTourCompleted: true } : previous);
    setIsQuickTourOpen(false);
  };

  const openCheckoutModal = (plan: PricingPlan, cycle: 'monthly' | 'yearly') => {
    setCheckoutPlan(plan);
    setCheckoutBillingCycle(cycle);
    setIsCheckoutModalOpen(true);
  };

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('ayzek_theme', t);
    if (t === 'dark' || t === 'crimson') {
      document.documentElement.classList.add('dark', 'crimson');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark', 'crimson');
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'crimson' : 'light');
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('ayzek_view_mode', mode);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'desktop' ? 'mobile_sim' : 'desktop');
  };

  useEffect(() => {
    if (theme === 'dark' || theme === 'crimson') {
      document.documentElement.classList.add('dark', 'crimson');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark', 'crimson');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const clearSyncToast = () => setSyncToast(null);

  const showSyncNotification = (text: string) => {
    setSyncToast({ show: true, text });
    setTimeout(() => {
      setSyncToast(null);
    }, 4500);
  };

  const addNotification = (category: NotificationItem['category'], title: string) => {
    setNotifications((previous) => [{ id: crypto.randomUUID(), category, title, createdAt: new Date().toISOString() }, ...previous].slice(0, 100));
  };

  const markNotificationsRead = () => {
    const now = new Date().toISOString();
    setNotifications((previous) => previous.map((notification) => notification.readAt ? notification : { ...notification, readAt: now }));
  };

  const extractMemoryCandidate = (text: string): MemoryCandidate | null => {
    const content = text.trim();
    if (content.length < 8 || content.length > 500) return null;
    const lower = content.toLocaleLowerCase('tr-TR');
    if (/\b(hedefim|amacım|planım)\b/.test(lower)) return { content, category: 'goal' };
    if (/\b(çalışma saatlerim|çalışıyorum|projede|iş yerinde)\b/.test(lower)) return { content, category: 'work_context' };
    if (/\b(tercihim|tercih ederim|istemiyorum|bana .*?(yaz|söyle|hatırlat))\b/.test(lower)) return { content, category: 'preference' };
    return null;
  };

  const acceptMemoryCandidate = async () => {
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid || !memoryCandidate) return;
    await saveExplicitMemory(currentUid, memoryCandidate.content, memoryCandidate.category);
    addNotification('system', 'Yeni tercih veya hedef hafızaya kaydedildi.');
    setMemoryCandidate(null);
  };

  const dismissMemoryCandidate = () => setMemoryCandidate(null);

  const executeAppAction = (action: AppAction) => {
    switch (action.type) {
      case 'ADD_TASK': {
        const payload = action.payload || {};
        const newTask: TaskItem = {
          id: createTaskId(),
          title: payload.title || 'Yeni Görev',
          category: payload.category || 'kisisel',
          time: payload.time || 'Bugün · AYZEK Senkron',
          date: payload.date || todayStr,
          highlight: '⚡ AYZEK Konuşması ile Otomatik Eklendi',
          isCompleted: false,
          status: 'open',
          source: 'approved_ai',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          details: payload.details || payload.note || '',
          actionType: 'default',
        };
        setTasks((prev) => [newTask, ...prev]);
        setRoutineSummary((prev) => ({
          ...prev,
          remainingCount: prev.remainingCount + 1,
        }));
        showSyncNotification(action.description || `Görev eklendi: "${newTask.title}"`);
        break;
      }
      case 'COMPLETE_TASK': {
        const id = action.payload?.id;
        const titleKeyword = (action.payload?.titleKeyword || action.payload?.title)?.toLowerCase();
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === id || (titleKeyword && t.title.toLowerCase().includes(titleKeyword))) {
              return { ...t, isCompleted: true, status: 'completed', completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            }
            return t;
          })
        );
        showSyncNotification(action.description || 'Görev tamamlandı olarak işaretlendi.');
        break;
      }
      case 'UPDATE_MOOD': {
        const p = action.payload || {};
        setCheckin((prev) => ({
          ...prev,
          energy: p.energy || prev.energy,
          mood: p.mood || prev.mood,
          focus: p.focus || prev.focus,
          note: p.note || prev.note,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        showSyncNotification(action.description || 'Ruh haliniz ve enerji durumunuz senkronize edildi.');
        break;
      }
      case 'ADD_DILEMMA': {
        const p = action.payload || {};
        const newDilemma: DilemmaItem = {
          id: `dilemma-${Date.now()}`,
          title: p.title || 'Yeni İkilem',
          alignmentScore: p.alignmentScore || 85,
          category: p.category || 'Kariyer',
          tag: 'Uyum',
          pros: Array.isArray(p.pros) ? p.pros : ['Değerlerle uyumlu potansiyel', 'Gelişim fırsatı'],
          cons: Array.isArray(p.cons) ? p.cons : ['Belirsizlik faktörü'],
          recommendation: p.recommendation || 'Veriler analiz edildi, denge gözetilmeli.',
          verdict: p.verdict || 'Aksiyon Planı Hazırla',
        };
        setDilemmas((prev) => [newDilemma, ...prev]);
        showSyncNotification(action.description || `Karar matrisine yeni ikilem eklendi: "${newDilemma.title}"`);
        break;
      }
      case 'UPDATE_BALANCE': {
        const p = action.payload || {};
        setBalance((prev) => {
          const next = {
            ...prev,
            score: p.scoreDelta ? Math.min(100, Math.max(0, prev.score + p.scoreDelta)) : prev.score,
            smartGuardActive: p.smartGuardActive !== undefined ? p.smartGuardActive : prev.smartGuardActive,
          };
          try {
            localStorage.setItem('ayzek_balance_state', JSON.stringify(next));
          } catch {}
          return next;
        });
        showSyncNotification(action.description || 'İş-Özel hayat denge ayarları güncellendi.');
        break;
      }
      case 'UPDATE_GOAL': {
        const p = action.payload || {};
        setCoachGoal((prev) => ({
          ...prev,
          progress: p.progressDelta ? Math.min(100, prev.progress + p.progressDelta) : prev.progress,
          microStep: p.microStep || prev.microStep,
        }));
        showSyncNotification(action.description || 'Kişisel gelişim hedefi adımı güncellendi.');
        break;
      }
      case 'DISMISS_ALERT': {
        setProactiveAlert(null);
        showSyncNotification('Proaktif hatırlatma kapatıldı.');
        break;
      }
      default:
        break;
    }
  };

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const candidate = extractMemoryCandidate(userText);
    if (candidate) setMemoryCandidate(candidate);
    if (user?.uid) {
      saveConversationMessage(user.uid, userMessage, activeConversationId).catch((error) => console.error('Mesaj kaydedilemedi:', error));
    }
    setIsChatLoading(true);

    try {
      const response = await authenticatedFetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Yanıt üretilemedi.');
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.message || 'Yanıt şu anda üretilemedi. Lütfen tekrar deneyin.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (user?.uid) {
        saveConversationMessage(user.uid, assistantMessage, activeConversationId).catch((error) => console.error('Yanıt kaydedilemedi:', error));
      }
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Yanıt şu anda oluşturulamadı. Lütfen bağlantınızı ve oturumunuzu kontrol edip tekrar deneyin.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const startConversation = async () => {
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid) throw new Error('Yeni konuşma oluşturmak için giriş yapmanız gerekiyor.');
    const conversation = await createConversation(currentUid);
    setConversations((previous) => [conversation, ...previous]);
    setActiveConversationId(conversation.id);
    setMessages([]);
  };

  const switchConversation = async (conversationId: string) => {
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid) throw new Error('Konuşmaya erişmek için giriş yapmanız gerekiyor.');
    setMessages([]);
    setActiveConversationId(conversationId);
    const storedMessages = await loadConversationMessages(currentUid, conversationId);
    setMessages(storedMessages);
  };

  const renameActiveConversation = async (title: string) => {
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid) throw new Error('Konuşmayı değiştirmek için giriş yapmanız gerekiyor.');
    if (activeConversationId === generalConversation.id) {
      throw new Error('Genel konuşmanın adı değiştirilemez.');
    }
    await renameConversation(currentUid, activeConversationId, title);
    setConversations((previous) => previous.map((conversation) => (
      conversation.id === activeConversationId ? { ...conversation, title: title.trim(), updatedAt: new Date().toISOString() } : conversation
    )));
  };

  const archiveActiveConversation = async () => {
    const currentUid = user?.uid || userProfile?.uid;
    if (!currentUid) throw new Error('Konuşmayı arşivlemek için giriş yapmanız gerekiyor.');
    if (activeConversationId === generalConversation.id) {
      throw new Error('Genel konuşma arşivlenemez.');
    }
    const archivedId = activeConversationId;
    await archiveConversation(currentUid, archivedId);
    setConversations((previous) => previous.filter((conversation) => conversation.id !== archivedId));
    setActiveConversationId(generalConversation.id);
    setMessages(await loadConversationMessages(currentUid, generalConversation.id));
  };

  const deleteActiveConversation = async () => {
    if (activeConversationId === generalConversation.id) {
      throw new Error('Genel konuşma silinemez.');
    }
    const response = await authenticatedFetch(`/api/conversations/${encodeURIComponent(activeConversationId)}`, { method: 'DELETE' });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Konuşma silinemedi.');
    }
    setConversations((previous) => previous.filter((conversation) => conversation.id !== activeConversationId));
    setActiveConversationId(generalConversation.id);
    const currentUid = user?.uid || userProfile?.uid;
    setMessages(currentUid ? await loadConversationMessages(currentUid, generalConversation.id) : []);
  };

  const clearConversationHistory = async () => {
    const response = await authenticatedFetch('/api/conversations', {
      method: 'DELETE',
      body: JSON.stringify({ confirmation: 'CLEAR_CONVERSATION_HISTORY' }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Sohbet geçmişi silinemedi.');
    }
    setMessages([]);
    setConversations([generalConversation]);
    setActiveConversationId(generalConversation.id);
  };

  const openAssistantWithQuery = (query: string) => {
    setIsAssistantOpen(true);
    sendMessage(query);
  };

  const fetchPersonalAdvice = async () => {
    setIsAdviceLoading(true);
    try {
      const res = await authenticatedFetch('/api/gemini/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energy: checkin.energy,
          mood: checkin.mood,
          focus: checkin.focus,
          note: checkin.note,
          bioPhase: bioRhythm.phase,
          location: userProfile?.location,
          lifeMission: userProfile?.lifeMission,
        }),
      });
      const data = await res.json();
      if (data.advice) {
        setCheckin((prev) => ({
          ...prev,
          aiAdvice: data.advice,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        showSyncNotification('AYZEK: Yeni kişiselleştirilmiş gün tavsiyesi oluşturuldu.');
      }
    } catch (err) {
      console.error('Advice hatası:', err);
    } finally {
      setIsAdviceLoading(false);
    }
  };

  const generateDraft = async (recipient: string, occasion: string) => {
    setIsDraftLoading(true);
    setIsDraftModalOpen(true);
    try {
      const res = await authenticatedFetch('/api/gemini/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, occasion }),
      });
      const data = await res.json();
      setDraftContent(data.draft || 'Sevgilerimle...');
    } catch (err) {
      setDraftContent('Canım Annem, doğum günün kutlu olsun. İyi ki varsın!');
    } finally {
      setIsDraftLoading(false);
    }
  };

  const updateCheckin = (fields: Partial<MoodCheckin>) => {
    setCheckin((prev) => ({
      ...prev,
      ...fields,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  };

  const toggleSmartGuard = () => {
    setBalance((prev) => {
      const nextActive = !prev.smartGuardActive;
      const nextState = {
        ...prev,
        smartGuardActive: nextActive,
        score: nextActive ? Math.min(100, prev.score + 4) : Math.max(50, prev.score - 4),
      };
      try {
        localStorage.setItem('ayzek_balance_state', JSON.stringify(nextState));
      } catch {}
      showSyncNotification(
        nextActive
          ? 'Akşam koruma tercihi kaydedildi. Bağlı bir takvimde otomatik değişiklik yapılmadı.'
          : 'Akşam koruma tercihi kapatıldı. Bağlı bir takvimde otomatik değişiklik yapılmadı.'
      );
      return nextState;
    });
  };

  const updateCoachProgress = (delta: number) => {
    setCoachGoal((prev) => ({
      ...prev,
      progress: Math.min(100, prev.progress + delta),
    }));
    showSyncNotification(`Hedef ilerlemesi güncellendi: %${Math.min(100, coachGoal.progress + delta)}`);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      const isNowCompleted = target ? !target.isCompleted : false;
      const updated = prev.map((t) => (t.id === id ? {
        ...t,
        isCompleted: isNowCompleted,
        status: isNowCompleted ? 'completed' as const : 'open' as const,
        completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      } : t));

      const completed = updated.filter((t) => t.isCompleted).length;
      const remaining = updated.filter((t) => !t.isCompleted).length;
      setRoutineSummary((r) => ({
        ...r,
        completedCount: completed,
        remainingCount: remaining,
      }));

      showSyncNotification(
        isNowCompleted ? `Görev tamamlandı: "${target?.title}"` : `Görev geri alındı: "${target?.title}"`
      );
      if (target) addNotification('task', isNowCompleted ? `Görev tamamlandı: ${target.title}` : `Görev yeniden açıldı: ${target.title}`);
      return updated;
    });
  };

  const addTask = (task: Partial<TaskItem>) => {
    const newTask: TaskItem = {
      id: createTaskId(),
      title: task.title || 'Yeni Görev',
      category: task.category || 'kisisel',
      time: task.time || 'Bugün · Serbest Zaman',
      date: task.date || todayStr,
      highlight: task.highlight || '⚡ Planlandı',
      isCompleted: false,
      status: 'open',
      source: 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      details: task.details,
      actionType: task.actionType || 'default',
    };
    setTasks((prev) => [newTask, ...prev]);
    setRoutineSummary((r) => ({ ...r, remainingCount: r.remainingCount + 1 }));
    showSyncNotification(`Yeni görev eklendi: "${newTask.title}"`);
    addNotification('task', `Yeni görev eklendi: ${newTask.title}`);
  };

  const updateTask = (id: string, changes: Partial<TaskItem>) => {
    const title = changes.title?.trim();
    if (title !== undefined && !title) return;
    setTasks((previous) => previous.map((task) => task.id === id ? {
      ...task,
      ...changes,
      ...(title ? { title } : {}),
      updatedAt: new Date().toISOString(),
    } : task));
    showSyncNotification('Görev güncellendi.');
  };

  const deleteTask = (id: string) => {
    setTasks((previous) => {
      const target = previous.find((task) => task.id === id);
      const updated = previous.filter((task) => task.id !== id);
      if (target && !target.isCompleted) {
        setRoutineSummary((summary) => ({ ...summary, remainingCount: Math.max(0, summary.remainingCount - 1) }));
      }
      if (target) addNotification('task', `Görev silindi: ${target.title}`);
      return updated;
    });
    showSyncNotification('Görev silindi.');
  };

  const addDilemma = (dilemma: Partial<DilemmaItem>) => {
    const newDilemma: DilemmaItem = {
      id: `dilemma-${Date.now()}`,
      title: dilemma.title || 'Yeni İkilem',
      alignmentScore: dilemma.alignmentScore || 85,
      category: dilemma.category || 'Kariyer',
      tag: 'Uyum',
      pros: dilemma.pros || ['Fırsat 1', 'Fırsat 2'],
      cons: dilemma.cons || ['Zorluk 1'],
      recommendation: dilemma.recommendation || 'Veriler değerlendirildi.',
      verdict: dilemma.verdict || 'Aksiyon Al',
    };
    setDilemmas((prev) => [newDilemma, ...prev]);
    showSyncNotification(`Karar matrisine eklendi: "${newDilemma.title}"`);
  };

  const dismissProactiveAlert = () => {
    setProactiveAlert(null);
    showSyncNotification('Proaktif hatırlatma kapatıldı.');
  };

  const triggerProactiveTest = () => {
    const loc = userProfile?.location || 'Kadıköy';
    setProactiveAlert({
      id: `alert-${Date.now()}`,
      title: 'AYZEK PROAKTİF & KONUM HATIRLATMASI',
      time: 'Şimdi',
      content: `${loc} bölgesinde hafif yağmur başladı ve iş çıkış trafiği yoğunlaşıyor. 18:00 öncesi çıkıp sahilde 10 dk temiz hava yürüyüşü yapmak ister misin?`,
      actionLabel: 'Rotayı Gör',
      dismissLabel: 'Daha Sonra',
      active: true,
    });
    showSyncNotification('⚡ Canlı Proaktif Konum & Yaşam Bildirimi Tetiklendi!');
  };

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        userProfile,
        isAuthLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithEmail,
        registerWithEmail,
        requestPasswordReset,
        logout,
        updateProfileInfo,
        autonomousLogs,
        runAutonomousScan,
        isScanningLogs,
        proactiveInsights,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isQuickTourOpen,
        setIsQuickTourOpen,
        completeQuickTour,
        notifications,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationsRead,
        memoryCandidate,
        acceptMemoryCandidate,
        dismissMemoryCandidate,
        theme,
        setTheme,
        toggleTheme,
        viewMode,
        setViewMode,
        toggleViewMode,
        activeTab,
        setActiveTab,
        checkin,
        updateCheckin,
        fetchPersonalAdvice,
        isAdviceLoading,
        balance,
        toggleSmartGuard,
        coachGoal,
        updateCoachProgress,
        bioRhythm,
        routineSummary,
        dilemmas,
        addDilemma,
        isDecisionModalOpen,
        setIsDecisionModalOpen,
        selectedDilemma,
        setSelectedDilemma,
        proactiveAlert,
        dismissProactiveAlert,
        triggerProactiveTest,
        tasks,
        toggleTask,
        addTask,
        updateTask,
        deleteTask,
        services,
        toggleService,
        messages,
        conversations,
        activeConversationId,
        startConversation,
        switchConversation,
        renameActiveConversation,
        archiveActiveConversation,
        deleteActiveConversation,
        clearConversationHistory,
        sendMessage,
        isChatLoading,
        isAssistantOpen,
        setIsAssistantOpen,
        openAssistantWithQuery,
        syncToast,
        clearSyncToast,
        showSyncNotification,
        isDraftModalOpen,
        setIsDraftModalOpen,
        isSanctuaryOpen,
        setIsSanctuaryOpen,
        draftContent,
        generateDraft,
        isDraftLoading,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutPlan,
        checkoutBillingCycle,
        openCheckoutModal,
        isIosInstallModalOpen,
        setIsIosInstallModalOpen,
        isVisionModalOpen,
        setIsVisionModalOpen,
        connectService,
        isVoiceBriefingOpen,
        setIsVoiceBriefingOpen,
        isCognitiveWrappedOpen,
        setIsCognitiveWrappedOpen,
        isPoliteDeclineOpen,
        setIsPoliteDeclineOpen,
        isAlwaysOnWatchOpen,
        setIsAlwaysOnWatchOpen,
        isMeetingShadowOpen,
        setIsMeetingShadowOpen,
        isFutureSelfOpen,
        setIsFutureSelfOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
