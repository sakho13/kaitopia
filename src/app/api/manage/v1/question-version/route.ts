import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { prisma } from "@/lib/prisma"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"
import { PrismaQuestionRepository } from "@/lib/classes/repositories/PrismaQuestionRepository"
import { ManageQuestionService2 } from "@/lib/classes/services/ManageQuestionService2"

export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("アクティブバージョン更新")

  return api.execute("PatchManageQuestionVersion", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const body = await request.json()
    const { error, result } = validatePatch(body)
    if (error) throw error

    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const questionRepository = new PrismaQuestionRepository(prisma)
    const service = new ManageQuestionService2(questionRepository)

    const question = await service.getQuestion(result.questionId)
    if (!question) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const versionEntity = await service.getQuestionVersion(
      result.questionId,
      result.version,
    )
    if (!versionEntity) {
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    }

    const access = await userService.accessSchoolMethod(
      user,
      question.value.schoolId,
    )
    if (!access.includes("edit")) {
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])
    }

    await service.changeCurrentVersion(question, result.version)
    return { success: true, questionId: result.questionId }
  })
}

function validatePatch(body: unknown) {
  return validateBodyWrapper("PatchManageQuestionVersion", body, (b) => {
    if (typeof b !== "object" || b === null) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "リクエストボディ" } },
      ])
    }

    if (!("questionId" in b) || typeof b.questionId !== "string") {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題ID" } },
      ])
    }
    if (!("version" in b) || typeof b.version !== "number") {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "バージョン" } },
      ])
    }
  })
}
