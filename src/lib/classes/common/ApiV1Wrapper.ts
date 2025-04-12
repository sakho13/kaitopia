import { NextRequest, NextResponse } from "next/server"
import { ApiV1Error } from "./ApiV1Error"
import { ApiV1OutBase, ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { verifyIdToken } from "@/lib/functions/firebaseAdmin"

export class ApiV1Wrapper {
  constructor(private apiName: string) {}

  public async execute<R extends keyof ApiV1OutTypeMap>(
    _apiType: keyof ApiV1OutTypeMap,
    apiLogic: () => Promise<ApiV1OutTypeMap[R]>,
  ): Promise<
    ReturnType<typeof NextResponse.json<ApiV1OutBase<ApiV1OutTypeMap[R]>>>
  > {
    try {
      const data = await apiLogic()
      return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error: unknown) {
      console.error(`[${this.apiName}] Error:`, error)

      if (error instanceof ApiV1Error) {
        return NextResponse.json(
          { success: false, errors: error.getError() },
          { status: error.getStatus() },
        )
      } else if (error instanceof Error) {
        console.error(`[${this.apiName}] Unexpected Error:`, error.message)
      } else {
        console.error(`[${this.apiName}] Unknown Error:`, error)
      }

      const err = new ApiV1Error([{ key: "SystemError", params: null }])
      return NextResponse.json(
        { success: false, errors: err.getError() },
        { status: 500 },
      )
    }
  }

  public async authorize(request: NextRequest) {
    const authorization = request.headers.get("Authorization")
    if (!authorization)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const token = authorization.split(" ")[1]
    if (!token)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const decodedToken = await verifyIdToken(token)
    if (!decodedToken)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    return decodedToken
  }
}
