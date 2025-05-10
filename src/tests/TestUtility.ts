import { POST } from "@/app/api/user/v1/login/route"
import {
  handleGuestLoginByFirebase,
  handleLoginByFirebase,
  handleRegisterByFirebase,
} from "@/lib/functions/firebaseActions"
import { NextRequest, NextResponse } from "next/server"

export class TestUtility {
  public static async getTokenByEmailAndSignUp(
    email: string,
    password: string,
  ) {
    const credential = await handleRegisterByFirebase(email, password)
    const token = await credential.user.getIdToken()
    return token
  }

  public static async getTokenByEmailAndLogin(email: string, password: string) {
    const credential = await handleLoginByFirebase(email, password)
    const token = await credential.user.getIdToken()
    return token
  }

  public static async getGuestToken() {
    const credential = await handleGuestLoginByFirebase()
    const token = await credential.user.getIdToken()
    return token
  }

  public static async runApi(
    api: (request: NextRequest) => Promise<NextResponse>,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    headers: Record<string, string> = {},
    body: unknown = null,
  ) {
    const request = new NextRequest(`http://localhost:3000${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    return await api(request)
  }

  public static async signUpByToken(token: string) {
    return await TestUtility.runApi(POST, "POST", "/api/user/v1/user/login", {
      Authorization: `Bearer ${token}`,
    })
  }
}
