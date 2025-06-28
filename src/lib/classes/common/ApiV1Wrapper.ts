import { NextRequest, NextResponse } from "next/server"
import { ApiV1Error } from "./ApiV1Error"
import { ApiV1OutBase, ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { UserService } from "../services/UserService"
import { prisma } from "@/lib/prisma"
import { FirebaseAuthUserRepository } from "../repositories/FirebaseAuthUserRepository"

export class ApiV1Wrapper {
  private _firebaseUid = ""
  private _isGuest = false

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
      if (process.env.NODE_ENV !== "production") {
        console.error(`[${this.apiName}] Error:`, error)
      }

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

    const firebaseBaseRepo = new FirebaseAuthUserRepository()
    const result = await firebaseBaseRepo.verifyIdToken(token)
    this._firebaseUid = result.uid
    this._isGuest = result.isGuest
    return result
  }

  /**
   * 管理者ページのアクセス権限を確認する
   * @param request
   * @returns
   */
  public async checkAccessManagePage(request: NextRequest) {
    await this.authorize(request)

    const userService = new UserService(prisma)
    const user = await userService.getUserInfo(this.getFirebaseUid())

    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    if (!userService.canAccessManagePage)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    return { userService }
  }

  public async isGuest() {
    return this._isGuest
  }

  public getFirebaseUid() {
    return this._firebaseUid
  }
}
