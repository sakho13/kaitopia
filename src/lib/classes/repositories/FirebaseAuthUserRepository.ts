import { firebaseAuth } from "@/lib/functions/firebaseAdmin"
import { IExternalAuthenticationRepository } from "@/lib/interfaces/IExternalAuthenticationRepository"

export class FirebaseAuthUserRepository
  implements IExternalAuthenticationRepository
{
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
