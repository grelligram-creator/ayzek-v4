import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, MoodCheckin, TaskItem, DilemmaItem, WorkLifeBalance, ConnectedService, CoachGoal, ChatMessage, ConversationSummary, MemoryItem, NotificationItem } from '../types';

export interface UserPersistedData {
  balance: WorkLifeBalance;
  checkin: MoodCheckin;
  tasks: TaskItem[];
  dilemmas: DilemmaItem[];
  services: ConnectedService[];
  coachGoal: CoachGoal;
  notifications?: NotificationItem[];
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

export async function listArchivedConversations(uid: string): Promise<ConversationSummary[]> {
  const conversationsRef = collection(db, 'users', uid, 'conversations');
  const snapshot = await getDocs(query(conversationsRef, orderBy('updatedAt', 'desc'), limit(50)));
  return snapshot.docs
    .map((entry) => conversationFromSnapshot(entry.id, entry.data()))
    .filter((conversation) => Boolean(conversation.archivedAt));
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

export async function restoreConversation(uid: string, conversationId: string): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'conversations', conversationId), {
    archivedAt: null,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function listMemories(uid: string): Promise<MemoryItem[]> {
  const memoriesRef = collection(db, 'users', uid, 'memories');
  const snapshot = await getDocs(query(memoriesRef, orderBy('updatedAt', 'desc'), limit(100)));
  return snapshot.docs.map((entry) => {
    const data = entry.data();
    return {
      id: entry.id,
      content: String(data.content || ''),
      category: ['preference', 'goal', 'work_context', 'instruction'].includes(data.category) ? data.category : 'preference',
      createdAt: String(data.createdAt || ''),
      updatedAt: String(data.updatedAt || ''),
    } as MemoryItem;
  });
}

export async function saveExplicitMemory(uid: string, content: string, category: MemoryItem['category'] = 'preference'): Promise<MemoryItem> {
  const normalizedContent = content.trim();
  if (!normalizedContent || normalizedContent.length > 500) {
    throw new Error('Hafıza notu 1–500 karakter arasında olmalıdır.');
  }
  const comparisonKey = normalizedContent
    .toLocaleLowerCase('tr-TR')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
  const existingSnapshot = await getDocs(query(collection(db, 'users', uid, 'memories'), limit(100)));
  const existing = existingSnapshot.docs.find((entry) => String(entry.data().content || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim() === comparisonKey);
  if (existing) {
    const data = existing.data();
    return {
      id: existing.id,
      content: String(data.content || ''),
      category: ['preference', 'goal', 'work_context', 'instruction'].includes(data.category) ? data.category : 'preference',
      createdAt: String(data.createdAt || ''),
      updatedAt: String(data.updatedAt || ''),
    };
  }
  const now = new Date().toISOString();
  const ref = doc(collection(db, 'users', uid, 'memories'));
  const memory: MemoryItem = { id: ref.id, content: normalizedContent, category, createdAt: now, updatedAt: now };
  await setDoc(ref, memory);
  return memory;
}

export async function deleteMemory(uid: string, memoryId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'memories', memoryId));
}

function removeSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(removeSecrets);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !/(token|secret|password|credential)/i.test(key))
      .map(([key, nestedValue]) => [key, removeSecrets(nestedValue)])
  );
}

export async function exportUserData(uid: string): Promise<Record<string, unknown>> {
  const [profileSnapshot, workspaceSnapshot, conversationsSnapshot, memories] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    getDoc(doc(db, 'userData', uid)),
    getDocs(collection(db, 'users', uid, 'conversations')),
    listMemories(uid),
  ]);

  const conversations = await Promise.all(conversationsSnapshot.docs.map(async (conversation) => {
    const messagesSnapshot = await getDocs(collection(db, 'users', uid, 'conversations', conversation.id, 'messages'));
    return {
      ...(removeSecrets(conversation.data()) as Record<string, unknown>),
      id: conversation.id,
      messages: messagesSnapshot.docs.map((message) => ({
        id: message.id,
        ...(removeSecrets(message.data()) as Record<string, unknown>),
      })),
    };
  }));

  return {
    generatedAt: new Date().toISOString(),
    profile: profileSnapshot.exists() ? removeSecrets(profileSnapshot.data()) : null,
    workspace: workspaceSnapshot.exists() ? removeSecrets(workspaceSnapshot.data()) : null,
    conversations,
    memories: removeSecrets(memories),
  };
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
