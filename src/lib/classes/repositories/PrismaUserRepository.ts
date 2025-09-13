import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import { RepositoryBase } from "../common/RepositoryBase"
import { UserEntity } from "../entities/UserEntity"
import { DateUtility } from "../common/DateUtility"

export class PrismaUserRepository
  extends RepositoryBase
  implements IUserRepository
{
  async findByFirebaseUid(firebaseUid: string): Promise<UserEntity | null> {
    const [user, globalSchools] = await Promise.all([
      this.dbConnection.user.findFirst({
        where: {
          authProviders: {
            some: {
              externalId: firebaseUid,
              isActive: true,
            },
          },
        },
        include: {
          ownerSchools: {
            select: {
              school: true,
            },
            where: {
              OR: [
                {
                  school: { isSelfSchool: true },
                },
              ],
            },
          },
          memberSchools: {
            select: {
              school: true,
            },
            where: {
              OR: [
                {
                  limitAt: null,
                },
                {
                  limitAt: {
                    gte: DateUtility.getNowDate(),
                  },
                },
              ],
            },
          },
          authProviders: {
            where: {
              isActive: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      }),
      this.dbConnection.school.findMany({
        where: { isGlobal: true },
      }),
    ])

    if (!user) {
      return null
    }

    const memberSchools = [
      ...user.memberSchools.map(({ school }) => school),
      ...globalSchools,
    ]

    return new UserEntity({
      ...user,
      memberSchools,
      ownerSchools: user.ownerSchools.map(({ school }) => school),
      authProviders: user.authProviders || [],
    })
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.dbConnection.user.create({
      data: {
        firebaseUid: user.value.firebaseUid,
        name: user.value.name,
        email: user.value.email,
        phoneNumber: user.value.phoneNumber,
        role: user.value.role,
        isGuest: user.value.isGuest,
        authProviders: {
          create: {
            providerType: user.value.isGuest ? "FIREBASE_GUEST" : "FIREBASE_EMAIL",
            externalId: user.value.firebaseUid,
            isActive: true,
          },
        },
        ownerSchools: {
          create: {
            priority: 1,
            school: {
              create: {
                name: `${user.value.name}'s スクール`,
                description: "あなただけのスクールです",
                isSelfSchool: true,
                isGlobal: false,
                isPublic: false,
              },
            },
          },
        },
      },
      include: {
        memberSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              { school: { isGlobal: true } },
              {
                member: { firebaseUid: user.value.firebaseUid },
                limitAt: null,
              },
              {
                member: { firebaseUid: user.value.firebaseUid },
                limitAt: {
                  gte: DateUtility.getNowDate(),
                },
              },
            ],
          },
        },
        ownerSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              {
                school: { isSelfSchool: true },
                owner: {
                  firebaseUid: user.value.firebaseUid,
                },
              },
            ],
          },
        },
        authProviders: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })
    return new UserEntity({
      ...createdUser,
      memberSchools: createdUser.memberSchools.map(({ school }) => school),
      ownerSchools: createdUser.ownerSchools.map(({ school }) => school),
      authProviders: createdUser.authProviders || [],
    })
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: {
        name: user.value.name,
        email: user.value.email,
        phoneNumber: user.value.phoneNumber,
        role: user.value.role,
        birthDayDate: user.value.birthDayDate,
        isGuest: user.value.isGuest,
        updatedAt: DateUtility.getNowDate(),
      },
      include: {
        authProviders: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })
    return new UserEntity({
      ...updatedUser,
      memberSchools: user.memberSchools.map((s) => s.value),
      ownerSchools: user.ownSchools.map((s) => s.value),
      authProviders: updatedUser.authProviders || [],
    })
  }

  async delete(user: UserEntity): Promise<UserEntity> {
    const deletedUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: { deletedAt: DateUtility.getNowDate() },
      include: {
        authProviders: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })
    return new UserEntity({
      ...deletedUser,
      memberSchools: [],
      ownerSchools: [],
      authProviders: deletedUser.authProviders || [],
    })
  }

  async reRegister(user: UserEntity): Promise<UserEntity> {
    const reRegisteredUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: {
        deletedAt: null,
        updatedAt: DateUtility.getNowDate(),
      },
      include: {
        authProviders: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })
    return new UserEntity({
      ...reRegisteredUser,
      memberSchools: user.memberSchools.map((s) => s.value),
      ownerSchools: user.ownSchools.map((s) => s.value),
      authProviders: reRegisteredUser.authProviders || [],
    })
  }
}
