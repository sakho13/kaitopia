import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ登録")
  // ログインのタイミングに必ず実行される
  // ケース１：ユーザ登録
  // ケース２：ユーザ存在確認

  return await api.execute("RegisterUser", async () => {
    await api.authorize(request)

    const userService = new UserService(prisma)

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
