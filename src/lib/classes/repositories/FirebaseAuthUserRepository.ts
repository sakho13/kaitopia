import { FirebaseAuthError } from "firebase-admin/auth"
import { firebaseAuth } from "@/lib/functions/firebaseAdmin"
import { IExternalAuthenticationRepository } from "@/lib/interfaces/IExternalAuthenticationRepository"
import { ApiV1Error } from "../common/ApiV1Error"

export class FirebaseAuthUserRepository
  implements IExternalAuthenticationRepository
{
  async verifyIdToken(idToken: string): Promise<{
    uid: string
    isGuest: boolean
    email: string | null
    phoneNumber: string | null
  }> {
    try {
      const result = await firebaseAuth().verifyIdToken(idToken)

      return {
        uid: result.uid,
        isGuest: result.firebase.sign_in_provider === "anonymous",
        email: result.email ?? null,
        phoneNumber: result.phone_number ?? null,
      }
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        if (error.code === "auth/id-token-expired")
          throw new ApiV1Error([{ key: "TokenExpiredError", params: null }])
      }
      console.error("Error verifying ID token:", error)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    }
  }

  async deleteUsers(ids: string[]) {
    const result = await firebaseAuth().deleteUsers(ids)
    return {
      successCount: result.successCount,
      errors: result.errors.map(({ index, error }) => ({
        index,
        code: error.code,
        message: error.message,
      })),
    }
  }
}
