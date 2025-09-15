import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import {
  AuthProvider,
  ProviderTypeType,
} from "@/lib/types/base/authProviderTypes"
import { DateUtility } from "../common/DateUtility"

/**
 * 認証プロバイダエンティティ
 */
export class AuthProviderEntity extends EntityMutable<AuthProvider> {
  constructor(value: AuthProvider) {
    super(value)
  }

  /**
   * バリデーション
   */
  public validate(): void {
    if (!this.value.userId) {
      throw new Error("UserIDが必要です")
    }

    if (!this.value.externalId) {
      throw new Error("外部IDが必要です")
    }

    if (!this.value.providerType) {
      throw new Error("認証プロバイダタイプが必要です")
    }
  }

  /**
   * 認証プロバイダを非アクティブ化
   */
  public deactivate(): void {
    this.value.isActive = false
    this.value.updatedAt = DateUtility.getNowDate()
  }

  /**
   * 認証プロバイダを再アクティブ化
   */
  public activate(): void {
    this.value.isActive = true
    this.value.updatedAt = DateUtility.getNowDate()
  }

  // Getters
  get authProviderId(): string {
    return this.value.id
  }

  get userId(): string {
    return this.value.userId
  }

  get providerType(): ProviderTypeType {
    return this.value.providerType
  }

  get externalId(): string {
    return this.value.externalId
  }

  get metadata(): unknown {
    return this.value.metadata
  }

  get isActive(): boolean {
    return this.value.isActive
  }

  get createdAt(): Date {
    return this.value.createdAt
  }

  get updatedAt(): Date {
    return this.value.updatedAt
  }

  /**
   * Firebase Guest認証かどうか
   */
  get isFirebaseGuest(): boolean {
    return this.value.providerType === "FIREBASE_GUEST"
  }

  /**
   * Firebase Email認証かどうか
   */
  get isFirebaseEmail(): boolean {
    return this.value.providerType === "FIREBASE_EMAIL"
  }

  /**
   * Firebase Google認証かどうか
   */
  get isFirebaseGoogle(): boolean {
    return this.value.providerType === "FIREBASE_GOOGLE"
  }
}
