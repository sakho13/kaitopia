import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ取得")

  return await api.execute("GetUserInfo", async () => {
    await api.authorize(request)

    const userRepository = new PrismaUserRepository(prisma)
    const schoolRepository = new PrismaSchoolRepository(prisma)
    const userService = new UserService2(
      prisma,
      userRepository,
      schoolRepository,
    )
    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    return {
      user: {
        id: user.userId,
        name: user.value.name,
        email: user.value.email,
        phoneNumber: user.value.phoneNumber,
        birthDayDate: user.value.birthDayDate
          ? user.value.birthDayDate.toISOString()
          : null,
        role: user.value.role,
        createdAt: user.value.createdAt.toISOString(),
        updatedAt: user.value.updatedAt.toISOString(),
      },
    }
  })
}

export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ情報編集")

  return await api.execute("PatchUserInfo", async () => {
    await api.authorize(request)

    const body = await request.json()

    const validationResult = validatePatch(body)
    if (validationResult.error) throw validationResult.error

    const userRepository = new PrismaUserRepository(prisma)
    const schoolRepository = new PrismaSchoolRepository(prisma)
    const userService = new UserService2(
      prisma,
      userRepository,
      schoolRepository,
    )

    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const result = await userService.editUserInfo(user, {
      name: validationResult.result.user.name,
      birthDayDate: validationResult.result.user.birthDayDate,
    })

    return {
      user: {
        id: result.userId,
        name: result.value.name,
        email: result.value.email,
        phoneNumber: result.value.phoneNumber,
        birthDayDate: result.value.birthDayDate?.toISOString() ?? null,
        role: result.value.role,
        createdAt: result.value.createdAt.toISOString(),
        updatedAt: result.value.updatedAt.toISOString(),
      },
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
