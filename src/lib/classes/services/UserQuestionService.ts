import {
  QuestionAnswerContent,
  QuestionAnswerForUser,
  QuestionAnswerTypeType,
  QuestionForUser,
} from "@/lib/types/base/questionTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"
import { ExerciseRepository } from "../repositories/ExerciseRepository"
import { UserLogRepository } from "../repositories/UserLogRepository"
import { UserQuestionRepository } from "../repositories/UserQuestionRepository"

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
      if (mode === "show") {
        const userQuestionRepository = new UserQuestionRepository(
          this._userId,
          this.dbConnection,
        )
        const questions =
          await userQuestionRepository.findQuestionsByExerciseId(
            this._exerciseId,
          )

        return {
          questions: questions.map((q) => ({
            questionUserLogId: q.id,

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

      if (mode === "answer" || mode === "restart") {
        const { questions, sheet, exercise } =
          await this._insertAnswerLogSheetAndPropertyByExercise(
            this._exerciseId,
          )
        return {
          questions: questions.map((q) => {
            const currentQuestionVersion = q.currentVersion
            if (!currentQuestionVersion)
              throw new ApiV1Error([{ key: "NotFoundError", params: null }])

            const answerType = q.answerType
            const properties: QuestionAnswerForUser<QuestionAnswerTypeType> = [
              "SELECT",
              "MULTI_SELECT",
            ].includes(answerType)
              ? {
                  selection:
                    currentQuestionVersion.questionAnswers.map((a) => ({
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
            const qLog = sheet.questionUserLogs.find(
              (l) => l.questionId === q.id && l.version === q.currentVersionId,
            )

            return {
              questionUserLogId: qLog ? qLog.questionUserLogId : q.id,

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

  /**
   * 問題に回答する
   * @param answerLogSheetId
   * @param questionUserLogId
   * @param answer
   */
  public async saveAnswerLog(
    answerLogSheetId: string,
    questionUserLogId: string,
    answer: QuestionAnswerContent,
  ) {
    if (this._exerciseId) {
      const userLogRepository = new UserLogRepository(
        this._userId,
        this.dbConnection,
      )
      const latest =
        await userLogRepository.findLatestAnswerLogSheetByExerciseId(
          this._exerciseId,
        )
      if (!latest)
        throw new ApiV1Error([{ key: "NotFoundError", params: null }])

      const created = await this.saveUserAnswerLog(
        latest.answerLogSheetId,
        answer,
      )
      console.log(created)
    }
  }

  private async saveUserAnswerLog(
    answerLogSheetId: string,
    answer: QuestionAnswerContent,
  ) {
    console.log(answerLogSheetId, answer)
    return true
  }

  private async _checkAnswerResult(answerLogSheetId: string) {
    console.log(answerLogSheetId)
  }

  /**
   * 問題集用の回答ログシートを作成する
   * @param exerciseId
   * @param createNew trueの場合は、既出の問題集があっても新しいものを作成する
   * @returns
   */
  private async _insertAnswerLogSheetAndPropertyByExercise(
    exerciseId: string,
    createNew: boolean = false,
  ) {
    const exercise = await this._getExerciseById(exerciseId)

    const userLogRepository = new UserLogRepository(
      this._userId,
      this.dbConnection,
    )
    const latest = await userLogRepository.findLatestAnswerLogSheetByExerciseId(
      exerciseId,
    )

    // 既出ならそれを返す
    if (latest && !createNew && latest.exerciseId === exerciseId) {
      const userQuestionRepository = new UserQuestionRepository(
        this._userId,
        this.dbConnection,
      )
      const questions = await userQuestionRepository.findQuestionsByExerciseId(
        exerciseId,
        false,
      )
      if (questions.length === 0)
        throw new ApiV1Error([{ key: "NotFoundError", params: null }])

      return { questions, sheet: latest, exercise }
    }

    // 使用していないため無視
    if (createNew) {
      if (latest && latest.questionUserLogs.length > 0) {
        // すでに存在し回答していない場合は再度作成する
        if (
          latest.questionUserLogs.every(
            (q) => q.answerUserLogs.length === 0 || q.skipped,
          )
        ) {
          // this.dbConnection.questionUserLog
        }

        return { sheet: latest, questions: [], exercise }
      }
    }

    // 最新の問題集に設定している情報からログシートを作成する
    const { questions, sheet } = await this.dbConnection.$transaction(
      async (t) => {
        const userQuestionRepository = new UserQuestionRepository(
          this._userId,
          t,
        )
        const questions =
          await userQuestionRepository.findQuestionsByExerciseId(
            exerciseId,
            false,
          )
        if (questions.length === 0)
          throw new ApiV1Error([{ key: "NotFoundError", params: null }])

        const userLogRepository = new UserLogRepository(this._userId, t)
        const sheet =
          await userLogRepository.createExerciseAnswerLogSheetByQuestions(
            exerciseId,
            questions.map((q) => ({
              questionId: q.id,
              version: q.currentVersionId!,
            })),
          )

        return { questions, sheet }
      },
    )
    return { questions, sheet, exercise }
  }

  /**
   * 最新の回答中の回答ログシートを取得する
   */
  private async _getLatestAnswerLogSheetInProgressByExerciseId(
    exerciseId: string,
  ) {
    return await this.dbConnection.answerLogSheet.findFirst({
      select: {
        answerLogSheetId: true,
        questionUserLogs: {
          select: {
            questionId: true,
            version: true,
            orderIndex: true,
            skipped: true,
            score: true,
            answerUserLogs: true,
          },
        },
      },
      where: {
        userId: this._userId,
        exerciseId: exerciseId,
        isInProgress: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
  }

  private async _getExerciseById(exerciseId: string) {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)
    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    return exercise
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
