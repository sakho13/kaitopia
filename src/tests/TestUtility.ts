import {
  handleGuestLoginByFirebase,
  handleLoginByFirebase,
  handleRegisterByFirebase,
} from "@/lib/functions/firebaseActions"

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
}
