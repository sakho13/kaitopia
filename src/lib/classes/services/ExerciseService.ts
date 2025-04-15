import { ExerciseBase } from "@/lib/types/base/exerciseTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ExerciseRepository } from "../repositories/ExerciseRepository"
import { UserRepository } from "../repositories/UserRepository"

export class ExerciseService {
  private _exerciseRepository: ExerciseRepository | null = null
  private _userRepository: UserRepository | null = null

  public resetExerciseRepository(
    ...args: ConstructorParameters<typeof ExerciseRepository>
  ) {
    this._exerciseRepository = new ExerciseRepository(...args)
  }

  public resetUserRepository(
    ...args: ConstructorParameters<typeof UserRepository>
  ) {
    this._userRepository = new UserRepository(...args)
  }

  public async getRecommendExercises() {
    if (!this._exerciseRepository)
      throw new Error("ExerciseRepository is not set")

    const recommendExercises =
      await this._exerciseRepository.findExerciseInGlobalSchool(10)
    return recommendExercises.map((exercise) => {
      return {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
      }
    })
  }

  public async getExercisesForManage(schoolId?: string) {
    if (!this._exerciseRepository)
      throw new Error("ExerciseRepository is not set")

    const exercises = await this._exerciseRepository.findExerciseBySchoolId(
      schoolId,
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
    if (!this._exerciseRepository)
      throw new Error("ExerciseRepository is not set")

    const exercise = await this._exerciseRepository.findExerciseById(exerciseId)
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
    if (!this._exerciseRepository)
      throw new Error("ExerciseRepository is not set")

    return await this._exerciseRepository.createExercise(schoolId, {
      title: property.title,
      description: property.description,
      isCanSkip: false,
      isScoringBatch: true,
    })
  }

  public async updateExercise() {}

  public async deleteExercise(exerciseId: string) {}

  public async startExercise(exerciseId: string) {
    if (!this._userRepository)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    // const userId = this._userRepository.userId

    //

    return {
      answerLogSheetId: "answerLogSheetId",
    }
  }

  // ************************
  //       validate
  // ************************
}
