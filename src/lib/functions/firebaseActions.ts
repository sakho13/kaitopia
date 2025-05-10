import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { getFirebaseClientAuth } from "./firebaseClient"

export const handleRegisterByFirebase = async (
  email: string,
  password: string,
) => {
  const auth = getFirebaseClientAuth()
  if (!auth) throw new Error("Firebase auth is not initialized")
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const handleLoginByFirebase = async (
  email: string,
  password: string,
) => {
  const auth = getFirebaseClientAuth()
  if (!auth) throw new Error("Firebase auth is not initialized")
  return await signInWithEmailAndPassword(auth, email, password)
}

export const handleGuestLoginByFirebase = async () => {
  const auth = getFirebaseClientAuth()
  if (!auth) throw new Error("Firebase auth is not initialized")
  return await signInAnonymously(auth)
}

export const handleGoogleLoginByFirebase = async () => {
  const auth = getFirebaseClientAuth()
  if (!auth) throw new Error("Firebase auth is not initialized")
  const provider = new GoogleAuthProvider()
  provider.addScope("profile")
  provider.addScope("email")
  return await signInWithPopup(auth, provider)
}

export const handleLogoutByFirebase = async () => {
  const auth = getFirebaseClientAuth()
  if (!auth) throw new Error("Firebase auth is not initialized")
  return await auth.signOut()
}
