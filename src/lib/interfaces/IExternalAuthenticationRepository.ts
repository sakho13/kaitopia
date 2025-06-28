export interface IExternalAuthenticationRepository {
  verifyIdToken(
    idToken: string,
  ): Promise<{
    uid: string
    isGuest: boolean
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
