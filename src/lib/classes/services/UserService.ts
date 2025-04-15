import { UserRoleType } from "@/lib/types/base/userTypes"
import { UserRepository } from "../repositories/UserRepository"

export class UserService {
  private _userRepository: UserRepository | null = null

  private _userId: string | null = null
  private _userRole: UserRoleType | null = null

  constructor() {}

  public resetUserRepository(
    ...args: ConstructorParameters<typeof UserRepository>
  ) {
    this._userRepository = new UserRepository(...args)
  }

  public async getUserInfo(firebaseUid: string) {
    if (!this._userRepository) throw new Error("UserRepository is not set")

    const user = await this._userRepository.findUserByFirebaseUid(firebaseUid)
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
