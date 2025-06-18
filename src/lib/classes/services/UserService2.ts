import { ISchoolRepository } from "@/lib/interfaces/ISchoolRepository"
import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import {
  UserAccessSchoolMethod,
  UserBaseInfo,
} from "@/lib/types/base/userTypes"
import { PrismaClient } from "@prisma/client"
import { PrismaUserRepository } from "../repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "../repositories/PrismaSchoolRepository"
import { UserEntity } from "../entities/UserEntity"

export class UserService2 {
  constructor(
    private readonly _dbConnection: PrismaClient,
    private readonly _userRepository: IUserRepository,
    private readonly _schoolRepository: ISchoolRepository,
  ) {}

  public async getUserInfo(firebaseUid: string) {
    return await this._userRepository.findByFirebaseUid(firebaseUid)
  }

  public async registerUserInfo(
    firebaseUid: string,
    isGuest: boolean,
    data: UserBaseInfo,
  ) {
    return this._dbConnection.$transaction(async (t) => {
      const userRepository = new PrismaUserRepository(t)
      const schoolRepository = new PrismaSchoolRepository(t)
      const newUser = new UserEntity({
        firebaseUid,
        id: "", // IDは自動生成されるため空文字
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        birthDayDate: null, // 初期値はnull
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isGuest,
      })
      const user = await userRepository.create(newUser)
      await schoolRepository.createSelfSchool(user)
      return user
    })
  }

  /**
   * このユーザがこのスクールで持つ権限を取得する
   * @returns UserAccessSchoolMethod[]
   */
  public async accessSchoolMethod(
    user: UserEntity,
    schoolId: string,
  ): Promise<UserAccessSchoolMethod[]> {
    const AllAccess: UserAccessSchoolMethod[] = [
      "read",
      "edit",
      "create",
      "publish",
      "delete",
    ]

    if (user.userRole === "ADMIN") return AllAccess

    const ownSchools = await this.getOwnSchools(user.userId)
    const memberSchools = await this.getMemberSchools(user.userId)
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

    if (user.userRole === "USER") {
      // スクールのメンバーならばReadのみ付与する
      const isInLimit = memberSchools.find(
        (s) => s.schoolId === schoolId && s.isInLimit,
      )
      if (isInLimit) return ["read"]
    }

    if (user.userRole === "TEACHER") {
      return []
    }

    return []
  }

  /**
   * ユーザがアクセス可能なスクールを取得する
   */
  public async getAccessibleSchools(userId: string) {
    return await this.getOwnSchools(userId)
  }

  public async getOwnSchools(userId: string) {
    return await this._schoolRepository.findOwnSchools(userId)
  }

  public async getMemberSchools(userId: string) {
    return await this._schoolRepository.findMemberSchools(userId)
  }
}
