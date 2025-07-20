import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserEntity } from "@/lib/classes/entities/UserEntity"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { DateUtility } from "@/lib/classes/common/DateUtility"

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ登録")
  // ログインのタイミングに必ず実行される
  // ケース１：ユーザ登録
  // ケース２：ユーザ存在確認
  // ケース３：再ログイン

  return await api.execute("PostUserLogin", async () => {
    const { email, phoneNumber } = await api.authorize(request)

    const userService = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )

    const user = await userService.getUserInfo(api.getFirebaseUid())

    if (user && !user.isDeleted) {
      return {
        state: "login",
        user: {
          id: user.userId,
          name: user.value.name,
          email: user.value.email,
          phoneNumber: user.value.phoneNumber,
          birthDayDate: user.value.birthDayDate
            ? user.value.birthDayDate.toISOString()
            : null,
          role: user.value.role,
        },
        isGuest: user.isGuest,
      }
    }

    if (user && user.isDeleted) {
      // ユーザが削除されている場合の処理
    }

    // ユーザ登録

    // ユーザ名はランダムで生成する(今後、ログイン時に登録するようにする)
    const userName = `user-${Math.floor(Math.random() * 10000)}`
    const isGuest = await api.isGuest()

    const newUser = await userService.registerUserInfo(
      new UserEntity({
        firebaseUid: api.getFirebaseUid(),
        id: "", // IDは自動生成されるため空文字
        name: userName,
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        role: "USER",
        birthDayDate: null, // 初期値はnull
        createdAt: DateUtility.getNowDate(),
        updatedAt: DateUtility.getNowDate(),
        deletedAt: null,
        isGuest,
        memberSchools: [],
        ownerSchools: [],
      }),
    )

    return {
      state: "register",
      user: {
        id: newUser.userId,
        name: newUser.value.name,
        email: newUser.value.email,
        phoneNumber: newUser.value.phoneNumber,
        birthDayDate: newUser.value.birthDayDate
          ? newUser.value.birthDayDate.toISOString()
          : null,
        role: newUser.value.role,
      },
      isGuest: newUser.isGuest,
    }
  })
}
