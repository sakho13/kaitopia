// API Route 内で使用するリポジトリクラスを定義する

import { UserBaseInfo, UserBaseInfoOption } from "@/lib/types/base/userTypes"
import { AuthProviderType } from "@/lib/types/base/authProviderTypes"
import { RepositoryBase } from "../common/RepositoryBase"

export class UserRepository extends RepositoryBase {
  constructor(...base: ConstructorParameters<typeof RepositoryBase>) {
    super(...base)
  }

  public async findUsersForAdmin(limit?: number, offset?: number) {
    return await this.dbConnection.user.findMany({
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

        ownerSchools: true,
        authProviders: true,
      },
      take: limit,
      skip: offset,
      orderBy: [{ createdAt: "desc" }],
    })
  }

  public async countAllUsers() {
    return await this.dbConnection.user.count()
  }

  // public async findUsersBySchoolId(
  //   schoolId: string,
  //   limit?: number,
  //   page?: number,
  // ) {
  //   return await this.dbConnection.user.findMany({
  //     where: {},
  //   })
  // }

  public async findUserById(userId: string) {
    return await this.dbConnection.user.findFirst({
      select: {
        id: true,
        name: true,
        birthDayDate: true,
        role: true,
        ownerSchools: true,
        createdAt: true,
        updatedAt: true,
        authProviders: true,
      },
      where: {
        id: userId,
      },
    })
  }

  public async findUserByAuthProvider(
    providerUid: string,
    providerType: AuthProviderType,
  ) {
    return await this.dbConnection.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        birthDayDate: true,
        role: true,
        ownerSchools: true,
        createdAt: true,
        updatedAt: true,
        authProviders: true,
      },
      where: {
        authProviders: { some: { providerUid, providerType } },
      },
    })
  }

  public async createUserByAuthProvider(
    providerUid: string,
    providerType: AuthProviderType,
    data: UserBaseInfo & UserBaseInfoOption,
  ) {
    return await this.dbConnection.user.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        birthDayDate: data.birthDayDate || null,
        role: data.role,
        authProviders: {
          create: {
            providerUid,
            providerType,
          },
        },
      },
    })
  }

  public async updateUserById(
    userId: string,
    data: Partial<UserBaseInfo & UserBaseInfoOption>,
  ) {
    return await this.dbConnection.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        birthDayDate: data.birthDayDate || null,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
    })
  }

  public async updateUserRoleByAuthProvider(
    providerUid: string,
    providerType: AuthProviderType,
    role: UserBaseInfo["role"],
  ) {
    return await this.dbConnection.user.update({
      where: {
        authProviders: { some: { providerUid, providerType } },
      },
      data: {
        role: role,
      },
    })
  }
}
