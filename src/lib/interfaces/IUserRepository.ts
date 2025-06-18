import { UserEntity } from "../classes/entities/UserEntity"

export interface IUserRepository {
  findByFirebaseUid(firebaseUid: string): Promise<UserEntity | null>

  create(user: UserEntity): Promise<UserEntity>

  save(user: UserEntity): Promise<UserEntity>
}
