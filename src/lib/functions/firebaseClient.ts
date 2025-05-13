// import { getAnalytics } from "firebase/analytics"
import { initializeApp, getApps } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"

let authInstance: ReturnType<typeof getAuth> | null = null

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"

export function getFirebaseClientAuth() {
  if (typeof window === "undefined" && !useEmulator) return null

  if (authInstance) return authInstance

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  }

  const apps = getApps()
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)
  const auth = getAuth(app)

  if (useEmulator) {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    })
  }
  authInstance = auth

  return authInstance
}

// export const firebaseAuthClient = auth
// export const analytics = getAnalytics(app)
