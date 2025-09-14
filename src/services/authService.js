import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebaseClient';

export async function signUpWithEmail({ email, password, displayName }) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    try {
      await updateProfile(userCred.user, { displayName });
    } catch (e) {
      console.warn('update displayName failed', e);
    }
  }
  return userCred;
}

export async function signInWithEmail({ email, password }) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, googleProvider);
}

export async function signOut() {
  return await firebaseSignOut(auth);
}
