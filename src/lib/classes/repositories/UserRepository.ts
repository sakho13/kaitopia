// API Route 内で使用するリポジトリクラスを定義する

import { UserBaseInfo, UserBaseInfoOption } from "@/lib/types/base/userTypes"
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
        birthDayDate: true,

        role: true,
        isGuest: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,

        firebaseUid: true,
        ownerSchools: true,
      },
      where: {
        isGuest: false,
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
        isGuest: true,
      },
      where: {
        id: userId,
      },
    })
  }

  public async findUserByFirebaseUid(firebaseUid: string) {
    return await this.dbConnection.user.findUnique({
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
        isGuest: true,
      },
      where: {
        firebaseUid: firebaseUid,
      },
    })
  }

  public async createUserByFirebaseUid(
    firebaseUid: string,
    isGuest: boolean,
    data: UserBaseInfo & UserBaseInfoOption,
  ) {
    return await this.dbConnection.user.create({
      data: {
        firebaseUid: firebaseUid,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        birthDayDate: data.birthDayDate || null,
        role: data.role,
        isGuest: isGuest,
      },
    })
  }

  public async updateUserByFirebaseUid(
    firebaseUid: string,
    data: Partial<UserBaseInfo & UserBaseInfoOption>,
  ) {
    return await this.dbConnection.user.update({
      where: {
        firebaseUid: firebaseUid,
      },
      data: {
        name: data.name,
        birthDayDate: data.birthDayDate || null,
        role: data.role,
      },
    })
  }
}
