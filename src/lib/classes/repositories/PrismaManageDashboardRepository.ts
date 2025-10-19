import { RepositoryBase } from "../common/RepositoryBase"
import { SchoolEntity } from "../entities/SchoolEntity"
import { IManageDashboardRepository } from "@/lib/interfaces/IManageDashboardRepository"

export class PrismaManageDashboardRepository
  extends RepositoryBase
  implements IManageDashboardRepository
{
  async countUserCount(): Promise<number> {
    return await this.dbConnection.user.count()
  }

  async countUserCountInSchool(school: SchoolEntity): Promise<number> {
    return await this.dbConnection.user.count({
      where: {
        OR: [
          {
            memberSchools: {
              every: {
                schoolId: school.schoolId,
              },
            },
          },
          {
            ownerSchools: {
              every: {
                schoolId: school.schoolId,
              },
            },
          },
        ],
      },
    })
  }

  async countActiveUserCount(): Promise<number> {
    return await this.dbConnection.user.count({
      where: {
        deletedAt: null,
      },
    })
  }

  async countActiveUserCountInSchool(school: SchoolEntity): Promise<number> {
    return await this.dbConnection.user.count({
      where: {
        AND: [
          {
            deletedAt: null,
          },
          {
            OR: [
              {
                memberSchools: {
                  every: {
                    schoolId: school.schoolId,
                  },
                },
              },
              {
                ownerSchools: {
                  every: {
                    schoolId: school.schoolId,
                  },
                },
              },
            ],
          },
        ],
      },
    })
  }

  async countGuestUserCount(): Promise<number> {
    return await this.dbConnection.user.count({
      where: {
        deletedAt: null,
        isGuest: true,
      },
    })
  }

  async countGuestUserCountInSchool(school: SchoolEntity): Promise<number> {
    return await this.dbConnection.user.count({
      where: {
        AND: [
          {
            deletedAt: null,
            isGuest: true,
          },
          {
            OR: [
              {
                memberSchools: {
                  every: {
                    schoolId: school.schoolId,
                  },
                },
              },
              {
                ownerSchools: {
                  every: {
                    schoolId: school.schoolId,
                  },
                },
              },
            ],
          },
        ],
      },
    })
  }

  async countQuestionCount(): Promise<number> {
    return await this.dbConnection.question.count()
  }

  async countQuestionCountInSchool(school: SchoolEntity): Promise<number> {
    return await this.dbConnection.question.count({
      where: {
        schoolId: school.schoolId,
      },
    })
  }

  async countExerciseCount(): Promise<number> {
    return await this.dbConnection.exercise.count()
  }

  async countExerciseCountInSchool(school: SchoolEntity): Promise<number> {
    return await this.dbConnection.exercise.count({
      where: {
        schoolId: school.schoolId,
      },
    })
  }
}
