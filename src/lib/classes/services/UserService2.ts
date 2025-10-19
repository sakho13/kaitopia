import { ISchoolRepository } from "@/lib/interfaces/ISchoolRepository"
import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import { EditableUserInfo, UserBaseInfo } from "@/lib/types/base/userTypes"
import { PrismaClient } from "@prisma/client"
import { PrismaUserRepository } from "../repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "../repositories/PrismaSchoolRepository"
import { UserEntity } from "../entities/UserEntity"
import { ReplacedDateToString } from "@/lib/types/common/ReplacedDateToString"

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
        memberSchools: [],
        ownerSchools: [],
      })
      const user = await userRepository.create(newUser)
      await schoolRepository.createSelfSchool(user)
      return user
    })
  }

  public async editUserInfo(
    beforeUser: UserEntity,
    data: Partial<ReplacedDateToString<EditableUserInfo>>,
  ) {
    const user = new UserEntity({
      ...beforeUser.value,
      name: data.name ?? beforeUser.value.name,
      birthDayDate: data.birthDayDate
        ? new Date(data.birthDayDate)
        : beforeUser.value.birthDayDate,
    })

    user.validate()

    return await this._userRepository.save(user)
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
