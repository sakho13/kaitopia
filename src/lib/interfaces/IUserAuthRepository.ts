import { UserEntity } from "@/lib/classes/entities/UserEntity"
import {
  AuthProviderCreateData,
  ProviderTypeType,
} from "@/lib/types/base/authProviderTypes"
import { AuthProviderEntity } from "../classes/entities/AuthProviderEntity"
import { IAuthProvider } from "./IAuthProvider"

/**
 * 認証プロバイダデータ
 */
export type AuthProviderData = AuthProviderCreateData

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
  createAuthProvider(
    user: UserEntity,
    data: IAuthProvider,
  ): Promise<AuthProviderEntity>

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
