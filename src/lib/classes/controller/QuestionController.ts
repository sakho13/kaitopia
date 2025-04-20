import {
  AnswerLogSheetBase,
  AnswerLogSheetBaseDate,
  AnswerLogSheetBaseIdentifier,
} from "@/lib/types/base/answerLogSheetTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ControllerBase } from "../common/ControllerBase"
import {
  QuestionBase,
  QuestionBaseDate,
  QuestionBaseStatus,
  QuestionVersionBase,
  QuestionVersionBaseIdentifier,
} from "@/lib/types/base/questionTypes"
import { AnswerLogRepository } from "../repositories/AnswerLogRepository"

export class QuestionController extends ControllerBase {
  private _schoolId: string | null = null
  private _answerLogSheet:
    | (AnswerLogSheetBaseIdentifier &
        AnswerLogSheetBase &
        AnswerLogSheetBaseDate)
    | null = null

  private _questionVersions: (QuestionVersionBaseIdentifier &
    QuestionVersionBase)[]

  private _questionBases: ({ questionId: string } & QuestionBase &
    QuestionBaseStatus &
    QuestionBaseDate)[] = []

  private _exerciseId: string | null = null

  public async loadQuestionsByExercise() {
    if (this._schoolId === null)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    // Logic to load questions by exercise will go here
  }

  /**
   * 回答中の問題を読み込む
   * @param userId
   * @param answerLogSheetId
   */
  public async loadQuestionsAndAnswersByAnswerLogSheetId(
    userId: string,
    answerLogSheetId: string,
  ) {
    const answerLogRepository = new AnswerLogRepository(this.dbConnection)
    const answerLogSheet = await answerLogRepository.findAnswerLogSheetById(
      userId,
      answerLogSheetId,
    )
    if (!answerLogSheet)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    this._answerLogSheet = {
      userId: answerLogSheet.userId,
      answerLogSheetId: answerLogSheet.answerLogSheetId,
      isInProgress: answerLogSheet.isInProgress,
      totalCorrectCount: answerLogSheet.totalCorrectCount,
      totalIncorrectCount: answerLogSheet.totalIncorrectCount,
      totalUnansweredCount: answerLogSheet.totalUnansweredCount,
      createdAt: answerLogSheet.createdAt,
      updatedAt: answerLogSheet.updatedAt,
    }

    if (answerLogSheet.exerciseId !== null)
      this._exerciseId = answerLogSheet.exerciseId

    //
  }

  public createQuestion() {
    if (this._schoolId === null)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
  }

  public editQuestion(identifiesr: QuestionVersionBaseIdentifier) {}

  public changeCurrentVersion() {}

  public set schoolId(schoolId: string) {
    if (schoolId.length < 1) throw new Error("schoolId is empty")

    this._schoolId = schoolId
  }

  // ********************************************
  //          PRIVATE methods
  // ********************************************

  // public get answerStatus() {
  //   return
  // }

  public get questionByType() {
    if (this._exerciseId !== null) return "EXERCISE"

    return "QUESTION"
  }
}
