import { SchoolEntity } from "../classes/entities/SchoolEntity"
import { UserEntity } from "../classes/entities/UserEntity"

/**
 * スクールは管理画面上でのみユーザへ意識させる存在
 */
export interface ISchoolRepository {
  findBySchoolId(schoolId: string): Promise<SchoolEntity | null>

  findOwnSchools(userId: string): Promise<SchoolEntity[]>

  /**
   * メンバーとして所属しているスクールとグローバルスクールを取得する
   */
  findMemberSchools(userId: string): Promise<SchoolEntity[]>

  // create(school: SchoolEntity): Promise<SchoolEntity>

  /**
   * セルフスクールを作成し、そのスクールにユーザを関連付ける
   */
  createSelfSchool(user: UserEntity): Promise<SchoolEntity>

  // save(school: SchoolEntity): Promise<SchoolEntity>
}
