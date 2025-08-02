import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import { STATICS } from "@/lib/statics"
import {
  UserBaseDate,
  UserBaseIdentity,
  UserBaseInfo,
  UserBaseInfoOption,
  UserRoleType,
} from "@/lib/types/base/userTypes"
import {
  AuthProvider,
  AuthProviderType,
} from "@/lib/types/base/authProviderTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import {
  SchoolBase,
  SchoolBaseDate,
  SchoolBaseIdentity,
} from "@/lib/types/base/schoolTypes"
import { SchoolEntity } from "./SchoolEntity"

type UserEntityType = UserBaseIdentity &
  UserBaseInfo &
  UserBaseInfoOption &
  UserBaseDate & {
    authProviders: AuthProvider[]
    memberSchools: (SchoolBase & SchoolBaseIdentity & SchoolBaseDate)[]
    ownerSchools: (SchoolBase & SchoolBaseIdentity & SchoolBaseDate)[]
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

  get userId(): string {
    return this.value.id
  }

  get userRole(): UserRoleType {
    return this.value.role
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

  get authProviders(): AuthProvider[] {
    return this.value.authProviders
  }

  public getAuthProvider(providerType: AuthProviderType): AuthProvider | null {
    return (
      this.value.authProviders.find(
        (p) => p.providerType === providerType,
      ) ?? null
    )
  }

  public getAuthProviderUid(providerType: AuthProviderType): string | null {
    return this.getAuthProvider(providerType)?.providerUid ?? null
  }

  get isGuest(): boolean {
    return this.value.authProviders.some(
      (p) => p.providerType === "FIREBASE_GUEST",
    )
  }

  public get isDeleted(): boolean {
    return this.value.deletedAt !== null
  }
}
