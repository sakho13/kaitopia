import { RepositoryBase } from "../common/RepositoryBase"

export class SchoolRepository extends RepositoryBase {
  public async findSchoolById(schoolId: string) {
    return await this.dbConnection.school.findFirst({
      select: {
        id: true,
        name: true,
        description: true,
        isGlobal: true,
        isPublic: true,
        isSelfSchool: true,
      },
      where: {
        id: schoolId,
      },
    })
  }

  public async findOwnSchools(userId: string) {
    return await this.dbConnection.school.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isGlobal: true,
        isPublic: true,
        isSelfSchool: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        owners: {
          every: {
            userId,
          },
        },
      },
    })
  }
}
