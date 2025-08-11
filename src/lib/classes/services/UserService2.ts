import { prisma } from "@/lib/prisma"
import { ISchoolRepository } from "@/lib/interfaces/ISchoolRepository"
import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import { EditableUserInfo } from "@/lib/types/base/userTypes"
import { PrismaUserRepository } from "../repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "../repositories/PrismaSchoolRepository"
import { UserEntity } from "../entities/UserEntity"
import { ReplacedDateToString } from "@/lib/types/common/ReplacedDateToString"
import { PrismaUserHistoryRepository } from "../repositories/PrismaUserHistoryRepository"
import { UserHistoryEntity } from "../entities/UserHistoryEntity"
import { ApiV1Error } from "../common/ApiV1Error"

export class UserService2 {
  constructor(
    private readonly _dbConnection: typeof prisma,
    private readonly _userRepository: IUserRepository,
    private readonly _schoolRepository: ISchoolRepository,
  ) {}

  public static createByPrisma(prismaClient: typeof prisma = prisma) {
    return new UserService2(
      prismaClient,
      new PrismaUserRepository(prismaClient),
      new PrismaSchoolRepository(prismaClient),
    )
  }

  public async getUserInfo(firebaseUid: string) {
    return await this._userRepository.findByFirebaseUid(firebaseUid)
  }

  public async registerUserInfo(userEntity: UserEntity) {
    return this._dbConnection.$transaction(async (t) => {
      const userRepository = new PrismaUserRepository(t)
      const schoolRepository = new PrismaSchoolRepository(t)

      const user = await userRepository.create(userEntity)
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
      throw new ApiV1Error([{ key: "DeletedUserError", params: null }])
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
        historyNo: "", // historyNoは自動生成されるため空文字を指定
      })

      await userHistoryRepository.addUserHistory(quitHistory)

      return {
        deletedAt: deletedUser.value.deletedAt!,
        quitCode: quitHistory.quitProperty.quitCode,
      }
    })
  }

  /**
   * ユーザの復帰を行う
   * @param user
   * @param quitCode 退会時に生成された退会コード
   */
  public async reRegisterUser(
    user: UserEntity,
    quitCode: string,
  ): Promise<UserEntity> {
    return await this._dbConnection.$transaction(async (t) => {
      const userHistoryRepository = new PrismaUserHistoryRepository(t)
      const quitHistory = await userHistoryRepository.getLatestQuitHistory(
        user.userId,
      )
      if (!quitHistory) {
        throw new ApiV1Error([{ key: "DeletedUserError", params: null }])
      }

      if (quitHistory.quitProperty.quitCode !== quitCode) {
        throw new ApiV1Error([{ key: "DeletedUserError", params: null }])
      }

      const userRepository = new PrismaUserRepository(t)
      const reRegisteredUser = await userRepository.reRegister(user)

      // 復帰履歴の登録
      await userHistoryRepository.addUserHistory(
        new UserHistoryEntity({
          ...quitHistory.value,
          actionType: "RE_JOIN",
          quitReason: null, // 復帰時理由は不要
        }),
      )

      return reRegisteredUser
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
