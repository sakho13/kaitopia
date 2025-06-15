import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageQuestionService } from "@/lib/classes/services/ManageQuestionService"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題の取得")

  return await api.execute("GetManageQuestion", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const questionId = request.nextUrl.searchParams.get("questionId")
    if (!questionId || questionId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題ID" } },
      ])

    await userService.getUserInfo(api.getFirebaseUid())
    const userController = userService.userController

    const questionService = new ManageQuestionService(userController, prisma)
    const question = await questionService.getQuestionDetail(questionId)
    if (!question) {
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    }

    return {
      question: {
        schoolId: "",
        questionId,
        title: question.title,
        questionType: question.questionType,
        answerType: question.answerType,
      },
      currentVersion: question.currentVersionId,
      draftVersion: question.draftVersionId,
      versions: question.versions.map((v) => {
        const base = {
          questionId,
          version: v.version,
          content: v.content,
          hint: v.hint,
        }
        if (question.answerType === "TEXT") {
          return {
            ...base,
            property: {
              answerId: v.questionAnswers[0]?.answerId || "",
              maxLength: v.questionAnswers[0]?.maxLength || 0,
              minLength: v.questionAnswers[0]?.minLength || 0,
            },
          }
        }

        return {
          ...base,
          selection: v.questionAnswers.map((a) => ({
            answerId: a.answerId,
            isCorrect: a.isCorrect!,
            selectContent: a.selectContent!,
          })),
        }
      }),
    }
  })
}

// export async function PATCH(request: NextRequest) {
//   const api = new ApiV1Wrapper("管理用問題集の更新")

//   return await api.execute("PatchManageExercise", async () => {
//     const { userService } = await api.checkAccessManagePage(request)

//     const exerciseId = request.nextUrl.searchParams.get("exerciseId")
//     if (!exerciseId || exerciseId.length < 2)
//       throw new ApiV1Error([
//         { key: "RequiredValueError", params: { key: "問題集ID" } },
//       ])

//     const body = await request.json()
//     const { error, result: resultBody } = validatePatch(body)

//     if (error) throw error

//     const exerciseService = new ExerciseService(prisma)
//     exerciseService.setUserController(userService.userController)

//     const result = await exerciseService.updateExercise(exerciseId, resultBody)

//     return {
//       exercise: {
//         exerciseId: result.id,
//         title: result.title,
//         description: result.description,
//         createdAt: result.createdAt.toISOString(),
//         updatedAt: result.updatedAt.toISOString(),
//       },
//     }
//   })
// }
