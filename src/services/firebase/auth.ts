import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from '@react-native-firebase/auth';
import { auth } from './client';
import { createUserProfile } from './user';

///////////sign up
export const signUp = async (email: string, password: string, username: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const { uid } = userCredential.user;
  const name = username.trim();

  // The account already exists at this point and the app has switched to the
  // home screens, so a failure here must not be reported as a sign-up failure.
  // AppDataProvider re-creates a missing profile document on next load.
  try {
    await Promise.all([
      createUserProfile(uid, name, email.trim(), true),
      updateProfile(userCredential.user, { displayName: name }),
    ]);
  } catch (error) {
    console.warn('Profile setup after sign up failed', error);
  }
  return userCredential;
};

/////////sign in
export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email.trim(), password);
};

/////////////logout
export const signOutUser = async () => {
  return signOut(auth);
};

//////////reset password
export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email.trim());
};
