import { School } from "./schoolTypes"

export type User = UserBaseInfo &
  UserBaseInfoOption &
  UserBaseIdentity &
  UserBaseDate &
  UserRelationSchools

export type UserBaseInfo = {
  name: string

  role: UserRoleType
}

export type UserBaseInfoOption = {
  birthDayDate: Date | null
}

export type UserBaseIdentity = {
  id: string

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
