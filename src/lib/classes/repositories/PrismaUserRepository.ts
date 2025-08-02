import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import { RepositoryBase } from "../common/RepositoryBase"
import { UserEntity } from "../entities/UserEntity"
import { DateUtility } from "../common/DateUtility"
import { AuthProvider } from "@/lib/types/base/authProviderTypes"

export class PrismaUserRepository
  extends RepositoryBase
  implements IUserRepository
{
  async findByAuthProvider(
    providerUid: string,
    providerType: AuthProvider["providerType"],
  ): Promise<UserEntity | null> {
    const user = await this.dbConnection.user.findFirst({
      where: {
        authProviders: {
          some: { providerUid, providerType },
        },
      },
      include: {
        ownerSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              {
                school: { isSelfSchool: true },
                owner: {
                  authProviders: { some: { providerUid, providerType } },
                },
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
              { school: { isGlobal: true } },
              {
                member: {
                  authProviders: { some: { providerUid, providerType } },
                },
                limitAt: null,
              },
              {
                member: {
                  authProviders: { some: { providerUid, providerType } },
                },
                limitAt: {
                  gte: DateUtility.getNowDate(),
                },
              },
            ],
          },
        },
        authProviders: true,
      },
    })
    if (!user) {
      return null
    }
    return new UserEntity({
      ...user,
      memberSchools: user.memberSchools.map(({ school }) => school),
      ownerSchools: user.ownerSchools.map(({ school }) => school),
      authProviders: user.authProviders,
    })
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.dbConnection.user.create({
      data: {
        name: user.value.name,
        email: user.value.email,
        phoneNumber: user.value.phoneNumber,
        role: user.value.role,
        authProviders: {
          create: user.value.authProviders.map(({ providerUid, providerType }) => ({
            providerUid,
            providerType,
          })),
        },
        ownerSchools: {
          create: {
            priority: 1,
            school: {
              create: {
                name: `${user.value.name}'s スクール`,
                description: "あなただけのスクールです",
                isSelfSchool: true,
                isGlobal: false,
                isPublic: false,
              },
            },
          },
        },
      },
      include: {
        memberSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              { school: { isGlobal: true } },
            ],
          },
        },
        ownerSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              { school: { isSelfSchool: true } },
            ],
          },
        },
        authProviders: true,
      },
    })
    return new UserEntity({
      ...createdUser,
      memberSchools: createdUser.memberSchools.map(({ school }) => school),
      ownerSchools: createdUser.ownerSchools.map(({ school }) => school),
      authProviders: createdUser.authProviders,
    })
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: {
        name: user.value.name,
        email: user.value.email,
        phoneNumber: user.value.phoneNumber,
        role: user.value.role,
        birthDayDate: user.value.birthDayDate,
        updatedAt: DateUtility.getNowDate(),
      },
      include: { authProviders: true },
    })
    return new UserEntity({
      ...updatedUser,
      memberSchools: user.memberSchools.map((s) => s.value),
      ownerSchools: user.ownSchools.map((s) => s.value),
      authProviders: updatedUser.authProviders,
    })
  }

  async delete(user: UserEntity): Promise<UserEntity> {
    const deletedUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: { deletedAt: DateUtility.getNowDate() },
      include: { authProviders: true },
    })
    return new UserEntity({
      ...deletedUser,
      memberSchools: [],
      ownerSchools: [],
      authProviders: deletedUser.authProviders,
    })
  }

  async reRegister(user: UserEntity): Promise<UserEntity> {
    const reRegisteredUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: {
        deletedAt: null,
        updatedAt: DateUtility.getNowDate(),
      },
      include: { authProviders: true },
    })
    return new UserEntity({
      ...reRegisteredUser,
      memberSchools: user.memberSchools.map((s) => s.value),
      ownerSchools: user.ownSchools.map((s) => s.value),
      authProviders: reRegisteredUser.authProviders,
    })
  }
}
