import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import {
  SchoolBase,
  SchoolBaseDate,
  SchoolBaseIdentity,
  SchoolRelateUserMember,
  SchoolRelateUserOwner,
} from "@/lib/types/base/schoolTypes"
import { DateUtility } from "../common/DateUtility"

type SchoolEntityType = SchoolBase &
  SchoolBaseIdentity &
  SchoolBaseDate &
  (SchoolRelateUserMember | SchoolRelateUserOwner)

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

  get isInLimit(): boolean {
    if (!("members" in this.value)) return false

    return this.value.members.some(
      (m) => m.limitAt === null || m.limitAt >= DateUtility.getNowDate(),
    )
  }
}
