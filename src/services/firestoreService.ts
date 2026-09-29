import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, MoodCheckin, TaskItem, DilemmaItem, WorkLifeBalance, ConnectedService, CoachGoal, ChatMessage } from '../types';

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

    if (snap.exists()) {
      return snap.data() as UserProfile;
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
      createdAt: new Date().toISOString(),
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

export async function loadConversationMessages(uid: string): Promise<ChatMessage[]> {
  const messagesRef = collection(db, 'users', uid, 'conversations', defaultConversationId, 'messages');
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

export async function saveConversationMessage(uid: string, message: ChatMessage): Promise<void> {
  const conversationRef = doc(db, 'users', uid, 'conversations', defaultConversationId);
  const messageRef = doc(conversationRef, 'messages', message.id);
  await setDoc(conversationRef, {
    id: defaultConversationId,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }, { merge: true });
  await setDoc(messageRef, {
    ...message,
    createdAt: new Date().toISOString(),
  });
}
