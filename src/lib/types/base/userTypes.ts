import { School } from "./schoolTypes"

export type User = UserBaseInfo &
  UserBaseInfoOption &
  UserBaseIdentity &
  UserBaseDate &
  UserRelationSchools

/**
 * 編集可能なユーザ情報項目
 */
export type EditableUserInfo = Omit<UserBaseInfo, "role"> & UserBaseInfoOption

export type UserBaseInfo = {
  name: string
  email: string | null
  phoneNumber: string | null

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
  memberSchools: School[]
}

/**
 * read: 読み取り
 * create: 作成
 * edit: 編集
 * publish: 公開設定変更
 * delete: 削除
 */
export type UserAccessSchoolMethod =
  | "read"
  | "create"
  | "edit"
  | "publish"
  | "delete"
