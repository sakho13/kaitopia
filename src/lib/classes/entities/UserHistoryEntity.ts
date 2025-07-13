import { EntityMutable } from "@/lib/interfaces/EntityMutable"
import { UserHistoryActionType } from "@/lib/types/base/userTypes"
import { ApiV1Error } from "../common/ApiV1Error"

type UserHistoryEntityType = {
  userId: string
  historyNo: number
  actionType: UserHistoryActionType

  quitCode: string | null
  quitReason: string | null
}

export class UserHistoryEntity extends EntityMutable<UserHistoryEntityType> {
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
