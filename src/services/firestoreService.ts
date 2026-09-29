import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      subscriptionPeriod: 'monthly',
      jobTitle: 'Kurucu & Baş Yazılım Mimarı',
      company: '',
      location: '',
      hobbies: [],
      lifeMission: '',
      createdAt: new Date().toISOString(),
      onboardingCompleted: true,
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (err) {
    console.warn('Firestore profile fallback triggered:', err);
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Yeni kullanıcı',
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      subscriptionPeriod: 'monthly',
      jobTitle: 'Kurucu & Baş Yazılım Mimarı',
      company: '',
      location: '',
      hobbies: [],
      lifeMission: '',
      createdAt: new Date().toISOString(),
      onboardingCompleted: true,
    };
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

// Update profile tier on checkout
export async function updateUserSubscription(
  uid: string,
  tier: 'starter' | 'pro' | 'enterprise',
  period: 'monthly' | 'yearly',
  cardLast4?: string
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      subscriptionTier: tier,
      subscriptionStatus: 'active',
      subscriptionPeriod: period,
      cardLast4: cardLast4 || '4242',
      cardBrand: 'Visa Signature',
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore subscription update fallback:', err);
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
