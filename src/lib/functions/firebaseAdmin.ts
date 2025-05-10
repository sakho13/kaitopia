import { cert, getApp, getApps, initializeApp } from "firebase-admin/app"
import { DecodedIdToken, FirebaseAuthError, getAuth } from "firebase-admin/auth"
import { ApiV1Error } from "../classes/common/ApiV1Error"

function getFirebaseApp() {
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"
  if (useEmulator) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
    process.env.GCLOUD_PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  }

  if (!getApps().length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (useEmulator) {
      initializeApp({
        projectId,
      })
    } else {
      const pk = process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      )
      initializeApp({
        credential: cert({
          projectId,
          clientEmail: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
          privateKey: pk,
        }),
      })
    }
  }
  return getApp()
}

const firebaseAuth = () => getAuth(getFirebaseApp())

export async function verifyIdToken(idToken: string) {
  try {
    return await firebaseAuth().verifyIdToken(idToken)
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      if (error.code === "auth/id-token-expired")
        throw new ApiV1Error([{ key: "TokenExpiredError", params: null }])
    }
    console.error("Error verifying ID token:", error)
    throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
  }
}

export async function isGuestUser(decodedToken: DecodedIdToken) {
  return decodedToken.firebase?.sign_in_provider === "anonymous"
}
