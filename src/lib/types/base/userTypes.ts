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

export type UserBaseManageOption = {
  isGuest: boolean
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

export const UserAccessSchoolMethodMap = {
  /** 読み取り */
  READ: "read",
  /** 作成 */
  CREATE: "create",
  /** 編集 */
  EDIT: "edit",
  /** 公開設定変更 */
  PUBLISH: "publish",
  /** 削除 */
  DELETE: "delete",
} as const

/**
 * read: 読み取り
 * create: 作成
 * edit: 編集
 * publish: 公開設定変更
 * delete: 削除
 */
export type UserAccessSchoolMethod =
  (typeof UserAccessSchoolMethodMap)[keyof typeof UserAccessSchoolMethodMap]

/**
 * ユーザ履歴のアクション
 */
export const UserHistoryActionMap = {
  /** ユーザがアプリを退会した */
  QUIT: "QUIT",
  /** ユーザがアプリを再度利用開始した */
  RE_JOIN: "RE_JOIN",
} as const

export type UserHistoryActionType =
  (typeof UserHistoryActionMap)[keyof typeof UserHistoryActionMap]
