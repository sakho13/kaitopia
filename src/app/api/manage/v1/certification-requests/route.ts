import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageCertificationService } from "@/lib/classes/services/ManageCertificationService"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"

/**
 * 資格リクエスト一覧取得API
 */
export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用資格リクエスト取得API")

  return await api.execute("GetManageCertificationRequests", async () => {
    const { user } = await api.checkAccessManagePage(request)

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1") ?? 1
    const count = parseInt(
      request.nextUrl.searchParams.get("count") ?? "10",
      10,
    )
    const status = request.nextUrl.searchParams.get("status") || undefined

    const manageCertificationService = new ManageCertificationService(
      prisma,
      user,
    )

    const { requests, totalCount, nextPage } =
      await manageCertificationService.getCertificationRequests(
        count,
        page,
        status,
      )

    return {
      requests: requests.map((r) => ({
        id: r.id,
        requestedName: r.requestedName,
        requestedDescription: r.requestedDescription,
        status: r.status,
        requestedBy: {
          id: r.requestedByUser.id,
          name: r.requestedByUser.name,
          email: r.requestedByUser.email,
        },
        votes: r.votes.map((v) => ({
          id: v.id,
          userId: v.user.id,
          userName: v.user.name,
          createdAt: v.createdAt.toISOString(),
        })),
        voteCount: r.votes.length,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
      totalCount,
      nextPage,
    }
  })
}

/**
 * 資格リクエスト作成API
 */
export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用資格リクエスト作成API")

  return await api.execute("PostManageCertificationRequests", async () => {
    const { user } = await api.checkAccessManagePage(request)

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
      prisma,
      user,
    )

    // userControllerからuserIdを取得する必要がある
    if (!user.userId) {
      throw new ApiV1Error([
        { key: "AuthenticationError", params: null },
      ])
    }

    const certificationRequest =
      await manageCertificationService.createCertificationRequest(
        user.userId,
        body.name,
        body.description,
      )

    return {
      id: certificationRequest.id,
      requestedName: certificationRequest.requestedName,
      requestedDescription: certificationRequest.requestedDescription,
      status: certificationRequest.status,
      createdAt: certificationRequest.createdAt.toISOString(),
      updatedAt: certificationRequest.updatedAt.toISOString(),
    }
  })
}
