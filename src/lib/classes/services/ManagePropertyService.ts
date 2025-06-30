import { PrismaClient } from "@prisma/client"
import { ApiV1Error } from "../common/ApiV1Error"
import { UserEntity } from "../entities/UserEntity"
import { UserAuthenticationUtility } from "../utilities/UserAuthenticationUtility"
import { ISchoolRepository } from "@/lib/interfaces/ISchoolRepository"
import { IManageDashboardRepository } from "@/lib/interfaces/IManageDashboardRepository"

export class ManagePropertyService {
  constructor(
    private readonly _dbConnection: PrismaClient,
    private readonly _schoolRepo: ISchoolRepository,
    private readonly _manageDashboardRepo: IManageDashboardRepository,
  ) {}

  async getDashboardInfo(user: UserEntity, schoolId: string | null) {
    if (user.isAdmin && schoolId === null) {
      const totalUserCount = await this._manageDashboardRepo.countUserCount()
      const totalActiveUserCount =
        await this._manageDashboardRepo.countActiveUserCount()
      const totalGuestUserCount =
        await this._manageDashboardRepo.countGuestUserCount()
      const totalQuestionCount =
        await this._manageDashboardRepo.countQuestionCount()
      const totalExerciseCount =
        await this._manageDashboardRepo.countExerciseCount()

      return {
        totalUserCount,
        totalActiveUserCount,
        totalGuestUserCount,
        totalQuestionCount,
        totalExerciseCount,
      }
    }

    if (schoolId === null) {
      throw new ApiV1Error([
        {
          key: "RequiredValueError",
          params: { key: "スクールID" },
        },
      ])
    }

    const school = await this._schoolRepo.findBySchoolId(schoolId)
    if (!school) {
      throw new ApiV1Error([
        {
          key: "NotFoundError",
          params: null,
        },
      ])
    }

    UserAuthenticationUtility.checkPermissionWithThrow(user, school, "read")

    const totalUserCount =
      await this._manageDashboardRepo.countUserCountInSchool(school)
    const totalActiveUserCount =
      await this._manageDashboardRepo.countActiveUserCountInSchool(school)
    const totalGuestUserCount =
      await this._manageDashboardRepo.countGuestUserCountInSchool(school)
    const totalQuestionCount =
      await this._manageDashboardRepo.countQuestionCountInSchool(school)
    const totalExerciseCount =
      await this._manageDashboardRepo.countExerciseCountInSchool(school)

    return {
      totalUserCount,
      totalActiveUserCount,
      totalGuestUserCount,
      totalQuestionCount,
      totalExerciseCount,
    }
  }
}
