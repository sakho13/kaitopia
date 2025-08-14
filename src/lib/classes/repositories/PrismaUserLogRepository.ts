import { prisma } from "@/lib/prisma"
import { IUserLogRepository } from "@/lib/interfaces/IUserLogRepository"
import { AnswerLogSheetSummary } from "@/lib/types/base/userLogTypes"

export class PrismaUserLogRepository implements IUserLogRepository {
  constructor(private readonly _dbConnection: typeof prisma = prisma) {}

  async findAllByUserId(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<AnswerLogSheetSummary[]> {
    const results = await this._dbConnection.answerLogSheet.findMany({
      select: {
        answerLogSheetId: true,
        isInProgress: true,
        totalCorrectCount: true,
        totalIncorrectCount: true,
        totalUnansweredCount: true,
        _count: { select: { questionUserLogs: true } },
        exerciseId: true,
        exercise: {
          select: {
            id: true,
            title: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId: userId,
      },
      take: limit,
      skip: offset,
      orderBy: [{ updatedAt: "desc" }],
    })

    return results.map((result) => ({
      answerLogSheetId: result.answerLogSheetId,
      isInProgress: result.isInProgress,
      totalCorrectCount: result.totalCorrectCount,
      totalIncorrectCount: result.totalIncorrectCount,
      totalUnansweredCount: result.totalUnansweredCount,
      totalQuestionCount: result._count.questionUserLogs,
      exerciseId: result.exerciseId,
      exercise: result.exercise,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }))
  }

  async countAllByUserId(userId: string): Promise<number> {
    return await this._dbConnection.answerLogSheet.count({
      where: {
        userId: userId,
      },
    })
  }
}