import { RepositoryBase } from "../common/RepositoryBase"
import { IUserHistoryRepository } from "@/lib/interfaces/IUserHistoryRepository"
import { UserHistoryEntity } from "../entities/UserHistoryEntity"

export class PrismaUserHistoryRepository
  extends RepositoryBase
  implements IUserHistoryRepository
{
  async addUserHistory(
    userHistory: UserHistoryEntity,
  ): Promise<UserHistoryEntity> {
    const result = await this.dbConnection.userHistory.create({
      data: {
        userId: userHistory.value.userId,
        actionType: userHistory.value.actionType,
        quitCode: userHistory.value.quitCode,
        quitReason: userHistory.value.quitReason,
      },
    })
    return new UserHistoryEntity(result)
  }

  async getLatestQuitHistory(
    userId: string,
  ): Promise<UserHistoryEntity | null> {
    const result = await this.dbConnection.userHistory.findFirst({
      where: {
        userId,
        actionType: "QUIT",
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return result ? new UserHistoryEntity(result) : null
  }
}
