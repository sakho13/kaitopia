import { User } from "./userTypes"

export type School = SchoolBase & SchoolBaseDate & SchoolRelationUser

export type SchoolBase = {
  id: string
  name: string
  description: string

  isSelfSchool: boolean
  isPublic: boolean
  isGlobal: boolean
}

export type SchoolBaseDate = {
  createdAt: Date
  updatedAt: Date
}

export type SchoolRelationUser = {
  owners: User[]
}
