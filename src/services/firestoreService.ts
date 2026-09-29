import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, MoodCheckin, TaskItem, DilemmaItem, WorkLifeBalance, ConnectedService, CoachGoal } from '../types';

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
    console.warn('Firestore userData fetch fallback:', err);
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
    console.warn('Firestore saveUserData fallback:', err);
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
    console.warn('Firestore updateUserProfileDetails fallback:', err);
  }
}
