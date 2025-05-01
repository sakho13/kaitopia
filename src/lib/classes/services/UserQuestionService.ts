import {
  QuestionAnswerContent,
  QuestionAnswerForUser,
  QuestionAnswerTypeType,
  QuestionForUser,
  QuestionTypeType,
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
    // 問題集のトランザクション
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

  /**
   * 回答を保存する(採点はしない)
   * @param userLogRepository
   * @param answerLogSheetId
   * @param userQuestionLogId
   * @param answer
   * @returns
   */
  private async saveUserAnswerLog(
    userLogRepository: UserLogRepository,
    answerLogSheetId: string,
    userQuestionLogId: string,
    answer: QuestionAnswerContent,
  ) {
    if (answer.type === "SKIP") {
      return await userLogRepository.saveSkipQuestionLog(
        answerLogSheetId,
        userQuestionLogId,
        this._userId,
      )
    }

    if (answer.type === "SELECT" && "answerId" in answer) {
      await userLogRepository.deleteSelectQuestionLog(userQuestionLogId)
      return await userLogRepository.saveSelectQuestionLog(
        answerLogSheetId,
        userQuestionLogId,
        this._userId,
        [answer.answerId],
      )
    }

    if (answer.type === "MULTI_SELECT" && "answerIds" in answer) {
      await userLogRepository.deleteSelectQuestionLog(userQuestionLogId)
      return await userLogRepository.saveSelectQuestionLog(
        answerLogSheetId,
        userQuestionLogId,
        this._userId,
        answer.answerIds,
      )
    }

    if (answer.type === "TEXT" && "content" in answer) {
      return await userLogRepository.saveTextQuestionLog(
        answerLogSheetId,
        userQuestionLogId,
        this._userId,
        answer.content,
      )
    }

    return null
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

  private async _getExerciseById(exerciseId: string) {
    const exerciseRepository = new ExerciseRepository(this.dbConnection)
    const exercise = await exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    return exercise
  }

  private _checkAnswerFormat(
    questionType: QuestionTypeType,
    answerType: QuestionAnswerTypeType,
    answer: QuestionAnswerContent,
    props: Partial<{
      minLength: number
      maxLength: number
    }>,
  ) {
    // 文章問題
    if (questionType === "TEXT") {
      try {
        if (answerType === "SELECT") {
          if (answer.type !== "SELECT") throw new Error("InvalidFormatError")
          if (!("answerId" in answer)) throw new Error("InvalidFormatError")
          if (typeof answer.answerId !== "string")
            throw new Error("InvalidFormatError")
          if (answer.answerId.length < 1) throw new Error("InvalidFormatError")
        }

        if (answerType === "MULTI_SELECT") {
          if (answer.type !== "MULTI_SELECT")
            throw new Error("InvalidFormatError")
          if (!("answerId" in answer)) throw new Error("InvalidFormatError")

          if (!Array.isArray(answer.answerId))
            throw new Error("InvalidFormatError")
          if (answer.answerId.length < 1) throw new Error("InvalidFormatError")
          if (
            answer.answerId.some((a) => typeof a !== "string" || a.length < 1)
          )
            throw new Error("InvalidFormatError")
        }

        if (answerType === "TEXT") {
          if (answer.type !== "TEXT") throw new Error("InvalidFormatError")
          if (!("content" in answer)) throw new Error("InvalidFormatError")
          if (typeof answer.content !== "string")
            throw new Error("InvalidFormatError")
          if (answer.content.length < 1) throw new Error("InvalidFormatError")

          if (props.minLength && answer.content.length < props.minLength)
            throw new Error("InvalidFormatError")
          if (props.maxLength && answer.content.length > props.maxLength)
            throw new Error("InvalidFormatError")
        }
      } catch {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "回答形式" } },
        ])
      }
    }
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
