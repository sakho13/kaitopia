import { UserEntity } from "@/lib/classes/entities/UserEntity"
import {
  AuthProvider,
  AuthProviderCreateData,
  ProviderTypeType,
} from "@/lib/types/base/authProviderTypes"

/**
 * 認証プロバイダデータ
 */
export type AuthProviderData = AuthProviderCreateData

/**
 * 認証プロバイダエンティティ
 */
export type AuthProviderEntity = AuthProvider

/**
 * ユーザー認証リポジトリインターフェース
 */
export interface IUserAuthRepository {
  /**
   * 認証プロバイダタイプと外部IDでユーザーを検索
   */
  findUserByAuth(
    providerType: ProviderTypeType,
    externalId: string,
  ): Promise<UserEntity | null>

  /**
   * ユーザーIDでアクティブな認証プロバイダを取得
   */
  findActiveAuthProviders(userId: string): Promise<AuthProviderEntity[]>

  /**
   * 認証プロバイダを作成
   */
  createAuthProvider(data: AuthProviderData): Promise<AuthProviderEntity>

  /**
   * 認証プロバイダを非アクティブ化
   */
  deactivateAuthProvider(
    userId: string,
    providerType: ProviderTypeType,
  ): Promise<void>

  /**
   * 認証プロバイダを削除
   */
  deleteAuthProvider(id: string): Promise<void>

  /**
   * 特定の認証プロバイダが存在するかチェック
   */
  existsAuthProvider(
    providerType: ProviderTypeType,
    externalId: string,
  ): Promise<boolean>
}