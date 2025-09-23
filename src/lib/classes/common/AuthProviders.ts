import { DecodedIdToken } from "firebase-admin/auth"
import { IAuthProvider } from "@/lib/interfaces/IAuthProvider"
import { ProviderTypeType } from "@/lib/types/base/authProviderTypes"

export class FirebaseAuthProvider implements IAuthProvider {
  private _firebaseUid: string
  private _providerType: ProviderTypeType

  private _email: string | null = null
  private _phoneNumber: string | null = null

  constructor(decodedToken: DecodedIdToken) {
    this._firebaseUid = decodedToken.uid
    this._providerType = FirebaseAuthProvider._setProviderType(
      decodedToken.firebase.sign_in_provider,
    )
    this._email = decodedToken.email ?? null
    this._phoneNumber = decodedToken.phone_number ?? null
  }

  private static _setProviderType(
    signInProvider: DecodedIdToken["firebase"]["sign_in_provider"],
  ): ProviderTypeType {
    if (signInProvider === "anonymous") {
      return "FIREBASE_GUEST"
    }

    if (signInProvider === "password") {
      return "FIREBASE_EMAIL"
    }

    throw new Error("Unsupported provider type")
  }

  get externalId(): string {
    return this._firebaseUid
  }

  get providerType(): ProviderTypeType {
    return this._providerType
  }

  get authProperty(): { email: string | null; phoneNumber: string | null } {
    return { email: this._email, phoneNumber: this._phoneNumber }
  }
}
