import { AuthProviderType } from "@/lib/types/base/authProviderTypes"

export interface IExternalAuthenticationRepository {
  verifyIdToken(
    idToken: string,
  ): Promise<{
    providerUid: string
    providerType: AuthProviderType
    email: string | null
    phoneNumber: string | null
  }>

  deleteUsers(ids: string[]): Promise<{
    successCount: number
    errors: {
      index: number
      code: string
      message: string
    }[]
  }>
}
