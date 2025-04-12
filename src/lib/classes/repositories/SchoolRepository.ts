import { PrismaClient } from "@prisma/client"

export class SchoolRepository {
  constructor(private dbConnection: PrismaClient) {}

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
