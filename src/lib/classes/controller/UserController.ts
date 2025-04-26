import {
  UserAccessSchoolMethod,
  UserBaseInfo,
  UserRoleType,
} from "@/lib/types/base/userTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ControllerBase } from "../common/ControllerBase"
import { SchoolRepository } from "../repositories/SchoolRepository"
import { UserRepository } from "../repositories/UserRepository"

export class UserController extends ControllerBase {
  private _userId: string | null = null
  private _userRole: UserRoleType | null = null

  public async getUserInfo(firebaseUid: string) {
    const user = await this._fetchUserInfoByFirebaseUid(firebaseUid)
    if (!user) return null

    this._userId = user.id
    this._userRole = user.role
    return user
  }

  public async registerUserInfo(
    firebaseUid: string,
    isGuest: boolean,
    data: UserBaseInfo,
  ) {
    const userRepository = new UserRepository(this.dbConnection)
    return await userRepository.createUserByFirebaseUid(firebaseUid, isGuest, {
      ...data,
      birthDayDate: null,
    })
  }

  public async accessSchoolMethod(
    schoolId: string,
  ): Promise<UserAccessSchoolMethod[]> {
    if (this._userRole === "ADMIN") return ["edit", "read", "publish", "delete"]

    const ownSchools = await this.getOwnSchools()
    const memberSchools = await this.getMemberSchools()
    if (ownSchools.length < 0 || memberSchools.length < 0) return []

    if (this._userRole === "USER") {
      const selfSchool = ownSchools.find(
        (s) => s.id === schoolId && s.isSelfSchool,
      )
      if (selfSchool) return ["read"]

      const hasAccess = memberSchools.some((s) => s.id === schoolId)
      if (hasAccess) return ["read"]

      return []
    }

    if (this._userRole === "MODERATOR") {
      const hasAccess = ownSchools.some((s) => s.id === schoolId)
      return []
    }

    if (this._userRole === "TEACHER") {
      return []
    }

    return []
  }

  /**
   * 所有しているスクールを取得する
   * @returns
   */
  public async getOwnSchools() {
    if (!this._userId)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const schoolRepository = new SchoolRepository(this.dbConnection)

    return await schoolRepository.findOwnSchools(this._userId)
  }

  /**
   * メンバーのスクールを取得する
   * @returns
   */
  public async getMemberSchools() {
    if (!this._userId)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const schoolRepository = new SchoolRepository(this.dbConnection)

    return await schoolRepository.findMemberSchools(this._userId)
  }

  private async _fetchUserInfoByFirebaseUid(firebaseUid: string) {
    const userRepository = new UserRepository(this.dbConnection)
    return await userRepository.findUserByFirebaseUid(firebaseUid)
  }

  public get userId() {
    return this._userId
  }

  public get canAccessManagePage() {
    return (
      this._userRole === "ADMIN" ||
      this._userRole === "TEACHER" ||
      this._userRole === "MODERATOR"
    )
  }

  public get isAdmin() {
    return this._userRole === "ADMIN"
  }
}
