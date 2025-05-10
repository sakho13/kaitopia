import { z } from "zod"

/**
 * zodを使って、メールアドレスのバリデーションを行う
 * @param email
 * @returns
 */
export function checkEmail(email: string): boolean {
  const schema = z.string().email()
  return schema.safeParse(email).success
}

/**
 * パスワードのバリデーションを行う
 *
 * - 8文字以上
 * @param password
 * @returns
 */
export function checkPassword(password: string): boolean {
  const schema = z.string().min(8)
  return schema.safeParse(password).success
}
