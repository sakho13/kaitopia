"use client"

import { useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import {
  handleGoogleLoginByFirebase,
  handleGuestLoginByFirebase,
  handleLoginByFirebase,
  handleLogoutByFirebase,
} from "@/lib/functions/firebaseActions"
import { usePostUserLogin } from "@/hooks/useApiV1"
import { useAuth } from "@/hooks/useAuth"
import { checkEmail, checkPassword } from "@/lib/functions/validators"
import { LOGIN_MODE } from "@/lib/types/loginMode"

export default function LoginPage() {
  const { idToken, email, password, onChangeEmail, onChangePassword, login } =
    useLoginPage()

  useEffect(() => {
    if (idToken) {
      redirect("/v1/user")
    }
  }, [idToken])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login("EMAIL")
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8'>
        <h1 className='text-3xl font-bold text-center text-primary mb-6'>
          ログイン
        </h1>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-text mb-1'
            >
              メールアドレス
            </label>
            <input
              type='email'
              id='email'
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary'
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-text mb-1'
            >
              パスワード
            </label>
            <input
              type='password'
              id='password'
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary'
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
            />
          </div>

          <ButtonBase type='submit' sizeMode='full' className='font-semibold'>
            ログイン
          </ButtonBase>
        </form>

        <div className='mt-6 text-center text-sm text-gray-500'>または</div>

        <ButtonBase
          colorMode='ghost'
          sizeMode='full'
          className='mt-4'
          onClick={() => login("GUEST")}
        >
          ゲストでログイン
        </ButtonBase>

        <ButtonBase
          colorMode='outline'
          sizeMode='full'
          className='mt-4'
          onClick={() => login("GOOGLE")}
        >
          <img src='/google-logo.svg' alt='Google' className='w-5 h-5' />
          Googleでログイン
        </ButtonBase>

        <p className='mt-6 text-center text-sm text-gray-500'>
          アカウントをお持ちでない方は{" "}
          <a
            href='/public/signup'
            className='text-primary font-medium hover:underline'
          >
            サインアップ
          </a>
        </p>
      </div>
    </div>
  )
}

function useLoginPage() {
  const router = useRouter()
  const { idToken } = useAuth()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const { requestPostLogin } = usePostUserLogin()

  const login = async (mode: LOGIN_MODE) => {
    if (loading) return

    setLoading(true)

    try {
      if (mode === "GUEST") {
        const credential = await handleGuestLoginByFirebase()
        const result = await requestPostLogin(
          await credential.user.getIdToken(),
        )
        if (!result.success) {
          await handleLogoutByFirebase()
          throw new Error(result.errors[0].message)
        }
      }

      if (mode === "EMAIL") {
        if (!email || !password) {
          if (!email) setEmailError("メールアドレスは必須です。")
          if (!password) setPasswordError("パスワードは必須です。")
          return
        }
        const checkEmailResult = checkEmail(email)
        const checkPasswordResult = checkPassword(password)
        if (!checkEmailResult || !checkPasswordResult) {
          if (!checkEmailResult) setEmailError("メールアドレスが無効です。")
          if (!checkPasswordResult)
            setPasswordError("パスワードは8文字以上である必要があります。")
          return
        }

        setEmailError(null)
        setPasswordError(null)
        const credential = await handleLoginByFirebase(email, password)
        const result = await requestPostLogin(
          await credential.user.getIdToken(),
        )
        if (!result.success) {
          await handleLogoutByFirebase()
          throw new Error(result.errors[0].message)
        }
      }

      if (mode === "GOOGLE") {
        const credential = await handleGoogleLoginByFirebase()
        const result = await requestPostLogin(
          await credential.user.getIdToken(),
        )
        if (!result.success) {
          await handleLogoutByFirebase()
          throw new Error(result.errors[0].message)
        }
      }

      router.replace("/v1/user")
    } catch {
      alert(
        "認証システムに問題が発生しました。公式アナウンスを確認してください。",
      )
    } finally {
      setLoading(false)
    }
  }

  const onChangeEmail = (value: string) => setEmail(value)
  const onChangePassword = (value: string) => setPassword(value)

  return {
    idToken,
    loading,
    email,
    emailError,
    password,
    passwordError,
    login,
    onChangeEmail,
    onChangePassword,
  }
}
