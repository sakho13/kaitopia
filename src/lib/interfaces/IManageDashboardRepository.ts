import { SchoolEntity } from "../classes/entities/SchoolEntity"

/**
 * スクールは管理画面上でのみユーザへ意識させる存在
 */
export interface IManageDashboardRepository {
  countUserCount(): Promise<number>
  countUserCountInSchool(school: SchoolEntity): Promise<number>

  countActiveUserCount(): Promise<number>
  countActiveUserCountInSchool(school: SchoolEntity): Promise<number>

  countGuestUserCount(): Promise<number>
  countGuestUserCountInSchool(school: SchoolEntity): Promise<number>

  countQuestionCount(): Promise<number>
  countQuestionCountInSchool(school: SchoolEntity): Promise<number>

  countExerciseCount(): Promise<number>
  countExerciseCountInSchool(school: SchoolEntity): Promise<number>
}
