import { ExerciseBase } from "@/lib/types/base/exerciseTypes"
import { ServiceBase } from "../common/ServiceBase"
import { ApiV1Error } from "../common/ApiV1Error"
import { ExerciseRepository } from "../repositories/ExerciseRepository"
import { AnswerLogRepository } from "../repositories/AnswerLogRepository"
import { QuestionRepository } from "../repositories/QuestionRepository"

export class ExerciseService extends ServiceBase {
  public async getRecommendExercises() {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)

    const recommendExercises =
      await exerciseRepository.findExerciseInGlobalSchool(10)
    return recommendExercises.map((exercise) => {
      return {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
      }
    })
  }

  public async getExercisesForManage(
    schoolId?: string,
    limit?: number,
    offset?: number,
  ) {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)

    const exercises = await exerciseRepository.findExerciseBySchoolId(
      schoolId,
      limit,
      offset,
    )
    return exercises.map((exercise) => {
      return {
        schoolId: exercise.schoolId,
        exerciseId: exercise.id,
        title: exercise.title,
        description: exercise.description,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
        isCanSkip: exercise.isCanSkip,
        isScoringBatch: exercise.isScoringBatch,
      }
    })
  }

  public async getExerciseById(exerciseId: string) {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)

    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    return exercise
  }

  /**
   * 問題集を作成する
   *
   * @description スキップ無効、一括採点有効で作成する
   */
  public async createExercise(schoolId: string, property: ExerciseBase) {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)

    return await exerciseRepository.createExercise(schoolId, {
      title: property.title,
      description: property.description,
      isCanSkip: false,
      isScoringBatch: true,
    })
  }

  // public async updateExercise() {}

  // public async deleteExercise(exerciseId: string) {}

  /**
   * 問題集の回答を開始する
   *
   * @description
   * 1. 回答ログシートが存在すれば、そのIDを返す
   * 2. 存在しなければ、回答ログシートを登録する
   * 3. 回答ログシートと出題する問題を紐付ける
   */
  public async startExercise(userId: string, exerciseId: string) {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)
    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const { answerLogSheetId } = await this.dbConnection.$transaction(
      async (tx) => {
        const answerLogRepository = new AnswerLogRepository(tx)

        const logSheet =
          await answerLogRepository.findLatestAnswerLogSheetByExerciseId(
            userId,
            exerciseId,
          )
        if (logSheet)
          return {
            answerLogSheetId: logSheet.answerLogSheetId,
          }

        const created =
          await answerLogRepository.createAnswerLogSheetByExerciseId(
            userId,
            exerciseId,
          )

        const questionRepository = new QuestionRepository(tx)
        const answers =
          await questionRepository.findQuestionAnswersByExerciseId(exerciseId)

        return {
          answerLogSheetId: created.answerLogSheetId,
        }
      },
    )

    return {
      answerLogSheetId: answerLogSheetId,
    }
  }

  // ************************
  //       validate
  // ************************
}
