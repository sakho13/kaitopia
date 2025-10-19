/**
 * 認証プロバイダタイプ
 */
export const ProviderTypeMap = {
  FIREBASE_GUEST: "FIREBASE_GUEST",
  FIREBASE_EMAIL: "FIREBASE_EMAIL",
  FIREBASE_GOOGLE: "FIREBASE_GOOGLE",
} as const

export type ProviderTypeType = (typeof ProviderTypeMap)[keyof typeof ProviderTypeMap]

/**
 * 認証プロバイダの基本情報
 */
export type AuthProviderBase = {
  id: string
  userId: string
  providerType: ProviderTypeType
  externalId: string
  metadata: unknown
  isActive: boolean
}

/**
 * 認証プロバイダの日時情報
 */
export type AuthProviderBaseDate = {
  createdAt: Date
  updatedAt: Date
}

/**
 * 認証プロバイダの作成用データ
 */
export type AuthProviderCreateData = {
  userId: string
  providerType: ProviderTypeType
  externalId: string
  metadata?: unknown
  isActive?: boolean
}

/**
 * 完全な認証プロバイダ情報
 */
export type AuthProvider = AuthProviderBase & AuthProviderBaseDate