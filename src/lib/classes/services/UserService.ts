import { UserRoleType } from "@/lib/types/base/userTypes"
import { UserRepository } from "../repositories/UserRepository"

export class UserService {
  private static instance: UserService | null = null

  private _userId: string | null = null
  private _userRole: UserRoleType | null = null

  private constructor(private userRepository: UserRepository) {}

  public static getInstance(
    ...args: ConstructorParameters<typeof UserRepository>
  ): UserService {
    if (this.instance === null) {
      this.instance = new UserService(new UserRepository(...args))
    }
    return this.instance
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

  public get isAdmin() {
    return this._userRole === "ADMIN"
  }
}
