import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageCertificationService } from "@/lib/classes/services/ManageCertificationService"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"

/**
 * 資格一覧取得API
 */
export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用資格取得API")

  return await api.execute("GetManageCertifications", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1") ?? 1
    const count = parseInt(
      request.nextUrl.searchParams.get("count") ?? "10",
      10,
    )

    const manageCertificationService = new ManageCertificationService(
      userService.userController,
      prisma,
    )

    const { certifications, totalCount, nextPage } =
      await manageCertificationService.getCertifications(count, page)

    return {
      certifications: certifications.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
      totalCount,
      nextPage,
    }
  })
}

/**
 * 資格作成API (ADMIN専用)
 */
export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用資格作成API")

  return await api.execute("PostManageCertifications", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const body = await request.json()

    // バリデーション
    if (!body.name || typeof body.name !== "string" || body.name.length < 1) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "資格名" } },
      ])
    }
    if (body.name.length > 100) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "資格名" } },
      ])
    }
    if (
      !body.description ||
      typeof body.description !== "string" ||
      body.description.length < 1
    ) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "資格説明" } },
      ])
    }
    if (body.description.length > 500) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "資格説明" } },
      ])
    }

    const manageCertificationService = new ManageCertificationService(
      userService.userController,
      prisma,
    )

    const certification =
      await manageCertificationService.createCertification(
        body.name,
        body.description,
      )

    return {
      id: certification.id,
      name: certification.name,
      description: certification.description,
      createdAt: certification.createdAt.toISOString(),
      updatedAt: certification.updatedAt.toISOString(),
    }
  })
}

/**
 * 資格更新API (ADMIN専用)
 */
export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用資格更新API")

  return await api.execute("PatchManageCertifications", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const body = await request.json()

    // バリデーション
    if (!body.id || typeof body.id !== "string" || body.id.length < 1) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "資格ID" } },
      ])
    }

    const updateData: { name?: string; description?: string } = {}

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.length < 1) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "資格名" } },
        ])
      }
      if (body.name.length > 100) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "資格名" } },
        ])
      }
      updateData.name = body.name
    }

    if (body.description !== undefined) {
      if (typeof body.description !== "string" || body.description.length < 1) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "資格説明" } },
        ])
      }
      if (body.description.length > 500) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "資格説明" } },
        ])
      }
      updateData.description = body.description
    }

    const manageCertificationService = new ManageCertificationService(
      userService.userController,
      prisma,
    )

    const certification =
      await manageCertificationService.updateCertification(body.id, updateData)

    return {
      id: certification.id,
      name: certification.name,
      description: certification.description,
      createdAt: certification.createdAt.toISOString(),
      updatedAt: certification.updatedAt.toISOString(),
    }
  })
}

/**
 * 資格削除API (ADMIN専用)
 */
export async function DELETE(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用資格削除API")

  return await api.execute("DeleteManageCertifications", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const id = request.nextUrl.searchParams.get("id")

    // バリデーション
    if (!id || id.length < 1) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "資格ID" } },
      ])
    }

    const manageCertificationService = new ManageCertificationService(
      userService.userController,
      prisma,
    )

    await manageCertificationService.deleteCertification(id)

    return {
      success: true,
    }
  })
}
