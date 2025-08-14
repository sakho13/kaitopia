import { prisma } from "@/lib/prisma"
import { UserEntity } from "../entities/UserEntity"
import { ApiV1Error } from "../common/ApiV1Error"
import { UserController } from "../controller/UserController"
import { ExerciseRepository } from "../repositories/ExerciseRepository"

/**
 * ユーザー向け演習機能を管理するサービス
 */
export class UserExerciseService {
  private userController: UserController

  constructor(
    private readonly _dbConnection: typeof prisma = prisma,
    userController?: UserController
  ) {
    this.userController = userController || new UserController(this._dbConnection)
  }

  /**
   * 問題集の基本情報を取得する（ユーザー向け）
   * 元のExerciseService.getExerciseById()のロジックを流用
   * @param user - ユーザーエンティティ
   * @param exerciseId - 問題集ID
   */
  async getExerciseInfo(user: UserEntity, exerciseId: string) {
    const exerciseRepository = new ExerciseRepository(this._dbConnection)

    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const accessResult = await this.userController.accessSchoolMethod(
      exercise.schoolId,
    )
    if (!accessResult.includes("read"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    return exercise
  }

  public setUserController(userController: UserController) {
    this.userController = userController
  }
}