import { ProviderTypeType } from "../types/base/authProviderTypes"

export interface IAuthProvider {
  get externalId(): string
  get providerType(): ProviderTypeType
  get authProperty(): {
    email: string | null
    phoneNumber: string | null
  }
}
