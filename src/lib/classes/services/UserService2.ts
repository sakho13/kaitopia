import { prisma } from "@/lib/prisma"
import { ISchoolRepository } from "@/lib/interfaces/ISchoolRepository"
import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import { EditableUserInfo, UserBaseInfo } from "@/lib/types/base/userTypes"
import { PrismaUserRepository } from "../repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "../repositories/PrismaSchoolRepository"
import { UserEntity } from "../entities/UserEntity"
import { ReplacedDateToString } from "@/lib/types/common/ReplacedDateToString"
import { PrismaUserHistoryRepository } from "../repositories/PrismaUserHistoryRepository"
import { UserHistoryEntity } from "../entities/UserHistoryEntity"

export class UserService2 {
  constructor(
    private readonly _dbConnection: typeof prisma,
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
   * ユーザを退会させる
   * @param user
   * @param quitProperty
   * @returns 削除日時
   */
  public async quitUser(user: UserEntity, quitProperty: { reason: string }) {
    if (user.isDeleted) {
      const userHistoryRepository = new PrismaUserHistoryRepository(
        this._dbConnection,
      )
      const quitHistory = await userHistoryRepository.getLatestQuitHistory(
        user.userId,
      )

      if (quitHistory) {
        return {
          deletedAt: user.value.deletedAt!,
          quitCode: quitHistory.quitProperty.quitCode,
        }
      }
    }

    return await this._dbConnection.$transaction(async (t) => {
      const userRepository = new PrismaUserRepository(t)
      const deletedUser = await userRepository.delete(user)

      const userHistoryRepository = new PrismaUserHistoryRepository(t)

      const quitHistory = new UserHistoryEntity({
        userId: deletedUser.userId,
        actionType: "QUIT",
        quitCode: null, // 退会コードは自動生成されるためnullを指定
        quitReason: quitProperty.reason,
        historyNo: 0, // historyNoは自動生成されるため0を指定
      })

      await userHistoryRepository.addUserHistory(quitHistory)

      return {
        deletedAt: deletedUser.value.deletedAt!,
        quitCode: quitHistory.quitProperty.quitCode,
      }
    })
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
