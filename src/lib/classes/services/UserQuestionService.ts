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
            questionId: q.id,

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
              questionId: q.id,

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
  ): Promise<{
    score: number | null
    totalQuestions: number
    isCorrect: boolean | null
    totalCorrectCount: number
    totalIncorrectCount: number
    totalUnansweredCount: number
  } | null> {
    const userLogRepository = new UserLogRepository(
      this._userId,
      this.dbConnection,
    )
    const latest = await userLogRepository.findLatestAnswerLogSheetByExerciseId(
      this._exerciseId!,
    )
    if (!latest || latest.answerLogSheetId !== answerLogSheetId)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const userQuestionLog = latest.questionUserLogs.find(
      (q) => q.questionUserLogId === questionUserLogId,
    )
    if (!userQuestionLog)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const totalQuestions = latest.questionUserLogs.length

    // 問題集のトランザクション
    if (this._exerciseId) {
      // 一括採点の場合は実行NG
      if (latest.exercise?.isScoringBatch) {
        return {
          score: null,
          totalQuestions,
          isCorrect: null,
          totalCorrectCount: 0,
          totalIncorrectCount: 0,
          totalUnansweredCount: 0,
        }
      }

      // 回答済みの問題は採点登録処理を行わず、結果を返す（冪等性の実現のため）
      if (userQuestionLog.isAnswered) {
        return {
          score: userQuestionLog.score,
          totalQuestions,
          isCorrect: userQuestionLog.isCorrect,
          totalCorrectCount: latest.totalCorrectCount,
          totalIncorrectCount: latest.totalIncorrectCount,
          totalUnansweredCount: latest.totalUnansweredCount,
        }
      }

      // スキップが無効
      if (latest.exercise && !latest.exercise.isCanSkip) {
        if (answer.type === "SKIP")
          throw new ApiV1Error([
            { key: "ExerciseCannotSkipError", params: null },
          ])
      }

      // 回答を保存できないケース
      // * 都度採点で回答済み
      // * 一括採点で回答済み
      // if (!latest.exercise?.isScoringBatch) {}

      // 回答トランザクション
      const answerResult = await this.dbConnection.$transaction(async (t) => {
        userLogRepository.resetDbConnection(t)

        if (
          answer.type !== "SKIP" &&
          userQuestionLog.questionVersion.question.answerType !== answer.type
        )
          throw new ApiV1Error([
            { key: "InvalidFormatError", params: { key: "回答形式" } },
          ])

        this._checkAnswerFormat(
          userQuestionLog.questionVersion.question.questionType,
          userQuestionLog.questionVersion.question.answerType,
          answer,
          {
            minLength:
              userQuestionLog.questionVersion.questionAnswers[0].minLength ||
              undefined,
            maxLength:
              userQuestionLog.questionVersion.questionAnswers[0].maxLength ||
              undefined,
          },
        )

        return await this.saveUserAnswerLog(
          userLogRepository,
          latest.answerLogSheetId,
          userQuestionLog.questionUserLogId,
          answer,
        )
      })

      // 都度採点の場合は、採点を行う
      if (
        latest.exercise &&
        !latest.exercise.isScoringBatch &&
        answerResult?.questionUserLogId
      ) {
        const scoreResult = await this._scorePerAnswer(
          latest.answerLogSheetId,
          answerResult.questionUserLogId,
        )

        return {
          score: scoreResult.score,
          totalQuestions,
          isCorrect: scoreResult.isCorrect,
          totalCorrectCount: scoreResult.totalCorrectCount,
          totalIncorrectCount: scoreResult.totalIncorrectCount,
          totalUnansweredCount: scoreResult.totalUnansweredCount,
        }
      }

      return {
        score: answerResult?.score ?? 0,
        totalQuestions,
        isCorrect: null,
        totalCorrectCount: 0,
        totalIncorrectCount: 0,
        totalUnansweredCount: 0,
      }
    }

    return null
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

  // private async _scoreBatchAnswer(
  //   answerLogSheetId: string,
  // ): Promise<AnswerLogSheetBase> {
  //   return {
  //     isInProgress: false,
  //     totalCorrectCount: 0,
  //     totalIncorrectCount: 0,
  //     totalUnansweredCount: 0,
  //   }
  // }

  /**
   * 都度採点を行う
   */
  private async _scorePerAnswer(
    answerLogSheetId: string,
    questionUserLogId: string,
  ) {
    const result = await this.dbConnection.$transaction(async (t) => {
      const questionUserLog = await t.questionUserLog.findUnique({
        select: {
          userId: true,
          answerLogSheet: {
            select: { isInProgress: true },
          },
          questionVersion: {
            select: {
              question: {
                select: {
                  answerType: true,
                },
              },
              questionAnswers: {
                select: {
                  answerId: true,
                  isCorrect: true,
                  maxLength: true,
                  minLength: true,
                },
              },
            },
          },

          skipped: true,
          textAnswer: true,
          answerSelectUserLogs: {
            select: {
              selectAnswerId: true,
            },
          },
        },
        where: {
          answerLogSheetId,
          questionUserLogId,
        },
      })
      if (!questionUserLog) return undefined

      const userLogRepository = new UserLogRepository(questionUserLog.userId, t)

      // スキップされた問題
      if (questionUserLog.skipped) {
        const { totalCorrectCount, totalIncorrectCount, totalUnansweredCount } =
          await userLogRepository.updateTotalUnansweredCount(answerLogSheetId)
        return {
          score: 0,
          isCorrect: null,
          totalCorrectCount,
          totalIncorrectCount,
          totalUnansweredCount,
        }
      }

      const answerType = questionUserLog.questionVersion.question.answerType

      if (answerType === "SELECT" || answerType === "MULTI_SELECT") {
        // 採点処理
        const correctAnswers = questionUserLog.questionVersion.questionAnswers
          .filter((a) => a.isCorrect)
          .map((a) => a.answerId)
        const userAnswers = questionUserLog.answerSelectUserLogs.map(
          (a) => a.selectAnswerId,
        )
        if (correctAnswers.length !== userAnswers.length) return null

        const isAllCorrect = correctAnswers.every((correctAnswer) =>
          userAnswers.includes(correctAnswer),
        )

        // 採点結果を記録
        if (isAllCorrect) {
          const score = Math.floor(
            (userAnswers.length / correctAnswers.length) * 100,
          )
          // 正解数を更新する
          await userLogRepository.saveSelectQuestionScore(
            answerLogSheetId,
            questionUserLogId,
          )
          const {
            totalCorrectCount,
            totalIncorrectCount,
            totalUnansweredCount,
          } = await userLogRepository.updateTotalCorrectCount(answerLogSheetId)

          return {
            score,
            isCorrect: true,
            totalCorrectCount,
            totalIncorrectCount,
            totalUnansweredCount,
          }
        } else {
          // 不正解数を更新する
          const {
            totalCorrectCount,
            totalIncorrectCount,
            totalUnansweredCount,
          } = await userLogRepository.updateTotalIncorrectCount(
            answerLogSheetId,
          )

          return {
            score: 0,
            isCorrect: false,
            totalCorrectCount,
            totalIncorrectCount,
            totalUnansweredCount,
          }
        }
      }

      if (answerType === "TEXT") {
        // 未実装

        return {
          score: 0,
          isCorrect: null,
          totalCorrectCount: 0,
          totalIncorrectCount: 0,
          totalUnansweredCount: 0,
        }
      }

      return null
    })

    if (!result) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    return result
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
        // if (
        //   latest.questionUserLogs.every(
        //     (q) => q.answerUserLogs.length === 0 || q.skipped,
        //   )
        // ) {
        // }

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
