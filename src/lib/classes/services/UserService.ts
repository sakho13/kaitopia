import { UserRoleType } from "@/lib/types/base/userTypes"
import { UserRepository } from "../repositories/UserRepository"

export class UserService {
  private _userId: string | null = null
  private _userRole: UserRoleType | null = null

  constructor(private userRepository: UserRepository) {}

  public static getInstance(
    ...args: ConstructorParameters<typeof UserRepository>
  ): UserService {
    return new UserService(new UserRepository(...args))
  }

  public async getUserInfo(firebaseUid: string) {
    const user = await this.userRepository.findUserByFirebaseUid(firebaseUid)
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
