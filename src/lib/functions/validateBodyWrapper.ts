import { ApiV1Error } from "../classes/common/ApiV1Error"
import {
  ApiV1ErrorMap,
  ApiV1InTypeMap,
  ApiV1ValidationResult,
} from "../types/apiV1Types"

export function validateBodyWrapper<T extends keyof ApiV1InTypeMap>(
  label: T,
  body: unknown,
  validator: (rawBody: unknown) => void,
): ApiV1ValidationResult<ApiV1InTypeMap[T], keyof ApiV1ErrorMap> {
  try {
    validator(body)
  } catch (error: unknown) {
    if (error instanceof ApiV1Error) {
      return {
        error: error,
        result: null,
      }
    }

    throw error
  }

  return {
    result: body as ApiV1InTypeMap[T],
    error: null,
  }
}
