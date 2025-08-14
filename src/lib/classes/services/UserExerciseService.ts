import { prisma } from "@/lib/prisma"
import { UserEntity } from "../entities/UserEntity"
import { ApiV1Error } from "../common/ApiV1Error"

/**
 * ユーザー向け演習機能を管理するサービス
 */
export class UserExerciseService {
  constructor(private readonly _dbConnection: typeof prisma = prisma) {}

  /**
   * 問題集の基本情報を取得する（ユーザー向け）
   * @param user - ユーザーエンティティ
   * @param exerciseId - 問題集ID
   */
  async getExerciseInfo(user: UserEntity, exerciseId: string) {
    const exercise = await this._dbConnection.exercise.findUnique({
      select: {
        id: true,
        schoolId: true,
        title: true,
        description: true,
        isPublished: true,
        isCanSkip: true,
        isScoringBatch: true,
        exerciseQuestions: {
          select: {
            question: {
              select: {
                title: true,
                questionType: true,
                answerType: true,
              },
            },
          },
        },
      },
      where: {
        id: exerciseId,
      },
    })

    if (!exercise) {
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    }

    // ユーザーの権限チェック（基本的にすべてのユーザーが閲覧可能）
    // 必要に応じて今後権限チェックロジックを追加

    return {
      exercise: {
        title: exercise.title,
        description: exercise.description,
        isPublished: exercise.isPublished,
        isCanSkip: exercise.isCanSkip,
        isScoringBatch: exercise.isScoringBatch,
      },
      questions: exercise.exerciseQuestions.map((q) => ({
        title: q.question.title,
        questionType: q.question.questionType,
        answerType: q.question.answerType,
      })),
    }
  }
}