import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理所有スクールの取得")

  return await api.execute("GetManageOwnSchools", async () => {
    const { user } = await api.checkAccessManagePage(request)

    /**
     * 初期表示するスクールID(未実装)
     *
     * セルフスクールを優先する
     *
     * ROLEがADMINの場合には、グローバルスクールで更新日時が新しいものを優先する
     */
    // const initSchoolId = userService.isAdmin ? "" : ""

    return {
      schools: user.ownSchools.map((s) => ({
        id: s.schoolId,
        name: s.schoolName,
        description: s.schoolDescription,
        isGlobal: s.value.isGlobal,
        isPublic: s.value.isPublic,
        isSelfSchool: s.value.isSelfSchool,
        createdAt: s.value.createdAt.toISOString(),
        updatedAt: s.value.updatedAt.toISOString(),
      })),
    }
  })
}
