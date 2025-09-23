import { NextRequest, NextResponse } from "next/server"
import { ApiV1Error } from "./ApiV1Error"
import { ApiV1OutBase, ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { prisma } from "@/lib/prisma"
import { FirebaseAuthUserRepository } from "../repositories/FirebaseAuthUserRepository"
import { UserService } from "../services/UserService"
import { UserEntity } from "../entities/UserEntity"

export class ApiV1Wrapper {
  private _user: UserEntity | null = null

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
    const firebaseResult = await firebaseBaseRepo.verifyIdTokenV2(token)

    // 認証プロバイダ経由でユーザーを取得
    const userService = UserService.createByPrisma(prisma)
    this._user = await userService.getUserInfo(firebaseResult.externalId)

    return { user: this._user, authProvider: firebaseResult }
  }

  /**
   * 管理者ページのアクセス権限を確認する
   * @param request
   * @returns
   */
  public async checkAccessManagePage(request: NextRequest) {
    const { user } = await this.authorize(request)

    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    if (!user.canAccessManagePage)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    return { user }
  }

  /**
   * 認証されたユーザーを取得
   */
  public getAuthenticatedUser(): UserEntity | null {
    return this._user
  }

  /**
   * 認証されたユーザーを取得（必須）
   */
  public getRequiredAuthenticatedUser(): UserEntity {
    if (!this._user) {
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    }
    return this._user
  }
}
