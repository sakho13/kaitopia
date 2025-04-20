// API Route 内で使用するリポジトリクラスを定義する

import { UserBaseInfo, UserBaseInfoOption } from "@/lib/types/base/userTypes"
import { RepositoryBase } from "../common/RepositoryBase"

export class UserRepository extends RepositoryBase {
  constructor(...base: ConstructorParameters<typeof RepositoryBase>) {
    super(...base)
  }

  public async findUserByFirebaseUid(firebaseUid: string) {
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
