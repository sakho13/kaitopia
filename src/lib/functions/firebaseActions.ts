import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth"
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

export const handleLogoutByFirebase = async () => {
  return await firebaseAuthClient.signOut()
}
