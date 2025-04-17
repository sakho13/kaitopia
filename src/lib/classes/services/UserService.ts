import { UserRoleType } from "@/lib/types/base/userTypes"
import { UserRepository } from "../repositories/UserRepository"
import { SchoolRepository } from "../repositories/SchoolRepository"
import { ServiceBase } from "../common/ServiceBase"
import { ApiV1Error } from "../common/ApiV1Error"

export class UserService extends ServiceBase {
  private _userId: string | null = null
  private _userRole: UserRoleType | null = null

  public async getUserInfo(firebaseUid: string) {
    const userRepository = new UserRepository(this.dbConnection)

    const user = await userRepository.findUserByFirebaseUid(firebaseUid)
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    this._userId = user.id
    this._userRole = user.role
    return user
  }

  public async getOwnSchools() {
    if (!this._userId)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const schoolRepository = new SchoolRepository(this.dbConnection)

    const ownSchools = await schoolRepository.findOwnSchools(this._userId)

    return ownSchools
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
