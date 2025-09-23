import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserEntity } from "@/lib/classes/entities/UserEntity"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { UserService } from "@/lib/classes/services/UserService"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ登録")
  // ログインのタイミングに必ず実行される
  // ケース１：ユーザ登録
  // ケース２：ユーザ存在確認
  // ケース３：再ログイン

  return await api.execute("PostUserLogin", async () => {
    const { user, authProvider } = await api.authorize(request)

    const userService = new UserService(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )

    if (user && !user.isDeleted) {
      return {
        state: "login",
        user: {
          id: user.userId,
          name: user.value.name,
          email: user.value.email,
          phoneNumber: user.value.phoneNumber,
          birthDayDate: user.birthDayString,
          role: user.userRole,
        },
        isGuest: user.isGuestByAuthProvider,
      }
    }

    if (user && user.isDeleted) {
      // ユーザが削除されている場合の処理
      const body = await request.json()
      if (!("quitCode" in body) || typeof body.quitCode !== "string") {
        throw new ApiV1Error([
          {
            key: "DeletedUserError",
            params: null,
          },
        ])
      }

      // 退会コードが一致するか確認
      const reRegisteredUser = await userService.reRegisterUser(
        user,
        body.quitCode,
      )

      return {
        state: "re-register",
        user: {
          id: reRegisteredUser.userId,
          name: reRegisteredUser.username,
          email: reRegisteredUser.value.email,
          phoneNumber: reRegisteredUser.value.phoneNumber,
          birthDayDate: reRegisteredUser.birthDayString,
          role: reRegisteredUser.value.role,
        },
        isGuest: reRegisteredUser.isGuestByAuthProvider,
      }
    }

    // ユーザ登録

    const newUser = await userService.registerUserInfo(
      UserEntity.createNew({
        firebaseUid: authProvider.externalId,
        name: "",
        email: authProvider.authProperty.email,
        phoneNumber: authProvider.authProperty.phoneNumber ?? null,
        role: "USER",
        birthDayDate: null, // 初期値はnull
      }),
      authProvider,
    )

    return {
      state: "register",
      user: {
        id: newUser.userId,
        name: newUser.username,
        email: newUser.value.email,
        phoneNumber: newUser.value.phoneNumber,
        birthDayDate: newUser.birthDayString,
        role: newUser.userRole,
      },
      isGuest: newUser.isGuestByAuthProvider,
    }
  })
}
