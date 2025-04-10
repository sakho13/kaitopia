import { School } from "./schoolTypes"

export type User = UserBase &
  UserBaseIdentity &
  UserBaseDate &
  UserRelationSchools

export type UserBase = {
  id: string

  name: string
  birthDayDate: Date

  role: UserRoleType
}

export type UserBaseIdentity = {
  firebaseUid: string
}

export type UserBaseDate = {
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export const UserRole = {
  USER: "USER",
  MODERATOR: "MODERATOR",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
} as const

export type UserRoleType = keyof typeof UserRole

export type UserRelationSchools = {
  ownerSchools: School[]
}
