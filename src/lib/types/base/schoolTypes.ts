import { User } from "./userTypes"

export type School = SchoolBase &
  SchoolBaseIdentity &
  SchoolBaseDate &
  SchoolRelationUser

export type SchoolBase = {
  name: string
  description: string

  isSelfSchool: boolean
  isPublic: boolean
  isGlobal: boolean
}

export type SchoolBaseIdentity = {
  id: string
}

export type SchoolBaseDate = {
  createdAt: Date
  updatedAt: Date
}

export type SchoolRelationUser = {
  owners: User[]
}

export type SchoolRelateUserMember = {
  members: {
    limitAt: Date | null
  }[]
}

export type SchoolRelateUserOwner = {
  owners: {
    priority: number
  }[]
}
