import { updateProfile } from '@react-native-firebase/auth';
import {
  doc,
  DocumentData,
  FirestoreError,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import { auth, db } from './client';
import { UserProfile } from '../../types';

export const userDocRef = (uid: string) => doc(db, 'users', uid);

function toUserProfile(uid: string, data: DocumentData): UserProfile {
  const totals = data.totals ?? {};
  return {
    uid,
    username: typeof data.username === 'string' ? data.username : '',
    email: typeof data.email === 'string' ? data.email : '',
    totals: {
      incomeMinor: typeof totals.incomeMinor === 'number' ? totals.incomeMinor : 0,
      expenseMinor: typeof totals.expenseMinor === 'number' ? totals.expenseMinor : 0,
    },
  };
}

// Creates (or completes) users/{uid}. Uses merge so it never wipes totals.
export async function createUserProfile(
  uid: string,
  username: string,
  email: string,
  isNewDocument: boolean,
) {
  await setDoc(
    userDocRef(uid),
    {
      username,
      email,
      updatedAt: serverTimestamp(),
      ...(isNewDocument
        ? { createdAt: serverTimestamp(), totals: { incomeMinor: 0, expenseMinor: 0 } }
        : {}),
    },
    { merge: true },
  );
}

// Real-time listener for the profile. `profile` is null when the document
// does not exist yet (e.g. right after sign up, before the write lands).
export function subscribeToUserProfile(
  uid: string,
  onData: (profile: UserProfile | null, fromCache: boolean) => void,
  onError: (error: FirestoreError) => void,
) {
  return onSnapshot(
    userDocRef(uid),
    snapshot => {
      const data = snapshot.data();
      onData(data ? toUserProfile(uid, data) : null, snapshot.metadata.fromCache);
    },
    onError,
  );
}

export async function updateUsername(uid: string, username: string) {
  const trimmed = username.trim();
  await Promise.all([
    updateDoc(userDocRef(uid), { username: trimmed, updatedAt: serverTimestamp() }),
    auth.currentUser
      ? updateProfile(auth.currentUser, { displayName: trimmed })
      : Promise.resolve(),
  ]);
}
