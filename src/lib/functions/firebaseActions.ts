import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { firebaseAuthClient } from "./firebaseClient"

export const handleLoginByFirebase = async (
  email: string,
  password: string,
) => {
  return await signInWithEmailAndPassword(firebaseAuthClient, email, password)
}

export const handleGuestLoginByFirebase = async () => {
  return await signInAnonymously(firebaseAuthClient)
}

export const handleGoogleLoginByFirebase = async () => {
  const provider = new GoogleAuthProvider()
  provider.addScope("profile")
  provider.addScope("email")
  return await signInWithPopup(firebaseAuthClient, provider)
}

export const handleLogoutByFirebase = async () => {
  return await firebaseAuthClient.signOut()
}
