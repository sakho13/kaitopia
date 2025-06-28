export interface IExternalAuthenticationRepository {
  deleteUsers(ids: string[]): Promise<{
    successCount: number
    errors: {
      index: number
      code: string
      message: string
    }[]
  }>
}
