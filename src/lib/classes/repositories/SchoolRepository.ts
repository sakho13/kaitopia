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

  public async findMemberSchools(userId: string) {
    return await this.dbConnection.school.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isGlobal: true,
        isPublic: true,
        isSelfSchool: false,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        members: {
          every: {
            userId,
            OR: [{ limitAt: null }, { limitAt: { gte: new Date() } }],
          },
        },
      },
    })
  }

  /**
   * スクールを作成し、そのスクールにユーザを関連付ける
   */
  public async createSelfSchool(userId: string, userName: string) {
    return await this.dbConnection.school.create({
      data: {
        name: `${userName}'s スクール`,
        description: "あなただけのスクールです",
        isSelfSchool: true,
        isGlobal: false,
        isPublic: false,
        owners: {
          create: {
            userId,
          },
        },
      },
    })
  }
}
