import { FirebaseAuthError } from "firebase-admin/auth"
import { firebaseAuth } from "@/lib/functions/firebaseAdmin"
import { IExternalAuthenticationRepository } from "@/lib/interfaces/IExternalAuthenticationRepository"
import { ApiV1Error } from "../common/ApiV1Error"
import { FirebaseAuthProvider } from "../common/AuthProviders"
import { IAuthProvider } from "@/lib/interfaces/IAuthProvider"

export class FirebaseAuthUserRepository
  implements IExternalAuthenticationRepository
{
  async verifyIdTokenV2(idToken: string): Promise<IAuthProvider> {
    try {
      const result = await firebaseAuth().verifyIdToken(idToken)

      return new FirebaseAuthProvider(result)
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
