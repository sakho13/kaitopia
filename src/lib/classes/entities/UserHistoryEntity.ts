import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import { UserHistoryActionType } from "@/lib/types/base/userTypes"
import { ApiV1Error } from "../common/ApiV1Error"
import { DateUtility } from "../common/DateUtility"
import { StringUtility } from "../common/StringUtility"

type UserHistoryEntityType = {
  userId: string
  historyNo: number
  actionType: UserHistoryActionType

  quitCode: string | null
  quitReason: string | null
}

export class UserHistoryEntity extends EntityMutable<UserHistoryEntityType> {
  constructor(value: UserHistoryEntityType) {
    super(value)

    if (value.actionType === "QUIT") {
      if (value.quitCode === null) {
        value.quitCode = UserHistoryEntity.generateQuitCode(value.userId)
      }
    }
  }

  validate(): void | Promise<void> {
    if (this.actionType === "QUIT") {
      if (!this.value.quitCode) {
        throw new Error("Quit code is required for QUIT action")
      }

      if (!this.value.quitReason) {
        throw new Error("Quit reason is required for QUIT action")
      }
    }
  }

  /**
   * 退会コードを生成する
   */
  private static generateQuitCode(userId: string): string {
    const now = DateUtility.generateDateStringNow()
    const baseStr = now + userId
    const randomStr = StringUtility.insertRandomCharAtRandomPosition(baseStr, 5)
    return StringUtility.clipTail(
      StringUtility.hashSimply(randomStr),
      6,
    ).toUpperCase()
  }

  public get quitProperty() {
    if (this.actionType !== "QUIT") {
      throw new ApiV1Error([
        {
          key: "InvalidFormatError",
          params: {
            key: "actionType",
          },
        },
      ])
    }

    return {
      quitCode: this.value.quitCode ?? "",
      quitReason: this.value.quitReason ?? "",
    }
  }

  public get actionType() {
    return this.value.actionType
  }
}
