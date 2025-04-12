import { NextResponse } from "next/server"
import { ApiV1Error } from "./ApiV1Error"
import { ApiV1OutBase } from "@/lib/types/apiV1Types"

export class ApiV1Wrapper {
  constructor(private apiName: string) {}

  public async execute<R>(
    apiLogic: () => Promise<R>,
  ): Promise<ReturnType<typeof NextResponse.json<ApiV1OutBase<R>>>> {
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
}
