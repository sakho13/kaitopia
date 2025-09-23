import { UserEntity } from "@/lib/classes/entities/UserEntity"
import { IUserAuthRepository } from "@/lib/interfaces/IUserAuthRepository"
import { ProviderTypeType } from "@/lib/types/base/authProviderTypes"
import { RepositoryBase } from "../common/RepositoryBase"
import { AuthProviderEntity } from "../entities/AuthProviderEntity"
import { DateUtility } from "../common/DateUtility"
import { IAuthProvider } from "@/lib/interfaces/IAuthProvider"

/**
 * Prismaを使用した認証プロバイダリポジトリの実装
 */
export class PrismaUserAuthRepository
  extends RepositoryBase
  implements IUserAuthRepository
{
  /**
   * 認証プロバイダタイプと外部IDでユーザーを検索
   */
  async findUserByAuth(
    providerType: ProviderTypeType,
    externalId: string,
  ): Promise<UserEntity | null> {
    const authProvider = await this.dbConnection.authProvider.findUnique({
      where: {
        providerType_externalId: {
          providerType,
          externalId,
        },
        isActive: true,
      },
    })

    if (!authProvider) {
      return null
    }

    // 認証プロバイダからユーザーIDを取得してUserEntityを構築
    const user = await this.dbConnection.user.findUnique({
      where: { id: authProvider.userId },
      include: {
        ownerSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              {
                school: { isSelfSchool: true },
              },
            ],
          },
        },
        memberSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              {
                limitAt: null,
              },
              {
                limitAt: {
                  gte: new Date(),
                },
              },
            ],
          },
        },
      },
    })

    if (!user) {
      return null
    }

    // グローバルスクールを取得
    const globalSchools = await this.dbConnection.school.findMany({
      where: { isGlobal: true },
    })

    const memberSchools = [
      ...user.memberSchools.map(({ school }) => school),
      ...globalSchools,
    ]

    return new UserEntity({
      ...user,
      memberSchools,
      ownerSchools: user.ownerSchools.map(({ school }) => school),
    })
  }

  /**
   * ユーザーIDでアクティブな認証プロバイダを取得
   */
  async findActiveAuthProviders(userId: string): Promise<AuthProviderEntity[]> {
    const authProviders = await this.dbConnection.authProvider.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return authProviders.map(
      (provider) =>
        new AuthProviderEntity({
          id: provider.id,
          userId: provider.userId,
          providerType: provider.providerType,
          externalId: provider.externalId,
          metadata: provider.metadata as Record<string, unknown> | null,
          isActive: provider.isActive,
          createdAt: provider.createdAt,
          updatedAt: provider.updatedAt,
        }),
    )
  }

  /**
   * 認証プロバイダを作成
   */
  async createAuthProvider(
    user: UserEntity,
    data: IAuthProvider,
  ): Promise<AuthProviderEntity> {
    const authProvider = await this.dbConnection.authProvider.create({
      data: {
        userId: user.userId,
        providerType: data.providerType,
        externalId: data.externalId,
        metadata: undefined,
        isActive: true,
      },
    })

    return new AuthProviderEntity({
      id: authProvider.id,
      userId: authProvider.userId,
      providerType: authProvider.providerType,
      externalId: authProvider.externalId,
      metadata: authProvider.metadata as Record<string, unknown> | null,
      isActive: authProvider.isActive,
      createdAt: authProvider.createdAt,
      updatedAt: authProvider.updatedAt,
    })
  }

  /**
   * 認証プロバイダを非アクティブ化
   */
  async deactivateAuthProvider(
    userId: string,
    providerType: ProviderTypeType,
  ): Promise<void> {
    await this.dbConnection.authProvider.updateMany({
      where: {
        userId,
        providerType,
        isActive: true,
      },
      data: {
        isActive: false,
        updatedAt: DateUtility.getNowDate(),
      },
    })
  }

  /**
   * 認証プロバイダを削除
   */
  async deleteAuthProvider(id: string): Promise<void> {
    await this.dbConnection.authProvider.delete({
      where: { id },
    })
  }

  /**
   * 特定の認証プロバイダが存在するかチェック
   */
  async existsAuthProvider(
    providerType: ProviderTypeType,
    externalId: string,
  ): Promise<boolean> {
    const count = await this.dbConnection.authProvider.count({
      where: {
        providerType,
        externalId,
        isActive: true,
      },
    })

    return count > 0
  }
}
