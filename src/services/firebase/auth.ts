import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const auth = getAuth(getApp());
const db = getFirestore(getApp());

///////////sign up
export const signUp = async (email: string, password: string, username: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, 'users', uid), {
    username,
    email,
    wallet: { balance: 0 },
    createdAt: serverTimestamp(),
  });

  await updateProfile(userCredential.user, { displayName: username });
  return userCredential;
};

/////////sign in 
export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/////////////logout 
export const signOutUser = async () => {
  return signOut(auth);
};