import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ取得")

  return await api.execute("GetUser", async () => {
    await api.authorize(request)

    const userService = new UserService(prisma)
    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    return {
      user: {
        id: user.id,
        name: user.name,
        birthDayDate: user.birthDayDate.toISOString(),
        role: user.role,
      },
    }
  })
}

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ登録")
  // ログインのタイミングに必ず実行される
  // ケース１：ユーザ登録
  // ケース２：ユーザ存在確認

  return await api.execute("RegisterUser", async () => {
    await api.authorize(request)

    return {
      state: "register",
      user: {
        id: "",
        name: "ユーザ名",
        birthDayDate: new Date().toISOString(),
        role: "USER",
      },
    }
  })
}
