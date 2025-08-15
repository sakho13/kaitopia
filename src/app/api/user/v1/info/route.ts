import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ取得")

  return await api.execute("GetUserInfo", async () => {
    const { uid } = await api.authorize(request)

    const userService = UserService.createByPrisma(prisma)
    const user = await userService.getUserInfo(uid)
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    if (user.isDeleted) {
      throw new ApiV1Error([{ key: "DeletedUserError", params: null }])
    }

    return {
      user: {
        id: user.userId,
        name: user.username,
        email: user.value.email,
        phoneNumber: user.value.phoneNumber,
        birthDayDate: user.birthDayString,
        role: user.userRole,
        createdAt: user.value.createdAt.toISOString(),
        updatedAt: user.value.updatedAt.toISOString(),
      },
      schools: user.schools.map((school) => ({
        schoolId: school.schoolId,
        schoolName: school.schoolName,
      })),
    }
  })
}

export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ情報編集")

  return await api.execute("PatchUserInfo", async () => {
    const { uid } = await api.authorize(request)

    const body = await request.json()

    const validationResult = validatePatch(body)
    if (validationResult.error) throw validationResult.error

    const userService = UserService.createByPrisma(prisma)

    const user = await userService.getUserInfo(uid)
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    if (user.isDeleted) {
      throw new ApiV1Error([{ key: "DeletedUserError", params: null }])
    }

    const result = await userService.editUserInfo(user, {
      name: validationResult.result.user.name,
      birthDayDate: validationResult.result.user.birthDayDate,
    })

    return {
      user: {
        id: result.userId,
        name: result.username,
        email: result.value.email,
        phoneNumber: result.value.phoneNumber,
        birthDayDate: result.birthDayString,
        role: result.userRole,
        createdAt: result.value.createdAt.toISOString(),
        updatedAt: result.value.updatedAt.toISOString(),
      },
      schools: user.schools.map((school) => ({
        schoolId: school.schoolId,
        schoolName: school.schoolName,
      })),
    }
  })
}

function validatePatch(body: unknown) {
  return validateBodyWrapper(
    "PatchUserInfo",
    body,
    (
      rawBody,
      { isObject, isInKeyObject, isDateTimeString, isStrictISO8601 },
    ) => {
      if (!isObject(rawBody)) {
        throw new ApiV1Error([{ key: "NotFoundError", params: null }])
      }

      if (!isInKeyObject(rawBody, "user") || !isObject(rawBody.user)) {
        throw new ApiV1Error([
          { key: "RequiredValueError", params: { key: "編集項目" } },
        ])
      }

      const editableKeys = ["name", "birthDayDate", "email", "phoneNumber"]

      // bodyオブジェクトに編集項目が最低1つはあるか
      const hasEditableKeys = Object.keys(rawBody.user).some((key) =>
        editableKeys.includes(key),
      )
      if (!hasEditableKeys) {
        throw new ApiV1Error([
          {
            key: "RequiredValueError",
            params: { key: "編集項目" },
            columnName: "user",
          },
        ])
      }

      if ("birthDayDate" in rawBody.user) {
        if (
          !isDateTimeString(rawBody.user.birthDayDate) ||
          !isStrictISO8601(rawBody.user.birthDayDate)
        ) {
          throw new ApiV1Error([
            {
              key: "InvalidFormatError",
              params: { key: "生年月日" },
              columnName: "birthDayDate",
            },
          ])
        }
      }
    },
  )
}
