import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { logEvent } from "firebase/analytics"
import { getFirebaseClientAuth } from "./firebaseClient"
import { getFirebaseClientAnalytics } from "./firebaseClient"

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

// analytics

const EventMap = {
  emailLogin: "email_login",
  emailLoginError: "email_login_error",
  emailRegister: "email_register",
  emailRegisterError: "email_register_error",
  guestLogin: "guest_login",
  guestLoginError: "guest_login_error",
  googleLogin: "google_login",
  googleLoginError: "google_login_error",
  logout: "logout",
  logoutError: "logout_error",

  exerciseStart: "exercise_start",
  exerciseStartError: "exercise_start_error",
  exerciseAnswer: "exercise_answer",
  exerciseAnswerError: "exercise_answer_error",
  exerciseEnd: "exercise_end",
}

export const sendAnalyticsEvent = (
  eventName: keyof typeof EventMap,
  eventParams: Record<string, unknown>,
) => {
  const analytics = getFirebaseClientAnalytics()
  if (!analytics) return
  logEvent(analytics, EventMap[eventName], eventParams)
}
