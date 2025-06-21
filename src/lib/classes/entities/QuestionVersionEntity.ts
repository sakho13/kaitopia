import { EntityMutable } from "@/lib/interfaces/EntityMutable"


export type QuestionVersionEntityType = {
  questionId: string
  version: number
  content: string
  hint: string
}

export class QuestionVersionEntity extends EntityMutable<QuestionVersionEntityType> {
  constructor(value: QuestionVersionEntityType) {
    super(value)
  }

  public validate() {}
}
