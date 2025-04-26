import {
  UserAccessSchoolMethod,
  UserBaseInfo,
  UserRoleType,
} from "@/lib/types/base/userTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ControllerBase } from "../common/ControllerBase"
import { SchoolRepository } from "../repositories/SchoolRepository"
import { UserRepository } from "../repositories/UserRepository"
import { DateUtility } from "../common/DateUtility"

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
    const AllAccess: UserAccessSchoolMethod[] = [
      "read",
      "edit",
      "create",
      "publish",
      "delete",
    ]

    if (this._userRole === "ADMIN") return AllAccess

    const ownSchools = await this.getOwnSchools()
    const memberSchools = await this.getMemberSchools()
    if (ownSchools.length < 0 || memberSchools.length < 0) return []

    // セルフスクールならば全ての権限を付与する
    const selfSchool = ownSchools.find(
      (s) => s.id === schoolId && s.isSelfSchool,
    )
    if (selfSchool?.isSelfSchool) return AllAccess

    // グローバルスクールならばReadのみ付与する
    const globalSchools = memberSchools.find(
      (s) => s.id === schoolId && s.isGlobal && s.isPublic,
    )
    if (globalSchools) return ["read"]

    if (this._userRole === "USER") {
      // スクールのメンバーならばReadのみ付与する
      const isInMember = memberSchools.find(
        (s) =>
          s.id === schoolId &&
          s.members.some(
            (m) => m.limitAt === null || m.limitAt >= DateUtility.getNowDate(),
          ),
      )
      if (isInMember) return ["read"]

      return []
    }

    // if (this._userRole === "MODERATOR") {
    //   const hasAccess = ownSchools.some((s) => s.id === schoolId)
    //   return []
    // }

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
   * メンバーのスクールとグローバルのスクールを取得する
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
