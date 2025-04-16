import { ExerciseBase } from "@/lib/types/base/exerciseTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ExerciseRepository } from "../repositories/ExerciseRepository"
import { UserRepository } from "../repositories/UserRepository"
import { ServiceBase } from "../common/ServiceBase"

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

  public async getExercisesForManage(schoolId?: string) {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)

    const exercises = await exerciseRepository.findExerciseBySchoolId(schoolId)
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

  public async updateExercise() {}

  public async deleteExercise(exerciseId: string) {}

  /**
   * 問題集の回答を開始する
   * @param exerciseId
   * @returns
   */
  public async startExercise(exerciseId: string) {
    const userRepository = new UserRepository(this.dbConnection)

    //

    return {
      answerLogSheetId: "answerLogSheetId",
    }
  }

  // ************************
  //       validate
  // ************************
}
