import { DateUtility } from "../common/DateUtility"
import { RepositoryBase } from "../common/RepositoryBase"
import { UserEntity } from "../entities/UserEntity"
import { IManageUserRepository } from "@/lib/interfaces/IManageUserRepository"

const GUEST_USER_DAYS = 5

export class PrismaManageUserRepository
  extends RepositoryBase
  implements IManageUserRepository
{
  async findGuestUsersOver5Days(): Promise<UserEntity[]> {
    const users = await this.dbConnection.user.findMany({
      where: {
        authProviders: {
          some: {
            providerType: "FIREBASE_GUEST",
            isActive: true,
          },
        },
        deletedAt: null,
        createdAt: {
          lt: DateUtility.getBeforeDaysDate(GUEST_USER_DAYS),
        },
      },
    })

    return users.map(
      (user) =>
        new UserEntity({
          ...user,
          memberSchools: [],
          ownerSchools: [],
        }),
    )
  }

  async findAll(limit?: number, offset?: number): Promise<UserEntity[]> {
    const users = await this.dbConnection.user.findMany({
      select: {
        id: true,

        name: true,
        email: true,
        phoneNumber: true,
        birthDayDate: true,

        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        authProviders: true,
      },
      take: limit,
      skip: offset,
      orderBy: [{ createdAt: "desc" }],
    })
    return users.map(
      (user) =>
        new UserEntity({
          ...user,
          ownerSchools: [],
          memberSchools: [],
          authProviders: user.authProviders,
        }),
    )
  }

  public async countAllUsers() {
    return await this.dbConnection.user.count()
  }

  async deleteUsers(userIds: string[]): Promise<void> {
    await this.dbConnection.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        deletedAt: DateUtility.getNowDate(),
      },
    })
  }
}
