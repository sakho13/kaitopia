import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { prisma } from "@/lib/prisma"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"
import { PrismaQuestionRepository } from "@/lib/classes/repositories/PrismaQuestionRepository"
import { ManageQuestionService2 } from "@/lib/classes/services/ManageQuestionService2"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"

export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("アクティブバージョン更新")

  return api.execute("PatchManageQuestionVersion", async () => {
    await api.checkAccessManagePage(request)

    const body = await request.json()
    const { error, result } = validatePatch(body)
    if (error) throw error

    const userService2 = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )
    const user = await userService2.getUserInfo(api.getFirebaseUid())
    if (!user) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const questionRepository = new PrismaQuestionRepository(prisma)
    const service = new ManageQuestionService2(prisma, questionRepository)

    const question = await service.getQuestion(user, result.questionId)
    if (!question)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const versionEntity = await service.getQuestionVersion(
      result.questionId,
      result.version,
    )
    if (!versionEntity) {
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    }

    await service.changeCurrentVersion(question, result.version)
    return { questionId: result.questionId, currentVersion: result.version }
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
