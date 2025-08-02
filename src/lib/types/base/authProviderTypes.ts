export const AuthProviderType = {
  FIREBASE_GUEST: "FIREBASE_GUEST",
  FIREBASE_EMAIL: "FIREBASE_EMAIL",
} as const

export type AuthProviderType = keyof typeof AuthProviderType

export type AuthProvider = {
  id: string
  userId: string
  providerType: AuthProviderType
  providerUid: string
  createdAt: Date
  updatedAt: Date
}
