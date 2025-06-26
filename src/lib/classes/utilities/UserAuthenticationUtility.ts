import { UserAccessSchoolMethod } from "@/lib/types/base/userTypes"
import { SchoolEntity } from "../entities/SchoolEntity"
import { UserEntity } from "../entities/UserEntity"
import { ApiV1Error } from "../common/ApiV1Error"

/**
 *  ユーザーの認証と権限チェックを行うユーティリティクラス
 */
export class UserAuthenticationUtility {
  /**
   * ユーザーの権限をチェックする。
   * エラーを投げるのではなく、booleanで結果を返す。
   * @param user  `UserEntity`
   * @param school `SchoolEntity` または `schoolId`
   * @param action `UserAccessSchoolMethod`
   * @returns
   */
  public static checkPermission(
    user: UserEntity,
    school: SchoolEntity | string,
    action: UserAccessSchoolMethod,
  ) {
    const accessMethods = this.getAccessSchoolMethod(user, school)
    return accessMethods.includes(action)
  }

  /**
   * ユーザーの権限をチェックする。
   *  エラーを投げる。
   * @param user  `UserEntity`
   * @param school `SchoolEntity` または `schoolId`
   * @param action `UserAccessSchoolMethod`
   * @returns
   * @throws ApiV1Error - RoleTypeError
   */
  public static checkPermissionWithThrow(
    user: UserEntity,
    school: SchoolEntity | string,
    action: UserAccessSchoolMethod,
  ) {
    const hasPermission = this.checkPermission(user, school, action)
    if (!hasPermission) {
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])
    }
    return hasPermission
  }

  /**
   * ユーザーが特定のスクールに対して持つ権限を取得する
   * @param user `UserEntity`
   * @param school `SchoolEntity` または `schoolId`
   * @returns ユーザーが持つ権限の配列
   */
  public static getAccessSchoolMethod(
    user: UserEntity,
    school: SchoolEntity | string,
  ) {
    const AllAccess: UserAccessSchoolMethod[] = [
      "read",
      "edit",
      "create",
      "publish",
      "delete",
    ]
    if (user.userRole === "ADMIN") return AllAccess

    if (user.ownSchools.length < 0) return []

    const schoolId = typeof school === "string" ? school : school.schoolId

    // セルフスクールならば全ての権限を付与する
    const selfSchool = user.ownSchools.find(
      (s) => s.schoolId === schoolId && s.isSelfSchool,
    )
    if (selfSchool?.isSelfSchool) return AllAccess

    // グローバルスクールならばReadのみ付与する
    const globalSchools = user.memberSchools.find(
      (s) => s.schoolId === schoolId && s.isGlobalSchool,
    )
    if (globalSchools) return ["read"]

    if (user.userRole === "USER") {
      // スクールのメンバーならばReadのみ付与する
      const accessible = user.memberSchools.find((s) => s.schoolId === schoolId)
      if (accessible) return ["read"]
    }

    if (user.userRole === "TEACHER") {
      return [] // 未対応
    }

    return []
  }
}
