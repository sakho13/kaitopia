import { PrismaClient } from "@prisma/client"

export class SchoolRepository {
  private dbConnection: PrismaClient

  constructor(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }

  public set resetDbConnection(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }

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
}
