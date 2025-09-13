import { prisma } from "@/lib/prisma"
import { IUserLogRepository } from "@/lib/interfaces/IUserLogRepository"
import { AnswerLogSheetSummary, AnswerLogSheetDetail } from "@/lib/types/base/userLogTypes"
import { QuestionAnswerForUser, QuestionAnswerTypeType } from "@/lib/types/base/questionTypes"
import { ApiV1Error } from "../common/ApiV1Error"

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

  async findDetailByUserIdAndSheetId(
    userId: string,
    answerLogSheetId: string,
  ): Promise<AnswerLogSheetDetail | null> {
    const sheet = await this._dbConnection.answerLogSheet.findUnique({
      select: {
        answerLogSheetId: true,
        exerciseId: true,
        isInProgress: true,
        totalCorrectCount: true,
        totalIncorrectCount: true,
        totalUnansweredCount: true,
        questionUserLogs: {
          select: {
            questionUserLogId: true,
            questionId: true,
            version: true,
            orderIndex: true,
            skipped: true,
            score: true,
            textAnswer: true,
            selectAnswerOrder: true,
            questionVersion: {
              select: {
                question: {
                  select: {
                    id: true,
                    title: true,
                    questionType: true,
                    answerType: true,
                  },
                },
                questionAnswers: {
                  select: {
                    answerId: true,
                    selectContent: true,
                    isCorrect: true,
                    maxLength: true,
                    minLength: true,
                  },
                },
                hint: true,
                content: true,
              },
            },
            answerSelectUserLogs: {
              select: {
                answerSelectUserLogId: true,
                selectAnswerId: true,
                isCorrect: true,
                questionAnswer: {
                  select: {
                    selectContent: true,
                    maxLength: true,
                    minLength: true,
                    isCorrect: true,
                  },
                },
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        exercise: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        _count: { select: { questionUserLogs: true } },
      },
      where: {
        userId_answerLogSheetId: {
          userId: userId,
          answerLogSheetId: answerLogSheetId,
        },
      },
    })

    if (!sheet) return null

    if (sheet.isInProgress) {
      throw new ApiV1Error([{ key: "ExerciseUnAnsweredError", params: null }])
    }

    const questionAnswerProperties = sheet.questionUserLogs.map((q) => {
      const answers = this._convertQuestionAnswerProperty({
        answerType: q.questionVersion.question.answerType,
        selectAnswerOrder: q.selectAnswerOrder,
        questionAnswers: q.questionVersion.questionAnswers.map((s) => ({
          answerId: s.answerId,
          selectContent: s.selectContent,
          minLength: s.minLength,
          maxLength: s.maxLength,
        })),
      })

      return {
        questionUserLogId: q.questionUserLogId,
        questionId: q.questionVersion.question.id,
        title: q.questionVersion.question.title,
        questionType: q.questionVersion.question.questionType as "TEXT" | "IMAGE" | "VIDEO" | "AUDIO",
        content: q.questionVersion.content,
        hint: q.questionVersion.hint ?? "",
        score: q.score ?? 0,
        answerType: q.questionVersion.question.answerType as "SELECT" | "MULTI_SELECT" | "TEXT",
        userAnswers: q.questionVersion.questionAnswers.map(
          ({ answerId, isCorrect }) => {
            const selectedAnswer = q.answerSelectUserLogs.find(
              (a) => a.selectAnswerId === answerId,
            )
            return {
              answerId: answerId,
              isCorrect: isCorrect === true,
              isSelected: !!selectedAnswer,
            }
          },
        ),
        answers,
      }
    })

    return {
      isInProgress: sheet.isInProgress,
      totalQuestionCount: sheet._count.questionUserLogs,
      totalCorrectCount: sheet.totalCorrectCount,
      totalIncorrectCount: sheet.totalIncorrectCount,
      totalUnansweredCount: sheet.totalUnansweredCount,
      questionAnswerProperties,
      exercise: sheet.exercise,
      createdAt: sheet.createdAt,
      updatedAt: sheet.updatedAt,
    }
  }

  private _convertQuestionAnswerProperty(currentQuestion: {
    answerType: string
    selectAnswerOrder: string[]
    questionAnswers: {
      answerId: string
      selectContent: string | null
      minLength: number | null
      maxLength: number | null
    }[]
  }): QuestionAnswerForUser<QuestionAnswerTypeType> {
    const answerType = currentQuestion.answerType
    if (answerType === "TEXT") {
      const a = currentQuestion.questionAnswers[0]
      return {
        property: {
          answerId: a.answerId,
          maxLength: a.maxLength ?? 0,
          minLength: a.minLength ?? 0,
        },
      }
    }

    if (["SELECT", "MULTI_SELECT"].includes(answerType)) {
      const selection = currentQuestion.selectAnswerOrder.reduce((p, c) => {
        const a = currentQuestion.questionAnswers.find((a) => a.answerId === c)
        if (a) {
          return [
            ...p,
            {
              answerId: a.answerId,
              selectContent: a.selectContent!,
            },
          ]
        }
        return p
      }, [] as { answerId: string; selectContent: string }[])

      return {
        selection,
      }
    }

    return {
      property: {
        answerId: "",
        maxLength: 0,
        minLength: 0,
      },
    }
  }
}