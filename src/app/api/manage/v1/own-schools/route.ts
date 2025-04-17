import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理所有スクールの取得")

  return api.execute("GetManageOwnSchools", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const schools = await userService.getOwnSchools()

    return {
      schools: schools.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        isGlobal: s.isGlobal,
        isPublic: s.isPublic,
        isSelfSchool: s.isSelfSchool,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
    }
  })
}
