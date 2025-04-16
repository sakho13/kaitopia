import { UserRoleType } from "@/lib/types/base/userTypes"
import { UserRepository } from "../repositories/UserRepository"
import { ServiceBase } from "../common/ServiceBase"

export class UserService extends ServiceBase {
  private _userId: string | null = null
  private _userRole: UserRoleType | null = null

  public async getUserInfo(firebaseUid: string) {
    const userRepository = new UserRepository(this.dbConnection)

    const user = await userRepository.findUserByFirebaseUid(firebaseUid)
    if (user) {
      this._userId = user.id
      this._userRole = user.role
    }
    return user
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
