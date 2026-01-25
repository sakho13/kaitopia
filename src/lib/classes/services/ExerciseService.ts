import { prisma } from "@/lib/prisma"
import { ExerciseBase } from "@/lib/types/base/exerciseTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ExerciseRepository } from "../repositories/ExerciseRepository"
import { UserEntity } from "../entities/UserEntity"

export class ExerciseService {
  constructor(private readonly _dbConnection: typeof prisma = prisma) {}

  public async getRecommendExercises() {
    const exerciseRepository = new ExerciseRepository(this._dbConnection)

    const recommendExercises =
      await exerciseRepository.findExerciseInGlobalSchool(10, true)
    return recommendExercises.map((exercise) => {
      return {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
      }
    })
  }

  /**
   * 管理用問題集取得
   */
  public async getExercisesForManage(
    user: UserEntity,
    schoolId: string,
    limit: number = 10,
    page?: number,
  ) {
    if (!user.checkAccessSchoolMethod(schoolId).includes("read"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const exerciseRepository = new ExerciseRepository(this._dbConnection)

    const offset = page ? (page - 1) * limit : undefined
    const exercises = await exerciseRepository.findExerciseBySchoolId(
      schoolId,
      limit,
      offset,
    )
    const totalCount = await exerciseRepository.countExerciseBySchoolId(
      schoolId,
    )
    /**
     * @description 同じlimitとしたときの次のページNo。nullの場合は次のページがないことを示す
     */
    const nextPage = exercises.length < limit ? null : page ? page + 1 : 2

    return {
      exercises: exercises.map((exercise) => ({
        schoolId: exercise.schoolId,
        exerciseId: exercise.id,
        title: exercise.title,
        description: exercise.description,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
        isPublished: exercise.isPublished,
        isCanSkip: exercise.isCanSkip,
        isScoringBatch: exercise.isScoringBatch,
        questionCount: exercise._count.exerciseQuestions,
      })),
      totalCount,
      nextPage,
    }
  }

  /**
   * 管理用問題集の単品取得
   *
   * @category manage
   */
  public async getExerciseById(user: UserEntity, exerciseId: string) {
    const exerciseRepository = new ExerciseRepository(this._dbConnection)

    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    if (!user.checkAccessSchoolMethod(exercise.schoolId).includes("read"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    return exercise
  }

  /**
   * 問題集を作成する
   *
   * @description スキップ無効、一括採点有効で作成する
   */
  public async createExercise(
    user: UserEntity,
    schoolId: string,
    property: ExerciseBase,
  ) {
    const exerciseRepository = new ExerciseRepository(this._dbConnection)

    if (!user.checkAccessSchoolMethod(schoolId).includes("create"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    return await exerciseRepository.createExercise(schoolId, {
      title: property.title,
      description: property.description,
      isPublished: false,
      isCanSkip: false,
      isScoringBatch: true,
    })
  }

  /**
   * 問題集の設定を更新する
   * @param exerciseId
   * @param property
   * @returns
   */
  public async updateExercise(
    user: UserEntity,
    exerciseId: string,
    property: Partial<ExerciseBase & { isPublished: boolean }>,
  ) {
    const exerciseRepository = new ExerciseRepository(this._dbConnection)
    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    if (!user.checkAccessSchoolMethod(exercise.schoolId).includes("edit"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    return await exerciseRepository.updateExercise(exerciseId, property)
  }

  /**
   * 問題集を削除する
   * @param exerciseId
   * @returns
   */
  public async deleteExercise(user: UserEntity, exerciseId: string) {
    const exerciseRepository = new ExerciseRepository(this._dbConnection)

    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    if (!user.checkAccessSchoolMethod(exercise.schoolId).includes("delete"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    return await exerciseRepository.deleteExercise(exerciseId)
  }
}
