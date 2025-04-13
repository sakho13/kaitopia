import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理所有スクールの取得")

  return api.execute("GetManageOwnSchools", async () => {
    const {} = await api.checkAccessManagePage(request)

    return {
      schools: [],
    }
  })
}
