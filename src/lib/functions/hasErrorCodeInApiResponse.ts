import { ApiV1ErrorMapObj, ApiV1OutBase } from "../types/apiV1Types"

export function hasErrorCodeInApiResponse<
  T,
  C extends keyof typeof ApiV1ErrorMapObj,
>(
  responseBody: ApiV1OutBase<T>,
  errorCode: C,
): responseBody is {
  success: false
  errors: [
    {
      code: C
      message: string
    },
  ]
} {
  if (responseBody.success) {
    return false
  }

  if (
    responseBody.errors &&
    responseBody.errors.find((e) => e.code === errorCode)
  ) {
    return true
  }

  return false
}
