import {
  QuestionAnswerForUser,
  QuestionAnswerTypeType,
  QuestionForUser,
} from "@/lib/types/base/questionTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"
import { ExerciseRepository } from "../repositories/ExerciseRepository"

export class UserQuestionService extends ServiceBase {
  private userController: UserController

  private _exerciseId: string | null = null

  constructor(
    userController: UserController,
    ...args: ConstructorParameters<typeof ServiceBase>
  ) {
    super(...args)
    this.userController = userController
  }

  /**
   * 問題リストを取得する
   *
   * ## mode
   *
   *   * show: 問題を表示する(回答画面前で表示される)
   *   * answer: 回答を前提に問題を取得する(回答画面での取得)
   *   * restart: answer実行済みの問題を取得する
   */
  public async getQuestions(mode: "show" | "answer" | "restart"): Promise<{
    questions: QuestionForUser[]
    answerLogSheetId: string | null
  }> {
    if (this._exerciseId) {
      const exerciseRepository = new ExerciseRepository(this.dbConnection)
      const exercise = await exerciseRepository.findExerciseById(
        this._exerciseId,
      )
      if (!exercise)
        throw new ApiV1Error([{ key: "NotFoundError", params: null }])

      // if (mode === "restart") {
      //   const latestAnswerLogSheet =
      //     await this._getLatestAnswerLogSheetInProgress()
      //   if (!latestAnswerLogSheet)
      //     throw new ApiV1Error([{ key: "NotFoundError", params: null }])

      //   // 既出の問題でバージョン更新
      // }

      if (mode === "show") {
        const questions = await this.dbConnection.question.findMany({
          select: {
            id: true,
            title: true,
            questionType: true,
            answerType: true,
            currentVersionId: true,
            currentVersion: {
              select: {
                content: true,
                hint: true,
              },
            },
          },
          where: {
            exerciseQuestions: {
              every: {
                exerciseId: this._exerciseId,
              },
            },
            currentVersionId: {
              not: null,
            },
          },
        })

        return {
          questions: questions.map((q) => ({
            questionId: q.id,
            version: q.currentVersionId!,

            title: q.title,
            questionType: q.questionType,

            content: q.currentVersion!.content,
            hint: q.currentVersion!.hint,

            isCanSkip: null,

            answerType: q.answerType,
            answer:
              {} as unknown as QuestionAnswerForUser<QuestionAnswerTypeType>,
          })),
          answerLogSheetId: null,
        }
      }

      if (mode === "answer") {
        const { questions, sheet } =
          await this._insertAnswerLogSheetAndPropertyByExercise(
            this._exerciseId,
          )
        return {
          questions: questions.map((q) => {
            const answerType = q.answerType
            const properties: QuestionAnswerForUser<QuestionAnswerTypeType> = [
              "SELECT",
              "MULTI_SELECT",
            ].includes(answerType)
              ? {
                  selection:
                    q.currentVersion?.questionAnswers.map((a) => ({
                      answerId: a.answerId!,
                      selectContent: a.selectContent!,
                    })) ?? [],
                }
              : {
                  property: {
                    answerId: "",
                    maxLength: 0,
                    minLength: 0,
                  },
                }
            if (answerType === "TEXT") {
              const answer = q.currentVersion?.questionAnswers[0]
              if (answer && "property" in properties) {
                properties.property.answerId = answer.answerId!
                properties.property.maxLength = answer.maxLength ?? 0
                properties.property.minLength = answer.minLength ?? 0
              }
            }

            return {
              questionId: q.id,
              version: q.currentVersionId!,

              title: q.title,
              questionType: q.questionType,

              content: q.currentVersion!.content,
              hint: q.currentVersion!.hint,

              isCanSkip: exercise.isCanSkip,

              answerType: q.answerType,
              answer: properties,
            }
          }),
          answerLogSheetId: sheet.answerLogSheetId,
        }
      }
    }

    throw new ApiV1Error([{ key: "NotFoundError", params: null }])
  }

  // private async _getLatestAnswerLogSheetInProgress() {
  //   return await this.dbConnection.answerLogSheet.findFirst({
  //     where: {
  //       userId: this._userId,
  //       exerciseId: this._exerciseId,
  //       isInProgress: true,
  //     },
  //     orderBy: {
  //       updatedAt: "desc",
  //     },
  //   })
  // }

  private async _insertAnswerLogSheetAndPropertyByExercise(exerciseId: string) {
    // 最新の問題集に設定している情報からログシートを作成する
    const questions = await this.dbConnection.question.findMany({
      select: {
        id: true,
        title: true,
        questionType: true,
        answerType: true,
        currentVersionId: true,
        currentVersion: {
          select: {
            content: true,
            hint: true,
            questionAnswers: {
              select: {
                questionId: true,
                version: true,

                answerId: true,
                isCorrect: false, // ここはfalseで良い
                selectContent: true,
                maxLength: true,
                minLength: true,
              },
            },
          },
        },
      },
      where: {
        exerciseQuestions: { every: { exerciseId } },
        currentVersionId: { not: null },
      },
    })
    if (questions.length === 0)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    // ログシートを作成(そのときの出題履歴も記録する)
    const sheet = await this.dbConnection.answerLogSheet.create({
      data: {
        userId: this._userId,
        exerciseId: exerciseId,
        isInProgress: true,
        questionUserLogs: {
          createMany: {
            skipDuplicates: true,
            data: questions.map((q, i) => ({
              questionId: q.id,
              version: q.currentVersionId!,
              orderIndex: i + 1,
            })),
          },
        },
      },
    })
    return { questions, sheet }
  }

  private get _userId() {
    if (this.userController.userId === null)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    return this.userController.userId
  }

  public set exerciseId(exerciseId: string) {
    this._exerciseId = exerciseId
  }
}
