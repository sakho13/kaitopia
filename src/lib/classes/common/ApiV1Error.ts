import {
  ApiV1ErrorInput,
  ApiV1ErrorMap,
  ApiV1ErrorMapObj,
} from "@/lib/types/apiV1Types"

export class ApiV1Error<K extends keyof ApiV1ErrorMap> extends Error {
  private errors: ApiV1ErrorInput<K>[]
  private option: { [key: string]: string }

  constructor(
    errors: ApiV1ErrorInput<K>[],
    option: { [key: string]: string } = {},
  ) {
    super("API V1 Error")

    this.errors = errors
    this.option = option
  }

  public getError(): {
    message: string
    columnName?: string
  }[] {
    return this.errors.map((error) => {
      const rawMessage = ApiV1ErrorMapObj[error.key].message
      const message = this.replaceParams(rawMessage, error.params)
      return {
        message,
        columnName: error.columnName,
      }
    })
  }

  public getStatus(): number {
    const errorBase = ApiV1ErrorMapObj[this.errors[0].key]
    if ("status" in errorBase && errorBase.status) {
      return errorBase.status
    }
    return 500
  }

  private replaceParams(
    rawMessage: string,
    params: ApiV1ErrorInput<K>["params"],
  ): string {
    if (!params) return rawMessage
    return Object.entries(params).reduce((acc, [key, value]) => {
      const regex = new RegExp(`{${key}}`, "g")
      return acc.replace(regex, String(value))
    }, rawMessage)
  }
}
