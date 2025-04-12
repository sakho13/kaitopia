import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      ),
    }),
  })
}

export async function verifyIdToken(idToken: string) {
  try {
    return await getAuth().verifyIdToken(idToken)
  } catch (error) {
    console.error("Error verifying ID token:", error)
    throw new Error("Invalid ID token")
  }
}
