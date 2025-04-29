import { ApiV1Error } from "../common/ApiV1Error"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"
import { ExerciseRepository } from "../repositories/ExerciseRepository"

/**
 * 管理画面にて行う問題操作を行うサービスクラス
 */
export class ManageQuestionService extends ServiceBase {
  private userController: UserController

  private _exerciseId: string | null = null

  constructor(
    userController: UserController,
    ...args: ConstructorParameters<typeof ServiceBase>
  ) {
    super(...args)
    this.userController = userController
  }

  public async getQuestionDetail(questionId: string) {
    if (this._exerciseId) {
      const exerciseRepository = new ExerciseRepository(this.dbConnection)
      const exercise = await exerciseRepository.findExerciseById(
        this._exerciseId,
      )
      if (!exercise)
        throw new ApiV1Error([{ key: "NotFoundError", params: null }])

      const question = await this.dbConnection.question.findUnique({
        select: {
          title: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,

          questionType: true,
          answerType: true,
          isPublished: true,
          currentVersionId: true,
          currentVersion: true,
          draftVersionId: true,
          draftVersion: true,

          versions: {
            select: {
              version: true,
              content: true,
              hint: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        where: {
          id: questionId,
          exerciseQuestions: {
            every: {
              exerciseId: this._exerciseId,
            },
          },
        },
      })

      return question
    }

    return null
  }

  // public async addNewQuestionVersion(questionId: string) {}

  // public async changeCurrentVersion(
  //   questionId: string,
  //   newVersionData: number,
  // ) {}

  public set exerciseId(exerciseId: string) {
    this._exerciseId = exerciseId
  }
}
