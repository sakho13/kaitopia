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
import { ProviderTypeType } from "@/lib/types/base/authProviderTypes"
import { PrismaUserAuthRepository } from "../repositories/PrismaUserAuthRepository"
import { AuthProviderEntity } from "../entities/AuthProviderEntity"
import { IAuthProvider } from "@/lib/interfaces/IAuthProvider"

export class UserService {
  constructor(
    private readonly _dbConnection: typeof prisma,
    private readonly _userRepository: IUserRepository,
    private readonly _schoolRepository: ISchoolRepository,
  ) {}

  public static createByPrisma(prismaClient: typeof prisma = prisma) {
    return new UserService(
      prismaClient,
      new PrismaUserRepository(prismaClient),
      new PrismaSchoolRepository(prismaClient),
    )
  }

  public async getUserInfo(firebaseUid: string) {
    return await this._userRepository.findByFirebaseUid(firebaseUid)
  }

  public async registerUserInfo(
    userEntity: UserEntity,
    authProvider: IAuthProvider,
  ): Promise<UserEntity> {
    return await this._dbConnection.$transaction(async (t) => {
      const userRepository = new PrismaUserRepository(t)
      const authProviderRepository = new PrismaUserAuthRepository(t)

      const user = await userRepository.create(userEntity)
      await authProviderRepository.createAuthProvider(user, authProvider)
      const newUser = await userRepository.findByFirebaseUid(
        authProvider.externalId,
      )
      return newUser!
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

  /**
   * ユーザーの認証プロバイダを追加
   * 例: ゲスト → メール、メール → Google
   */
  // public async addUserAuthProvider(
  //   userId: string,
  //   fromProviderType: ProviderTypeType,
  //   toProviderType: ProviderTypeType,
  //   newExternalId: string,
  //   metadata?: unknown,
  // ): Promise<{ deactivated: AuthProviderEntity; created: AuthProviderEntity }> {
  //   return await this._dbConnection.$transaction(async (t) => {
  //     const userAuthRepository = new PrismaUserAuthRepository(t)

  //     // アップグレード可能な組み合わせをチェック
  //     this.validateUpgradePath(fromProviderType, toProviderType)

  //     const existingProviders =
  //       await userAuthRepository.findActiveAuthProviders(userId)
  //     const fromProvider = existingProviders.find(
  //       (provider) =>
  //         provider.providerType === fromProviderType && provider.isActive,
  //     )

  //     if (!fromProvider) {
  //       throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
  //     }

  //     // 新しいexternalIdが既に他のユーザーで使用されていないかチェック
  //     const existingUser = await userAuthRepository.findUserByAuth(
  //       toProviderType,
  //       newExternalId,
  //     )
  //     if (existingUser && existingUser.userId !== userId) {
  //       throw new ApiV1Error([
  //         { key: "AuthProviderAlreadyExistsError", params: null },
  //       ])
  //     }

  //     // ゲストユーザーからのアップグレードの場合、ゲストユーザを無効化する
  //     if (fromProviderType === "FIREBASE_GUEST") {
  //       // ゲストユーザを無効化
  //       await userAuthRepository.deactivateAuthProvider(
  //         userId,
  //         fromProviderType,
  //       )
  //     }

  //     // 新しいプロバイダを作成
  //     const createdProvider = await userAuthRepository.createAuthProvider({
  //       userId,
  //       providerType: toProviderType,
  //       externalId: newExternalId,
  //       metadata,
  //       isActive: true,
  //     })

  //     return {
  //       deactivated: fromProvider,
  //       created: createdProvider,
  //     }
  //   })
  // }

  /**
   * ユーザーの認証プロバイダ一覧を取得
   */
  public async getUserAuthProviders(
    userId: string,
  ): Promise<AuthProviderEntity[]> {
    const userAuthRepository = new PrismaUserAuthRepository(this._dbConnection)
    return await userAuthRepository.findActiveAuthProviders(userId)
  }

  /**
   * 認証プロバイダを非アクティブ化
   */
  public async deactivateUserAuthProvider(
    userId: string,
    providerType: ProviderTypeType,
  ): Promise<void> {
    const userAuthRepository = new PrismaUserAuthRepository(this._dbConnection)
    await userAuthRepository.deactivateAuthProvider(userId, providerType)
  }

  /**
   * アップグレードパスの妥当性をチェック
   */
  private validateUpgradePath(
    fromProviderType: ProviderTypeType,
    toProviderType: ProviderTypeType,
  ): void {
    const validUpgrades: Record<ProviderTypeType, ProviderTypeType[]> = {
      FIREBASE_GUEST: ["FIREBASE_EMAIL", "FIREBASE_GOOGLE"],
      FIREBASE_EMAIL: ["FIREBASE_GOOGLE"],
      FIREBASE_GOOGLE: ["FIREBASE_EMAIL"],
    }

    const allowedUpgrades = validUpgrades[fromProviderType]
    if (!allowedUpgrades.includes(toProviderType)) {
      throw new ApiV1Error([
        {
          key: "InvalidAuthProviderUpgradeError",
          params: {
            from: fromProviderType.replaceAll("FIREBASE_", ""),
            to: toProviderType.replaceAll("FIREBASE_", ""),
          },
        },
      ])
    }
  }
}
