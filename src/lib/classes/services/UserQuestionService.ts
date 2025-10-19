import { $Enums } from "@prisma/client"
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
import { STATICS } from "@/lib/statics"

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
            questionGroups: [],
          })),
          answerLogSheetId: null,
        }
      }

      if (mode === "answer" || mode === "restart") {
        // ゲストユーザの上限チェック
        if (this.userController.isGuest) {
          const userLogRepository = new UserLogRepository(
            this._userId,
            this.dbConnection,
          )
          const count = await userLogRepository.countCompletedAnswerLogSheets()
          if (count >= STATICS.GUEST_LIMIT.EXERCISE_COUNT) {
            throw new ApiV1Error([
              {
                key: "ExerciseGuestLimitError",
                params: { limit: `${STATICS.GUEST_LIMIT.EXERCISE_COUNT}` },
              },
            ])
          }
        }

        const { questions, sheet, exercise } =
          await this._insertAnswerLogSheetAndPropertyByExercise(
            this._exerciseId,
          )
        return {
          questions: questions.map((q) => {
            const currentQuestionVersion = q.currentVersion
            const currentQuestionUserLog = sheet.questionUserLogs.find(
              (l) => l.questionId === q.id,
            )
            if (!currentQuestionVersion || !currentQuestionUserLog)
              throw new ApiV1Error([{ key: "NotFoundError", params: null }])

            const answer = this._convertQuestionAnswerProperty(
              {
                answerType: q.answerType,
                selectAnswerOrder: currentQuestionUserLog.selectAnswerOrder,
                questionAnswers: q.currentVersion!.questionAnswers,
              },
              {
                isScoringBatch: exercise.isScoringBatch,
                random: exercise.random,
              },
            )

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
              answer,
              questionGroups: [],
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
      if (latest.exercise?.isScoringBatch === true) {
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
      if (latest.exercise && latest.exercise.isCanSkip === false) {
        if (answer.type === "SKIP")
          throw new ApiV1Error([
            { key: "ExerciseCannotSkipError", params: null },
          ])
      }

      // 回答を保存できないケース(未実装)
      // * 都度採点で回答済み
      // * 一括採点で回答済み

      // 回答トランザクション
      const answerResult = await this.dbConnection.$transaction(async (t) => {
        userLogRepository.resetDbConnection(t)

        if (
          answer.type !== "SKIP" &&
          userQuestionLog.questionVersion.question.answerType !== answer.type
        ) {
          throw new ApiV1Error([
            { key: "InvalidFormatError", params: { key: "回答形式" } },
          ])
        }

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

        return await this._saveUserAnswerLog(
          userLogRepository,
          userQuestionLog.questionVersion.questionId,
          userQuestionLog.questionVersion.version,
          userQuestionLog.questionUserLogId,
          answer,
        )
      })

      // 都度採点の場合は、採点を行う
      if (
        !!latest.exercise &&
        latest.exercise.isScoringBatch === false &&
        !!answerResult?.questionUserLogId
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
   * 回答状態を固定/保存する
   */
  public async submitAnswerState(answerLogSheetId: string) {
    return await this.dbConnection.$transaction(async (t) => {
      const userLogRepository = new UserLogRepository(this._userId, t)
      const sheet = await userLogRepository.findAnswerLogSheetById(
        answerLogSheetId,
      )

      if (!sheet) throw new ApiV1Error([{ key: "NotFoundError", params: null }])
      const totalQuestion = sheet.questionUserLogs.length

      if (!sheet.isInProgress) {
        return {
          isInProgress: sheet.isInProgress,
          totalQuestion,
          totalCorrectCount: sheet.totalCorrectCount,
          totalIncorrectCount: sheet.totalIncorrectCount,
          totalUnansweredCount: sheet.totalUnansweredCount,
        }
      }

      const result = await userLogRepository.completeAnswerLogSheet(
        answerLogSheetId,
      )
      return {
        isInProgress: result.isInProgress,
        totalQuestion,
        totalCorrectCount: result.totalCorrectCount,
        totalIncorrectCount: result.totalIncorrectCount,
        totalUnansweredCount: result.totalUnansweredCount,
      }
    })
  }

  /**
   * 問題の回答履歴を一覧で取得する(進行中も含む)
   * @param limit
   * @param page
   * @returns
   */
  public async getAnswerLogSheets(limit: number = 10, page?: number) {
    const offset = page ? (page - 1) * limit : undefined
    const userLogRepository = new UserLogRepository(
      this._userId,
      this.dbConnection,
    )

    const answerLogSheets = await userLogRepository.findAllAnswerLogSheets(
      limit,
      offset,
    )
    const totalCount = await userLogRepository.countAllAnswerLogSheets()
    const nextPage = answerLogSheets.length < limit ? null : page ? page + 1 : 2

    return { answerLogSheets, totalCount, nextPage }
  }

  /**
   * 問題の回答履歴を取得する
   */
  public async getAnswerLogSheet(answerLogSheetId: string) {
    const userLogRepository = new UserLogRepository(
      this._userId,
      this.dbConnection,
    )

    const sheet = await userLogRepository.findAnswerLogSheetForResultById(
      answerLogSheetId,
    )
    if (!sheet) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    if (sheet.isInProgress) {
      throw new ApiV1Error([{ key: "ExerciseUnAnsweredError", params: null }])
    }

    return {
      isInProgress: sheet.isInProgress,
      totalQuestionCount: sheet._count.questionUserLogs,
      totalCorrectCount: sheet.totalCorrectCount,
      totalIncorrectCount: sheet.totalIncorrectCount,
      totalUnansweredCount: sheet.totalUnansweredCount,

      questionAnswerProperties: sheet.questionUserLogs.map((q) => {
        return {
          questionUserLogId: q.questionUserLogId,
          questionId: q.questionVersion.question.id,
          title: q.questionVersion.question.title,
          questionType: q.questionVersion.question.questionType,
          content: q.questionVersion.content,
          hint: q.questionVersion.hint,
          score: q.score,
          answerType: q.questionVersion.question.answerType,

          userAnswers: q.questionVersion.questionAnswers.map(
            ({ answerId, isCorrect }) => {
              const selectedAnswer = q.answerSelectUserLogs.find(
                (a) => a.selectAnswerId === answerId,
              )
              return {
                answerId: answerId,
                isCorrect: isCorrect === true,
                isSelected: !!selectedAnswer,
              }
            },
          ),

          answers: this._convertQuestionAnswerProperty({
            answerType: q.questionVersion.question.answerType,
            selectAnswerOrder: q.selectAnswerOrder,
            questionAnswers: q.questionVersion.questionAnswers.map((s) => ({
              answerId: s.answerId,
              selectContent: s.selectContent,
              minLength: s.minLength,
              maxLength: s.maxLength,
            })),
          }),
        }
      }),
      exercise: sheet.exercise,
      createdAt: sheet.createdAt,
      updatedAt: sheet.updatedAt,
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
  private async _saveUserAnswerLog(
    userLogRepository: UserLogRepository,
    questionId: string,
    version: number,
    userQuestionLogId: string,
    answer: QuestionAnswerContent,
  ) {
    if (answer.type === "SKIP") {
      return await userLogRepository.saveSkipQuestionLog(
        questionId,
        version,
        userQuestionLogId,
      )
    }

    if (answer.type === "SELECT" && "answerId" in answer) {
      await userLogRepository.deleteSelectQuestionLog(userQuestionLogId)
      return await userLogRepository.saveSelectQuestionLog(
        questionId,
        version,
        userQuestionLogId,
        [answer.answerId],
      )
    }

    if (answer.type === "MULTI_SELECT" && "answerIds" in answer) {
      await userLogRepository.deleteSelectQuestionLog(userQuestionLogId)
      return await userLogRepository.saveSelectQuestionLog(
        questionId,
        version,
        userQuestionLogId,
        answer.answerIds,
      )
    }

    if (answer.type === "TEXT" && "content" in answer) {
      return await userLogRepository.saveTextQuestionLog(
        questionId,
        version,
        userQuestionLogId,
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

        const isAllCorrect =
          correctAnswers.every((correctAnswer) =>
            userAnswers.includes(correctAnswer),
          ) &&
          userAnswers.every((userAnswer) => correctAnswers.includes(userAnswer))

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
   * @throws ゲストユーザの上限チェック `ExerciseGuestLimitError`
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

    // 既出なら過去分を削除して新しいものを作成する
    if (latest && !createNew && latest.exerciseId === exerciseId) {
      const userLogRepository = new UserLogRepository(
        this._userId,
        this.dbConnection,
      )
      await userLogRepository.resetAnswerLogSheetById(latest.answerLogSheetId)
    }

    // 使用していないため無視
    if (createNew) {
      if (latest && latest.questionUserLogs.length > 0) {
        // すでに存在し回答していない場合は再度作成する

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
        let questions = await userQuestionRepository.findQuestionsByExerciseId(
          exerciseId,
          false,
        )
        if (questions.length === 0)
          throw new ApiV1Error([{ key: "NotFoundError", params: null }])

        if (exercise.random) {
          // 出題順と選択肢をランダムに並び替える
          questions = questions.sort(() => Math.random() - 0.5)
          questions.forEach((a) => {
            if (
              a.currentVersion?.questionAnswers &&
              a.currentVersion?.questionAnswers.length > 0
            ) {
              a.currentVersion?.questionAnswers.sort(() => Math.random() - 0.5)
            }
          })
        }

        if (exercise.questionCount !== null) {
          questions = questions.slice(0, exercise.questionCount)
        }

        const userLogRepository = new UserLogRepository(this._userId, t)
        const sheet =
          await userLogRepository.createExerciseAnswerLogSheetByQuestions(
            exerciseId,
            questions.map((q) => ({
              questionId: q.id,
              version: q.currentVersionId!,
              answerIds:
                q.currentVersion?.questionAnswers.map((a) => a.answerId!) || [],
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
          if (!("answerIds" in answer)) throw new Error("InvalidFormatError")

          if (!Array.isArray(answer.answerIds))
            throw new Error("InvalidFormatError")
          if (answer.answerIds.length < 1) throw new Error("InvalidFormatError")
          if (
            answer.answerIds.some((a) => typeof a !== "string" || a.length < 1)
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

  private _convertQuestionAnswerProperty<
    CQ extends {
      answerType: $Enums.AnswerType
      selectAnswerOrder: string[]
      questionAnswers: T1[]
    },
    T1 extends {
      answerId: string
      selectContent: string | null
      minLength: number | null
      maxLength: number | null
    },
  >(
    currentQuestion: CQ,
    ext?: Partial<{ isScoringBatch: boolean; random: boolean }>,
  ): QuestionAnswerForUser<QuestionAnswerTypeType> {
    const answerType = currentQuestion.answerType
    if (answerType === "TEXT") {
      const a = currentQuestion.questionAnswers[0]
      return {
        property: {
          answerId: a.answerId!,
          maxLength: a.maxLength ?? 0,
          minLength: a.minLength ?? 0,
        },
      }
    }

    if (["SELECT", "MULTI_SELECT"].includes(answerType)) {
      const selection = currentQuestion.selectAnswerOrder.reduce((p, c) => {
        const a = currentQuestion.questionAnswers.find((a) => a.answerId === c)
        if (a) {
          return [
            ...p,
            {
              answerId: a.answerId!,
              selectContent: a.selectContent!,
            },
          ]
        }
        return p
      }, [] as { answerId: string; selectContent: string }[])

      if (ext?.isScoringBatch === false) {
        // 都度採点の場合は選択肢をランダムに並び替える
        if (ext.random === true) {
          selection.sort(() => Math.random() - 0.5)
        }
      }
      return {
        selection,
      }
    }

    return {
      property: {
        answerId: "",
        maxLength: 0,
        minLength: 0,
      },
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
