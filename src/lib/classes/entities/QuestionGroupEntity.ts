import { EntityMutable } from "@/lib/interfaces/EntityMutable"

export type QuestionGroupEntityType = {
  schoolId: string
  questionGroupId: string
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export class QuestionGroupEntity extends EntityMutable<QuestionGroupEntityType> {
  constructor(value: QuestionGroupEntityType) {
    super(value)
  }

  public validate() {}
}
