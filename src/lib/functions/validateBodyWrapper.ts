import { ApiV1Error } from "../classes/common/ApiV1Error"
import {
  ApiV1ErrorMap,
  ApiV1InTypeMap,
  ApiV1ValidationResult,
} from "../types/apiV1Types"

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function isInKeyObject<K extends string>(
  v: unknown,
  key: K,
): v is { [key in K]: unknown } {
  return typeof v === "object" && v !== null && key in v
}

type CustomValidators = {
  isObject: typeof isObject
  isInKeyObject: typeof isInKeyObject
}

/**
 * APIボディのバリデーションを行うラッパー関数
 * @param _label
 * @param body
 * @param validator カスタムバリデータ
 * @returns
 */
export function validateBodyWrapper<T extends keyof ApiV1InTypeMap>(
  _label: T,
  body: unknown,
  validator: (rawBody: unknown, custom: CustomValidators) => void,
): ApiV1ValidationResult<ApiV1InTypeMap[T], keyof ApiV1ErrorMap> {
  try {
    validator(body, {
      isObject,
      isInKeyObject,
    })
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
