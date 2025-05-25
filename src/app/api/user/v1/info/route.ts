import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { ApiV1InTypeMap, ApiV1ValidationResult } from "@/lib/types/apiV1Types"
import { isStrictISO8601 } from "@/lib/functions/isStrictISO8601"
import { STATICS } from "@/lib/statics"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ取得")

  return await api.execute("GetUserInfo", async () => {
    await api.authorize(request)

    const userService = new UserService(prisma)
    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthDayDate: user.birthDayDate
          ? user.birthDayDate.toISOString()
          : null,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
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

    const userService = new UserService(prisma)
    await userService.getUserInfo(api.getFirebaseUid())
    const result = await userService.editUserInfo({
      name: validationResult.result.user.name,
      birthDayDate: validationResult.result.user.birthDayDate,
    })

    return {
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        phoneNumber: result.phoneNumber,
        birthDayDate: result.birthDayDate?.toISOString() ?? null,
        role: result.role,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      },
    }
  })
}

function validatePatch(
  body: unknown,
): ApiV1ValidationResult<
  ApiV1InTypeMap["PatchUserInfo"],
  "RequiredValueError" | "NotFoundError" | "InvalidFormatError"
> {
  if (typeof body !== "object" || body === null) {
    return {
      error: new ApiV1Error([{ key: "NotFoundError", params: null }]),
      result: null,
    }
  }

  if (
    !("user" in body) ||
    typeof body.user !== "object" ||
    body.user === null
  ) {
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "編集項目" } },
      ]),
      result: null,
    }
  }

  const editableKeys = ["name", "birthDayDate", "email", "phoneNumber"]

  // bodyオブジェクトに編集項目が最低1つはあるか
  const hasEditableKeys = Object.keys(body.user).some((key) =>
    editableKeys.includes(key),
  )
  if (!hasEditableKeys) {
    return {
      error: new ApiV1Error([
        {
          key: "RequiredValueError",
          params: { key: "編集項目" },
          columnName: "user",
        },
      ]),
      result: null,
    }
  }

  // 項目がある場合に、それぞれ型チェックを行う
  if ("name" in body.user) {
    if (
      typeof body.user.name !== "string" ||
      body.user.name.length < STATICS.VALIDATE.NAME.MIN_LENGTH ||
      body.user.name.length > STATICS.VALIDATE.NAME.MAX_LENGTH
    ) {
      return {
        error: new ApiV1Error([
          {
            key: "InvalidFormatError",
            params: { key: "名前" },
            columnName: "name",
          },
        ]),
        result: null,
      }
    }
  }

  if ("birthDayDate" in body.user) {
    if (typeof body.user.birthDayDate !== "string") {
      return {
        error: new ApiV1Error([
          {
            key: "InvalidFormatError",
            params: { key: "生年月日" },
            columnName: "birthDayDate",
          },
        ]),
        result: null,
      }
    }

    if (!isStrictISO8601(body.user.birthDayDate)) {
      return {
        error: new ApiV1Error([
          {
            key: "InvalidFormatError",
            params: { key: "生年月日" },
            columnName: "birthDayDate",
          },
        ]),
        result: null,
      }
    }
  }

  // emailとphoneNumberは未対応
  if ("email" in body.user || "phoneNumber" in body.user) {
    return {
      error: new ApiV1Error([{ key: "NotFoundError", params: null }]),
      result: null,
    }
  }

  return {
    error: null,
    result: body as ApiV1InTypeMap["PatchUserInfo"],
  }
}
