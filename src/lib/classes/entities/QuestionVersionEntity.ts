import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import {
  QuestionAnswerPropertyEdit,
  QuestionAnswerTypeType,
  QuestionTypeType,
} from "@/lib/types/base/questionTypes"

export type QuestionVersionEntityType = {
  questionId: string

  questionType: QuestionTypeType
  answerType: QuestionAnswerTypeType

  version: number
  content: string
  hint: string

  questionAnswers: {
    answerId: string

    selectContent: string | null
    isCorrect: boolean | null

    minLength: number | null
    maxLength: number | null
  }[]
}

export class QuestionVersionEntity extends EntityMutable<QuestionVersionEntityType> {
  constructor(value: QuestionVersionEntityType) {
    super(value)
  }

  public validate() {}

  public get answerType() {
    return this.value.answerType
  }

  public get propertyOfAnswer(): QuestionAnswerPropertyEdit[keyof QuestionAnswerPropertyEdit] {
    if (this.value.answerType === "TEXT") {
      return {
        property: {
          answerId: this.value.questionAnswers[0].answerId ?? "",
          maxLength: this.value.questionAnswers[0].maxLength ?? 0,
          minLength: this.value.questionAnswers[0].minLength ?? 0,
        },
      }
    }

    if (
      this.value.answerType === "SELECT" ||
      this.value.answerType === "MULTI_SELECT"
    ) {
      return {
        selection: this.value.questionAnswers.map((a) => ({
          answerId: a.answerId,
          isCorrect: a.isCorrect!,
          selectContent: a.selectContent!,
        })),
      }
    }

    throw new Error("Unsupported answer type")
  }
}
