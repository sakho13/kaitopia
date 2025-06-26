import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import {
  SchoolBase,
  SchoolBaseDate,
  SchoolBaseIdentity,
} from "@/lib/types/base/schoolTypes"

type SchoolEntityType = SchoolBase & SchoolBaseIdentity & SchoolBaseDate

export class SchoolEntity extends EntityMutable<SchoolEntityType> {
  constructor(value: SchoolEntityType) {
    super(value)
  }

  public validate() {}

  get schoolId(): string {
    return this.value.id
  }

  get isSelfSchool(): boolean {
    return this.value.isSelfSchool
  }

  get isGlobalSchool(): boolean {
    return this.value.isGlobal && this.value.isPublic
  }
}
