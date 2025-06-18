import { ISchoolRepository } from "@/lib/interfaces/ISchoolRepository"
import { RepositoryBase } from "../common/RepositoryBase"
import { UserEntity } from "../entities/UserEntity"
import { SchoolEntity } from "../entities/SchoolEntity"

export class PrismaSchoolRepository
  extends RepositoryBase
  implements ISchoolRepository
{
  async findBySchoolId(schoolId: string): Promise<SchoolEntity | null> {
    const school = await this.dbConnection.school.findUnique({
      where: { id: schoolId },
    })
    if (!school) {
      return null
    }
    return new SchoolEntity({ ...school, members: [], owners: [] })
  }

  async findOwnSchools(userId: string): Promise<SchoolEntity[]> {
    const schools = await this.dbConnection.school.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isGlobal: true,
        isPublic: true,
        isSelfSchool: true,
        createdAt: true,
        updatedAt: true,
        owners: {
          select: {
            priority: true,
          },
          where: {
            userId,
          },
        },
      },
      where: {
        owners: {
          some: {
            userId,
          },
        },
      },
    })
    return schools.map((school) => new SchoolEntity(school))
  }

  async findMemberSchools(userId: string): Promise<SchoolEntity[]> {
    const schools = await this.dbConnection.school.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isGlobal: true,
        isPublic: true,
        isSelfSchool: true,
        createdAt: true,
        updatedAt: true,
        members: {
          select: {
            limitAt: true,
          },
          where: {
            userId,
          },
        },
      },
      where: {
        OR: [
          {
            members: {
              every: {
                userId,
              },
            },
          },
          { isGlobal: true },
        ],
      },
    })
    return schools.map((school) => new SchoolEntity(school))
  }

  async createSelfSchool(user: UserEntity): Promise<SchoolEntity> {
    const createdSchool = await this.dbConnection.school.create({
      select: {
        id: true,
        name: true,
        description: true,
        isGlobal: true,
        isPublic: true,
        isSelfSchool: true,
        createdAt: true,
        updatedAt: true,
        owners: {
          select: {
            priority: true,
          },
        },
      },
      data: {
        name: `${user.value.name}のスクール`,
        description: "あなただけのスクールです",
        isSelfSchool: true,
        isGlobal: false,
        isPublic: true,
        owners: {
          create: {
            userId: user.value.id,
            priority: 1,
          },
        },
      },
    })
    return new SchoolEntity(createdSchool)
  }
}
