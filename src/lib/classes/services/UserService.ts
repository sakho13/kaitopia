import { EditableUserInfo, UserBaseInfo } from "@/lib/types/base/userTypes"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"
import { UserRepository } from "../repositories/UserRepository"
import { ReplacedDateToString } from "@/lib/types/common/ReplacedDateToString"
import { ApiV1Error } from "../common/ApiV1Error"

export class UserService extends ServiceBase {
  private _userController: UserController

  constructor(...args: ConstructorParameters<typeof ServiceBase>) {
    super(...args)
    this._userController = new UserController(this.dbConnection)
  }

  public async getUserInfo(firebaseUid: string) {
    return await this._userController.getUserInfo(firebaseUid)
  }

  public async registerUserInfo(
    firebaseUid: string,
    isGuest: boolean,
    data: UserBaseInfo,
  ) {
    return await this._userController.registerUserInfo(
      firebaseUid,
      isGuest,
      data,
    )
  }

  public async editUserInfo(
    data: Partial<ReplacedDateToString<EditableUserInfo>>,
  ) {
    const resultUpdate = await this.dbConnection.$transaction(async (t) => {
      const userRepository = new UserRepository(t)

      const name = data.name
      // ISO 8601形式の文字列をDateに変換(時間は00:00:00)
      const birthDayDate = data.birthDayDate
        ? new Date(data.birthDayDate)
        : undefined
      // const email = data.email
      // const phoneNumber = data.phoneNumber

      return await userRepository.updateUserByUid(this._userId, {
        name,
        birthDayDate,
      })
    })

    return resultUpdate
  }

  public async getOwnSchools() {
    return await this._userController.getOwnSchools()
  }

  public async getAccessibleSchools() {
    return await this.userController.getUserAccessibleSchools()
  }

  private get _userId() {
    if (this.userController.userId === null)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    return this.userController.userId
  }

  public get canAccessManagePage() {
    return this._userController.canAccessManagePage
  }

  public get isAdmin() {
    return this._userController.isAdmin
  }

  public get userController() {
    return this._userController
  }
}
