"use client"

import { ButtonBase } from "@/components/atoms/ButtonBase"
import { Skeleton } from "@/components/ui/skeleton"
import { usePostUserLogin } from "@/hooks/useApiV1"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import {
  handleRegisterByFirebase,
  sendAnalyticsEvent,
} from "@/lib/functions/firebaseActions"
import { checkEmail, checkPassword } from "@/lib/functions/validators"
import { LoginMode } from "@/lib/types/loginMode"
import { FirebaseError } from "firebase/app"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const dynamic = "force-dynamic"

export default function SignupPage() {
  const {
    idToken,
    loading,
    email,
    emailError,
    password,
    passwordError,
    confirm,
    confirmError,

    onChangeEmail,
    onChangePassword,
    onChangeConfirm,
    signup,
  } = useSignupPage()

  useEffect(() => {
    if (idToken) {
      redirect("/v1/user")
    }
  }, [idToken])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signup("EMAIL")
  }

  return (
    <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8'>
      <h1 className='text-3xl font-bold text-center text-primary mb-6'>
        サインアップ
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
          {emailError && (
            <p className='text-red-500 text-sm mt-1'>{emailError}</p>
          )}
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
            disabled={loading}
          />
          {passwordError && (
            <p className='text-red-500 text-sm mt-1'>{passwordError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='confirm'
            className='block text-sm font-medium text-text mb-1'
          >
            パスワード（確認）
          </label>
          <input
            type='password'
            id='confirm'
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary'
            value={confirm}
            onChange={(e) => onChangeConfirm(e.target.value)}
            disabled={loading}
          />
          {confirmError && (
            <p className='text-red-500 text-sm mt-1'>{confirmError}</p>
          )}
        </div>

        {loading ? (
          <Skeleton className='w-full h-10 rounded-xl' />
        ) : (
          <ButtonBase
            type='submit'
            sizeMode='full'
            className='font-semibold'
            disabled={loading}
          >
            {loading ? "サインアップ中..." : "サインアップ"}
          </ButtonBase>
        )}

        <p className='mt-2 text-xs text-center text-gray-500'>
          <a
            href='/public/terms'
            className='text-primary font-medium hover:underline'
          >
            利用規約
          </a>
          に同意の上、登録してください。
        </p>
      </form>

      <div className='mt-6 text-center text-sm text-gray-500'>または</div>

      {/* <ButtonBase className='mt-4' colorMode='outline' sizeMode='full'>
        <img src='/google-logo.svg' alt='Google' className='w-5 h-5' />
        Googleでサインアップ
      </ButtonBase> */}

      <p className='mt-6 text-center text-sm text-gray-500'>
        すでにアカウントをお持ちの方は{" "}
        <a
          href='/public/login'
          className='text-primary font-medium hover:underline'
        >
          ログイン
        </a>
      </p>
    </div>
  )
}

const useSignupPage = () => {
  const router = useRouter()
  const { idToken } = useAuth()
  const { showSuccess, showError } = useToast()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState("")
  const [confirmError, setConfirmError] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const { requestPostLogin } = usePostUserLogin()

  const signup = async (mode: LoginMode) => {
    if (loading) return

    setLoading(true)

    try {
      if (mode === "EMAIL") {
        if (!email || !password || !confirm) {
          if (!email) setEmailError("メールアドレスを入力してください")
          if (!password) setPasswordError("パスワードを入力してください")
          if (!confirm) setConfirmError("パスワード（確認）を入力してください")
          return
        }
        const checkEmailResult = checkEmail(email)
        const checkPasswordResult = checkPassword(password)
        if (!checkEmailResult || !checkPasswordResult) {
          if (!checkEmailResult) setEmailError("メールアドレスの形式が不正です")
          if (!checkPasswordResult)
            setPasswordError("パスワードは8文字以上である必要があります。")
          return
        }
        if (password !== confirm) {
          setPasswordError("パスワードが一致しません")
          setConfirmError("パスワードが一致しません")
          return
        }

        setEmailError(null)
        setPasswordError(null)
        setConfirmError(null)
        const credential = await handleRegisterByFirebase(email, password)
        const result = await requestPostLogin(
          await credential.user.getIdToken(),
        )
        if (!result.success) {
          await credential.user.delete()
          throw new Error(result.errors[0].message)
        }

        if (result.data.state === "register") {
          showSuccess("ようこそ！ アカウントを登録しました！")
        }
        router.replace("/v1/user")
      }

      router.replace("/v1/user")
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/email-already-exists" ||
          error.code === "auth/email-already-in-use"
        ) {
          setEmailError("このメールアドレスはすでに使用されています。")
          return
        }
      }

      sendAnalyticsEvent("authenticationError", {
        error_message: JSON.stringify(error),
      })
      showError(
        "認証システムに問題が発生しました。公式アナウンスを確認してください。",
      )
    } finally {
      setLoading(false)
    }
  }

  const onChangeEmail = (value: string) => setEmail(value)
  const onChangePassword = (value: string) => setPassword(value)
  const onChangeConfirm = (value: string) => setConfirm(value)

  return {
    idToken,
    loading,
    email,
    emailError,
    password,
    passwordError,
    confirm,
    confirmError,
    signup,
    onChangeEmail,
    onChangePassword,
    onChangeConfirm,
  }
}
