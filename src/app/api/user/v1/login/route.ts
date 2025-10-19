import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ登録")
  // ログインのタイミングに必ず実行される
  // ケース１：ユーザ登録
  // ケース２：ユーザ存在確認

  return await api.execute("PostUserLogin", async () => {
    const { email, phoneNumber } = await api.authorize(request)

    const userService = new UserService(prisma)

    const userInfo = await userService.getUserInfo(api.getFirebaseUid())
    const isGuest = await api.isGuest()

    if (userInfo) {
      return {
        state: "login",
        user: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          birthDayDate: userInfo.birthDayDate
            ? userInfo.birthDayDate.toISOString()
            : null,
          role: userInfo.role,
        },
        isGuest,
      }
    }

    // ユーザ登録

    // ユーザ名はランダムで生成する(今後、ログイン時に登録するようにする)
    const userName = `user-${Math.floor(Math.random() * 10000)}`

    const user = await userService.registerUserInfo(
      api.getFirebaseUid(),
      isGuest,
      {
        name: userName,
        role: "USER",
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
      },
    )

    return {
      state: "register",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthDayDate: user.birthDayDate
          ? user.birthDayDate.toISOString()
          : null,
        role: user.role,
      },
      isGuest,
    }
  })
}
