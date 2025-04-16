import { RepositoryBase } from "../common/RepositoryBase"

export class AnswerLogRepository extends RepositoryBase {
  public async findAnswerLogSheetsByUserId(
    userId: string,
    offset: number = 0,
    len: number = 20,
  ) {
    return await this.dbConnection.answerLogSheet.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: offset,
      take: len,
    })
  }

  public async findAnswerLogSheetById(
    userId: string,
    answerLogSheetId: string,
    isInProgress: boolean = true,
  ) {
    return await this.dbConnection.answerLogSheet.findFirst({
      where: {
        userId,
        answerLogSheetId,
        isInProgress,
      },
    })
  }

  public async findLatestAnswerLogSheetByExerciseId(
    userId: string,
    exerciseId: string,
    isInProgress: boolean = true,
  ) {
    return await this.dbConnection.answerLogSheet.findFirst({
      where: {
        userId,
        exerciseId,
        isInProgress,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
  }

  public async createAnswerLogSheetByExerciseId(
    userId: string,
    exerciseId: string,
  ) {
    return await this.dbConnection.answerLogSheet.create({
      data: {
        userId,
        exerciseId,
        isInProgress: true,
      },
    })
  }
}
