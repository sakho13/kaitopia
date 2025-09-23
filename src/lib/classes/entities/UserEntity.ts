import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import { STATICS } from "@/lib/statics"
import {
  UserAccessSchoolMethod,
  UserBaseDate,
  UserBaseIdentity,
  UserBaseInfo,
  UserBaseInfoOption,
  UserRoleType,
} from "@/lib/types/base/userTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import {
  SchoolBase,
  SchoolBaseDate,
  SchoolBaseIdentity,
} from "@/lib/types/base/schoolTypes"
import { SchoolEntity } from "./SchoolEntity"
import { AuthProviderEntity } from "./AuthProviderEntity"
import {
  AuthProvider,
  ProviderTypeType,
} from "@/lib/types/base/authProviderTypes"
import { DateUtility } from "../common/DateUtility"

type UserEntityType = UserBaseIdentity &
  UserBaseInfo &
  UserBaseInfoOption &
  UserBaseDate & {
    memberSchools: (SchoolBase & SchoolBaseIdentity & SchoolBaseDate)[]
    ownerSchools: (SchoolBase & SchoolBaseIdentity & SchoolBaseDate)[]
    authProviders?: AuthProvider[]
  }

export class UserEntity extends EntityMutable<UserEntityType> {
  constructor(value: UserEntityType) {
    super(value)
  }

  public validate() {
    if (
      this.value.name.length < STATICS.VALIDATE.NAME.MIN_LENGTH ||
      this.value.name.length > STATICS.VALIDATE.NAME.MAX_LENGTH
    ) {
      throw new ApiV1Error([
        {
          key: "InvalidFormatError",
          params: { key: "名前" },
          columnName: "name",
        },
      ])
    }
  }

  public reRegister() {
    this.value.deletedAt = null
  }

  public static createNew(
    property: Partial<
      UserBaseInfo & UserBaseInfoOption & { firebaseUid: string }
    >,
  ): UserEntity {
    return new UserEntity({
      ...property,
      id: "", // IDは自動生成されるため空文字
      name: this._defaultUserName(),
      role: "USER",
      createdAt: DateUtility.getNowDate(),
      updatedAt: DateUtility.getNowDate(),
      memberSchools: [],
      ownerSchools: [],
      authProviders: [],
      birthDayDate: null,
      deletedAt: null,
      email: null,
      phoneNumber: null,
    })
  }

  /**
   * このユーザがこのスクールで持つ権限を取得する
   * @param schoolId
   * @returns UserAccessSchoolMethod[]
   */
  public checkAccessSchoolMethod(schoolId: string): UserAccessSchoolMethod[] {
    const AllAccess: UserAccessSchoolMethod[] = [
      "read",
      "edit",
      "create",
      "publish",
      "delete",
    ]

    if (this.userRole === "ADMIN") return AllAccess

    const ownSchools = this.ownSchools
    const memberSchools = this.memberSchools
    if (ownSchools.length < 0) return []

    // セルフスクールならば全ての権限を付与する
    const selfSchool = ownSchools.find(
      (s) => s.schoolId === schoolId && s.isSelfSchool,
    )
    if (selfSchool?.isSelfSchool) return AllAccess

    // グローバルスクールならばReadのみ付与する
    const globalSchools = memberSchools.find(
      (s) => s.schoolId === schoolId && s.isGlobalSchool,
    )
    if (globalSchools) return ["read"]

    if (this.userRole === "USER") {
      // スクールのメンバーならばReadのみ付与する
      const isInMember = memberSchools.find(
        (s) => s.schoolId === schoolId,
        // &&
        // s.members.some(
        //   (m) =>
        //     m.limitAt === null || m.limitAt >= DateUtility.getNowDate(),
        // ),
      )
      if (isInMember) return ["read"]

      return []
    }

    if (this.userRole === "MODERATOR") {
      return []
    }

    if (this.userRole === "TEACHER") {
      return []
    }

    return []
  }

  private static _defaultUserName() {
    return `user-${Math.floor(Math.random() * 10000)}`
  }

  get userId(): string {
    return this.value.id
  }

  get username(): string {
    return this.value.name
  }

  get birthDayString(): string | null {
    return this.value.birthDayDate
      ? this.value.birthDayDate.toISOString()
      : null
  }

  get userRole(): UserRoleType {
    return this.value.role
  }

  get schools(): SchoolEntity[] {
    return [...this.ownSchools, ...this.memberSchools]
  }

  get ownSchools() {
    return this.value.ownerSchools.map((s) => new SchoolEntity(s))
  }

  get memberSchools() {
    return this.value.memberSchools.map((s) => new SchoolEntity(s))
  }

  public get canAccessManagePage(): boolean {
    return (
      this.isAdmin ||
      this.userRole === "TEACHER" ||
      this.userRole === "MODERATOR"
    )
  }

  public get isAdmin(): boolean {
    return this.userRole === "ADMIN"
  }

  public get isDeleted(): boolean {
    return this.value.deletedAt !== null
  }

  // 認証プロバイダ関連のメソッド

  /**
   * 認証プロバイダのリストを取得
   */
  get authProviders(): AuthProviderEntity[] {
    return (this.value.authProviders || []).map(
      (provider) => new AuthProviderEntity(provider),
    )
  }

  /**
   * アクティブな認証プロバイダのリストを取得
   */
  get activeAuthProviders(): AuthProviderEntity[] {
    return this.authProviders.filter((provider) => provider.isActive)
  }

  /**
   * 特定の認証プロバイダタイプを持っているかチェック
   */
  public hasAuthProvider(providerType: ProviderTypeType): boolean {
    return this.activeAuthProviders.some(
      (provider) => provider.providerType === providerType,
    )
  }

  /**
   * 特定の認証プロバイダタイプのアクティブなプロバイダを取得
   */
  public getAuthProvider(
    providerType: ProviderTypeType,
  ): AuthProviderEntity | null {
    return (
      this.activeAuthProviders.find(
        (provider) => provider.providerType === providerType,
      ) || null
    )
  }

  /**
   * Firebase Guest認証を持っているかチェック
   */
  get hasFirebaseGuest(): boolean {
    return this.hasAuthProvider("FIREBASE_GUEST")
  }

  /**
   * Firebase Email認証を持っているかチェック
   */
  get hasFirebaseEmail(): boolean {
    return this.hasAuthProvider("FIREBASE_EMAIL")
  }

  /**
   * Firebase Google認証を持っているかチェック
   */
  get hasFirebaseGoogle(): boolean {
    return this.hasAuthProvider("FIREBASE_GOOGLE")
  }

  /**
   * プライマリ認証プロバイダを取得
   * 優先度: FIREBASE_EMAIL > FIREBASE_GOOGLE > FIREBASE_GUEST
   */
  get primaryAuthProvider(): AuthProviderEntity | null {
    const activeProviders = this.activeAuthProviders

    // FIREBASE_EMAIL が最優先
    const emailProvider = activeProviders.find((p) => p.isFirebaseEmail)
    if (emailProvider) return emailProvider

    // 次に FIREBASE_GOOGLE
    const googleProvider = activeProviders.find((p) => p.isFirebaseGoogle)
    if (googleProvider) return googleProvider

    // 最後に FIREBASE_GUEST
    const guestProvider = activeProviders.find((p) => p.isFirebaseGuest)
    if (guestProvider) return guestProvider

    return null
  }

  /**
   * 現在のゲスト状態を認証プロバイダから判断
   * 新しい認証システムでは、Firebase Guest認証のみを持つユーザーがゲスト
   */
  get isGuestByAuthProvider(): boolean {
    const activeProviders = this.activeAuthProviders
    return (
      activeProviders.length === 1 &&
      activeProviders[0].providerType === "FIREBASE_GUEST"
    )
  }
}
