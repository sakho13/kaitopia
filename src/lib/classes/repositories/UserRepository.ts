// API Route 内で使用するリポジトリクラスを定義する

import { UserBaseInfo } from "@/lib/types/base/userTypes"
import { PrismaClient } from "@prisma/client"

export class UserRepository {
  constructor(private dbConnection: PrismaClient) {}

  public async findUserByFirebaseUid(firebaseUid: string) {
    return await this.dbConnection.user.findFirst({
      select: {
        id: true,
        name: true,
        birthDayDate: true,
        role: true,
        ownerSchools: true,
      },
      where: {
        firebaseUid: firebaseUid,
      },
    })
  }

  public async createUserByFirebaseUid(
    firebaseUid: string,
    data: UserBaseInfo,
  ) {
    return await this.dbConnection.user.create({
      data: {
        firebaseUid: firebaseUid,
        name: data.name,
        birthDayDate: data.birthDayDate,
        role: data.role,
      },
    })
  }

  public async updateUserByFirebaseUid(
    firebaseUid: string,
    data: Partial<UserBaseInfo>,
  ) {
    return await this.dbConnection.user.update({
      where: {
        firebaseUid: firebaseUid,
      },
      data: {
        name: data.name,
        birthDayDate: data.birthDayDate,
        role: data.role,
      },
    })
  }
}
