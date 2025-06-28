import {
  QuestionAnswerPropertyEdit,
  QuestionAnswerTypeType,
  QuestionTypeType,
} from "@/lib/types/base/questionTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { ServiceBase } from "../common/ServiceBase"
import { ManageQuestionRepository } from "../repositories/ManageQuestionRepository"
import { IgnoreKeysObject } from "@/lib/types/common/IgnoreKeysObject"
import { UserEntity } from "../entities/UserEntity"
import { UserAuthenticationUtility } from "../utilities/UserAuthenticationUtility"

/**
 * 管理画面にて行う問題操作を行うサービスクラス
 */
export class ManageQuestionService extends ServiceBase {
  private _exerciseId: string | null = null

  constructor(...args: ConstructorParameters<typeof ServiceBase>) {
    super(...args)
  }

  public async getQuestionDetail(user: UserEntity, questionId: string) {
    const question = await this.dbConnection.question.findUnique({
      select: {
        schoolId: true,
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
            questionAnswers: true,
          },
        },
      },
      where: {
        id: questionId,
      },
    })

    if (!question) {
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    }

    UserAuthenticationUtility.checkPermissionWithThrow(
      user,
      question.schoolId,
      "read",
    )

    return question
  }

  /**
   * 問題集に紐づく問題を作成する
   * ※編集中バージョンも作成する
   */
  public async createQuestionWithExercise<A extends QuestionAnswerTypeType>(
    user: UserEntity,
    schoolId: string,
    data: {
      title: string
      questionType: QuestionTypeType
      answerType: A
      questionProperty: {
        content: string
        hint: string
      }
      questionAnswerProperty: IgnoreKeysObject<
        QuestionAnswerPropertyEdit[A],
        "answerId"
      >
    },
  ) {
    const exerciseId = this._exerciseId
    if (exerciseId === null) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集ID" } },
      ])
    }

    UserAuthenticationUtility.checkPermissionWithThrow(user, schoolId, "create")

    const createdQuestion = await this.dbConnection.$transaction(async (t) => {
      const questionRepository = new ManageQuestionRepository(t)
      const created = await questionRepository.createQuestion(
        schoolId,
        data.title,
        data.questionType,
        data.answerType,
      )

      const questionId = created.id
      await questionRepository.relateQuestionToExercise(created.id, exerciseId)

      // 問題のプロパティを作成
      await questionRepository.createNewVersion(questionId, 1, {
        content: data.questionProperty.content,
        hint: data.questionProperty.hint,
      })
      if ("selection" in data.questionAnswerProperty) {
        await questionRepository.createQuestionAnswer(
          questionId,
          1,
          data.questionAnswerProperty.selection.map((s) => ({
            selectContent: s.selectContent,
            isCorrect: s.isCorrect,
          })),
        )
      }
      if ("property" in data.questionAnswerProperty) {
        const { maxLength, minLength } = data.questionAnswerProperty.property
        await questionRepository.createQuestionAnswer(questionId, 1, [
          {
            minLength,
            maxLength,
          },
        ])
      }
      await questionRepository.changeDraftVersion(
        questionId,
        1, // 最初のバージョンをドラフトに設定
      )
      return created
    })

    return createdQuestion
  }

  // public async editQuestion(questionId: string, version: number) {}

  public async deleteQuestion(
    user: UserEntity,
    schoolId: string,
    questionId: string,
  ) {
    UserAuthenticationUtility.checkPermissionWithThrow(user, schoolId, "delete")

    const deleted = await this.dbConnection.$transaction(async (t) => {
      const questionRepository = new ManageQuestionRepository(t)
      return await questionRepository.deleteQuestion(questionId)
    })

    return deleted
  }

  /**
   * 新しい編集中バージョンを作成する
   */
  public async addNewQuestionVersion(user: UserEntity, questionId: string) {
    await this.dbConnection.$transaction(async (t) => {
      const questionRepository = new ManageQuestionRepository(t)
      const question = await questionRepository.getQuestionDetails(questionId)
      if (!question) {
        throw new ApiV1Error([{ key: "NotFoundError", params: null }])
      }

      UserAuthenticationUtility.checkPermissionWithThrow(
        user,
        question.schoolId,
        "edit",
      )

      //
    })

    //
  }

  /**
   * 公開バージョンを変更する
   */
  public async changeCurrentVersion(
    user: UserEntity,
    questionId: string,
    newVersionData: number,
  ) {
    const result = await this.dbConnection.$transaction(async (t) => {
      const questionRepository = new ManageQuestionRepository(t)
      const questionVersion = await questionRepository.getQuestionVersion(
        questionId,
        newVersionData,
      )
      if (!questionVersion) {
        throw new ApiV1Error([{ key: "NotFoundError", params: null }])
      }

      UserAuthenticationUtility.checkPermissionWithThrow(
        user,
        questionVersion.question.schoolId,
        "edit",
      )

      return await questionRepository.changeCurrentVersion(
        questionId,
        newVersionData,
      )
    })

    return result
  }

  public set exerciseId(exerciseId: string) {
    this._exerciseId = exerciseId
  }
}
