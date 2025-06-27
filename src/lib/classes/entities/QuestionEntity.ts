import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import { STATICS } from "@/lib/statics"
import {
  QuestionAnswerTypeType,
  QuestionTypeType,
} from "@/lib/types/base/questionTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { QuestionVersionEntity } from "./QuestionVersionEntity"

export type QuestionEntityType = {
  questionId: string
  schoolId: string
  title: string
  questionType: QuestionTypeType
  answerType: QuestionAnswerTypeType
  currentVersion: number | null
  draftVersion: number | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  versions: QuestionVersionEntity[]
}

export class QuestionEntity extends EntityMutable<QuestionEntityType> {
  constructor(value: QuestionEntityType) {
    super(value)
  }

  public validate() {
    if (
      this.value.title.length < STATICS.VALIDATE.QUESTION_TITLE.MIN_LENGTH ||
      this.value.title.length > STATICS.VALIDATE.QUESTION_TITLE.MAX_LENGTH
    ) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題タイトル" } },
      ])
    }
  }
}
