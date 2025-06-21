import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import { RepositoryBase } from "../common/RepositoryBase"
import { UserEntity } from "../entities/UserEntity"

export class PrismaUserRepository
  extends RepositoryBase
  implements IUserRepository
{
  async findByFirebaseUid(firebaseUid: string): Promise<UserEntity | null> {
    const user = await this.dbConnection.user.findUnique({
      where: { firebaseUid },
    })
    if (!user) {
      return null
    }
    return new UserEntity(user)
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.dbConnection.user.create({
      data: {
        firebaseUid: user.value.firebaseUid,
        name: user.value.name,
        email: user.value.email,
        phoneNumber: user.value.phoneNumber,
        role: user.value.role,
        isGuest: user.value.isGuest,
      },
    })
    return new UserEntity(createdUser)
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
        isGuest: user.value.isGuest,
      },
    })
    return new UserEntity(updatedUser)
  }

  async delete(user: UserEntity): Promise<UserEntity> {
    const deletedUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: { deletedAt: new Date() },
    })
    return new UserEntity(deletedUser)
  }
}
