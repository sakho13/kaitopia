import { UserBaseInfo } from "@/lib/types/base/userTypes"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"

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

  public async getOwnSchools() {
    return await this._userController.getOwnSchools()
  }

  public async getAccessibleSchools() {
    return await this.userController.getUserAccessibleSchools()
  }

  public get userId() {
    return this._userController.userId
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
