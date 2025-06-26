import { IUserRepository } from "@/lib/interfaces/IUserRepository"
import { RepositoryBase } from "../common/RepositoryBase"
import { UserEntity } from "../entities/UserEntity"
import { DateUtility } from "../common/DateUtility"

export class PrismaUserRepository
  extends RepositoryBase
  implements IUserRepository
{
  async findByFirebaseUid(firebaseUid: string): Promise<UserEntity | null> {
    const user = await this.dbConnection.user.findUnique({
      where: { firebaseUid },
      include: {
        ownerSchools: {
          select: {
            school: true,
          },
          where: {
            OR: [
              {
                school: { isSelfSchool: true },
                owner: { firebaseUid },
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
              { school: { isGlobal: true } },
              {
                member: { firebaseUid },
                limitAt: null,
              },
              {
                member: { firebaseUid },
                limitAt: {
                  gte: DateUtility.getNowDate(),
                },
              },
            ],
          },
        },
      },
    })
    if (!user) {
      return null
    }
    return new UserEntity({
      ...user,
      memberSchools: user.memberSchools.map(({ school }) => school),
      ownerSchools: user.ownerSchools.map(({ school }) => school),
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
      },
    })
    return new UserEntity({
      ...createdUser,
      memberSchools: createdUser.memberSchools.map(({ school }) => school),
      ownerSchools: createdUser.ownerSchools.map(({ school }) => school),
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
      },
    })
    return new UserEntity({
      ...updatedUser,
      memberSchools: user.memberSchools.map((s) => s.value),
      ownerSchools: user.ownSchools.map((s) => s.value),
    })
  }

  async delete(user: UserEntity): Promise<UserEntity> {
    const deletedUser = await this.dbConnection.user.update({
      where: { id: user.value.id },
      data: { deletedAt: new Date() },
    })
    return new UserEntity({
      ...deletedUser,
      memberSchools: [],
      ownerSchools: [],
    })
  }
}
