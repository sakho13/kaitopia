import { UserEntity } from "../classes/entities/UserEntity"
import { AuthProviderType } from "@/lib/types/base/authProviderTypes"

export interface IUserRepository {
  findByAuthProvider(
    providerUid: string,
    providerType: AuthProviderType,
  ): Promise<UserEntity | null>

  create(user: UserEntity): Promise<UserEntity>

  save(user: UserEntity): Promise<UserEntity>

  reRegister(user: UserEntity): Promise<UserEntity>
}
