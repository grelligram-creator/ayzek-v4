import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, MoodCheckin, TaskItem, DilemmaItem, WorkLifeBalance, ConnectedService, CoachGoal, ChatMessage, ConversationSummary } from '../types';

export interface UserPersistedData {
  balance: WorkLifeBalance;
  checkin: MoodCheckin;
  tasks: TaskItem[];
  dilemmas: DilemmaItem[];
  services: ConnectedService[];
  coachGoal: CoachGoal;
  updatedAt: string;
}

// Fetch or create user profile
export async function getOrCreateUserProfile(user: { uid: string; email?: string | null; displayName?: string | null }): Promise<UserProfile> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const locale = navigator.language || 'tr-TR';

    if (snap.exists()) {
      const stored = snap.data() as Partial<UserProfile>;
      const normalized: UserProfile = {
        ...stored,
        uid: user.uid,
        email: user.email || stored.email || '',
        displayName: user.displayName || stored.displayName || user.email?.split('@')[0] || 'Yeni kullanıcı',
        subscriptionTier: stored.subscriptionTier || 'free',
        subscriptionStatus: stored.subscriptionStatus || 'trial',
        timezone: stored.timezone || timezone,
        locale: stored.locale || locale,
        createdAt: stored.createdAt || now,
        updatedAt: now,
        lastLoginAt: now,
      };
      await setDoc(userRef, normalized, { merge: true });
      return normalized;
    }

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Yeni kullanıcı',
      subscriptionTier: 'free',
      subscriptionStatus: 'trial',
      jobTitle: '',
      company: '',
      location: '',
      hobbies: [],
      lifeMission: '',
      timezone,
      locale,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      onboardingCompleted: false,
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (err) {
    console.error('Firestore profil işlemi başarısız:', err);
    throw new Error('Profil verisi güvenli biçimde kaydedilemedi. Lütfen tekrar deneyin.');
  }
}

// Fetch user workspace data (tasks, habits, balance)
export async function getUserData(uid: string): Promise<UserPersistedData | null> {
  try {
    const docRef = doc(db, 'userData', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserPersistedData;
    }
  } catch (err) {
    console.error('Firestore çalışma alanı okunamadı:', err);
    throw new Error('Çalışma alanı verileri okunamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
  }
  return null;
}

// Save or sync user workspace data
export async function saveUserData(uid: string, data: Partial<UserPersistedData>): Promise<void> {
  try {
    const docRef = doc(db, 'userData', uid);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Firestore çalışma alanı kaydedilemedi:', err);
    throw new Error('Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.');
  }
}

// Update general profile details
export async function updateUserProfileDetails(
  uid: string,
  details: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...details, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error('Firestore profil güncellemesi başarısız:', err);
    throw new Error('Profil güncellenemedi. Lütfen tekrar deneyin.');
  }
}

const defaultConversationId = 'default';

function conversationFromSnapshot(id: string, data: Record<string, unknown>): ConversationSummary {
  return {
    id,
    title: typeof data.title === 'string' && data.title.trim() ? data.title : 'Yeni konuşma',
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : '',
    ...(typeof data.archivedAt === 'string' ? { archivedAt: data.archivedAt } : {}),
  };
}

export async function listConversations(uid: string): Promise<ConversationSummary[]> {
  const conversationsRef = collection(db, 'users', uid, 'conversations');
  const snapshot = await getDocs(query(conversationsRef, orderBy('updatedAt', 'desc'), limit(50)));
  return snapshot.docs
    .map((entry) => conversationFromSnapshot(entry.id, entry.data()))
    .filter((conversation) => !conversation.archivedAt);
}

export async function createConversation(uid: string, title = 'Yeni konuşma'): Promise<ConversationSummary> {
  const now = new Date().toISOString();
  const ref = doc(collection(db, 'users', uid, 'conversations'));
  const conversation: ConversationSummary = { id: ref.id, title: title.trim() || 'Yeni konuşma', createdAt: now, updatedAt: now };
  await setDoc(ref, conversation);
  return conversation;
}

export async function renameConversation(uid: string, conversationId: string, title: string): Promise<void> {
  const normalizedTitle = title.trim();
  if (!normalizedTitle || normalizedTitle.length > 120) {
    throw new Error('Konuşma adı 1–120 karakter arasında olmalıdır.');
  }
  await setDoc(doc(db, 'users', uid, 'conversations', conversationId), {
    title: normalizedTitle,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function archiveConversation(uid: string, conversationId: string): Promise<void> {
  if (conversationId === defaultConversationId) {
    throw new Error('Varsayılan konuşma arşivlenemez. Önce yeni bir konuşma oluşturun.');
  }
  await setDoc(doc(db, 'users', uid, 'conversations', conversationId), {
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function loadConversationMessages(uid: string, conversationId = defaultConversationId): Promise<ChatMessage[]> {
  const messagesRef = collection(db, 'users', uid, 'conversations', conversationId, 'messages');
  const snapshot = await getDocs(query(messagesRef, orderBy('createdAt', 'asc'), limit(100)));
  return snapshot.docs.map((entry) => {
    const data = entry.data();
    return {
      id: entry.id,
      role: data.role === 'user' ? 'user' : 'assistant',
      content: String(data.content || ''),
      timestamp: String(data.timestamp || ''),
      actionsApplied: Array.isArray(data.actionsApplied) ? data.actionsApplied : undefined,
    };
  });
}

export async function saveConversationMessage(uid: string, message: ChatMessage, conversationId = defaultConversationId): Promise<void> {
  const conversationRef = doc(db, 'users', uid, 'conversations', conversationId);
  const messageRef = doc(conversationRef, 'messages', message.id);
  await setDoc(conversationRef, {
    id: conversationId,
    ...(conversationId === defaultConversationId ? { title: 'Genel konuşma' } : {}),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }, { merge: true });
  await setDoc(messageRef, {
    ...message,
    createdAt: new Date().toISOString(),
  });
}
