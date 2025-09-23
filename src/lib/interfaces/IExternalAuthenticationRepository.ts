import { IAuthProvider } from "./IAuthProvider"

export interface IExternalAuthenticationRepository {
  verifyIdTokenV2(idToken: string): Promise<IAuthProvider>

  deleteUsers(ids: string[]): Promise<{
    successCount: number
    errors: {
      index: number
      code: string
      message: string
    }[]
  }>
}
