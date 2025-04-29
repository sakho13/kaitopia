import { cert, getApps, initializeApp } from "firebase-admin/app"
import { DecodedIdToken, getAuth } from "firebase-admin/auth"
import { ApiV1Error } from "../classes/common/ApiV1Error"

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

export async function verifyIdToken(idToken: string) {
  try {
    return await getAuth().verifyIdToken(idToken)
  } catch (error) {
    console.error("Error verifying ID token:", error)
    throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
  }
}

export async function isGuestUser(decodedToken: DecodedIdToken) {
  return decodedToken.firebase?.sign_in_provider === "anonymous"
}
