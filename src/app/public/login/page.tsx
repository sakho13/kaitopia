"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, UserX } from "lucide-react"
import { SlimeButton } from "@/components/atoms/SlimeButton"
import {
  handleGoogleLoginByFirebase,
  handleGuestLoginByFirebase,
  handleLoginByFirebase,
} from "@/lib/functions/firebaseActions"
import { usePostUserLogin } from "@/hooks/useApiV1"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { checkEmail, checkPassword } from "@/lib/functions/validators"
import { LoginMode } from "@/lib/types/loginMode"
import { FirebaseError } from "firebase/app"
import { joincn } from "@/lib/functions/joincn"
import { useAnalytics } from "@/hooks/useAnalytics"
import { Skeleton } from "@/components/ui/skeleton"
import { usePhaseState } from "@/hooks/common/usePhaseState"
import { hasErrorCodeInApiResponse } from "@/lib/functions/hasErrorCodeInApiResponse"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  const {
    email,
    emailError,
    password,
    passwordError,
    currentPhase,
    onChangeEmail,
    onChangePassword,
    login,
  } = useLoginPage()

  const isLoading = useMemo(() => currentPhase === "loading", [currentPhase])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login("EMAIL")
  }

  return (
    <>
      {/* SVG defs for gooey effects & custom keyframes */}
      <svg width='0' height='0' className='absolute' aria-hidden>
        <defs>
          <filter id='goo'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='6' result='blur' />
            <feColorMatrix
              in='blur'
              mode='matrix'
              values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'
              result='goo'
            />
            <feBlend in='SourceGraphic' in2='goo' />
          </filter>
        </defs>
      </svg>
      <style>{`
        @keyframes drop-drift-1 { 0% { transform: translate(-4px,0) } 50% { transform: translate(2px,2px) } 100% { transform: translate(-4px,0) } }
        @keyframes drop-drift-2 { 0% { transform: translate(4px,-1px) } 50% { transform: translate(-2px,1px) } 100% { transform: translate(4px,-1px) } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

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
              className={joincn(
                "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary",
                emailError ? "border-red-500" : "",
              )}
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              disabled={isLoading}
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
              className={joincn(
                "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary",
                passwordError ? "border-red-500" : "",
              )}
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
              disabled={isLoading}
            />
            {passwordError && (
              <p className='text-red-500 text-sm mt-1'>{passwordError}</p>
            )}
          </div>

          {isLoading ? (
            <Skeleton className='w-full h-10 rounded-xl' />
          ) : (
            <SlimeButton
              type='submit'
              colorMode='primary'
              sizeMode='full'
              disabled={isLoading}
            >
              <LogIn className='size-4' aria-hidden />
              {isLoading ? "ログイン中..." : "ログイン"}
            </SlimeButton>
          )}
        </form>

        <div className='mt-6 text-center text-sm text-gray-500'>または</div>

        <div className='mt-4'>
          {isLoading ? (
            <Skeleton className='w-full h-10 rounded-xl' />
          ) : (
            <SlimeButton
              colorMode='ghost'
              sizeMode='full'
              onClick={() => login("GUEST")}
              disabled={isLoading}
            >
              <UserX className='size-4' aria-hidden />
              {isLoading ? "ログイン中..." : "ゲストでログイン"}
            </SlimeButton>
          )}
        </div>

        {/* <ButtonBase
        colorMode='outline'
        sizeMode='full'
        className='mt-4'
        onClick={() => login("GOOGLE")}
      >
        <img src='/google-logo.svg' alt='Google' className='w-5 h-5' />
        Googleでログイン
      </ButtonBase> */}

        <p className='mt-6 text-center text-sm text-gray-500'>
          アカウントをお持ちでない方は{" "}
          <a
            href='/public/signup'
            className='text-primary font-medium hover:underline'
          >
            サインアップ
          </a>
        </p>

        {/* ToDo 退会コード入力処理はあとで実装 */}
        {/* <Dialog open={currentPhase === "input-quit-code"}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>退会コードを入力してください</DialogTitle>
            </DialogHeader>

            <div>
              <input
                type='text'
                placeholder='退会コード'
                className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-4'
                value={quitCode || ""}
                onChange={(e) => onChangeQuitCode(e.target.value)}
              />
            </div>

            <DialogFooter>
              <ButtonBase
                sizeMode='full'
                className='font-semibold'
                onClick={() => login("EMAIL")}
              >
                再登録
              </ButtonBase>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </>
  )
}

function useLoginPage() {
  const router = useRouter()
  const { signOut: handleSignOut } = useAuth()
  const { sendAnalyticsEvent } = useAnalytics()
  const { showInfo, showSuccessShort, showError } = useToast()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [quitCode, setQuitCode] = useState<string | null>(null)

  const { currentPhase, onChangePhase } = usePhaseState(
    ["input", "loading", "input-quit-code"] as const,
    "input",
  )

  const { requestPostLogin } = usePostUserLogin()

  const login = async (mode: LoginMode) => {
    if (currentPhase === "loading") return

    onChangePhase("loading")

    try {
      if (mode === "GUEST") {
        const credential = await handleGuestLoginByFirebase()
        const result = await requestPostLogin(
          await credential.user.getIdToken(),
        )
        if (!result.success) {
          sendAnalyticsEvent("guestLoginError", {
            error_message: JSON.stringify(result.errors),
          })
          await handleSignOut()
          throw new Error(result.errors[0].message)
        }

        sendAnalyticsEvent("guestLogin", {
          uid: credential.user.uid,
        })
        showInfo("ゲストアカウントは5日後に削除されます")
        router.replace("/v1/user")
        return
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
          quitCode ? quitCode : undefined,
        )

        if (!result.success) {
          if (hasErrorCodeInApiResponse(result, "DeletedUserError")) {
            onChangePhase("input-quit-code")
            showInfo(result.errors[0].message)
            setQuitCode("")
            return
          }

          sendAnalyticsEvent("emailLoginError", {
            error_message: JSON.stringify(result.errors),
          })
          await handleSignOut()
          throw new Error(result.errors[0].message)
        }

        if (result.data.state === "login") {
          sendAnalyticsEvent("emailLogin", {
            uid: credential.user.uid,
          })
          showSuccessShort("ログインしました。")

          router.replace("/v1/user")
          return
        }
      }

      if (mode === "GOOGLE") {
        const credential = await handleGoogleLoginByFirebase()
        const result = await requestPostLogin(
          await credential.user.getIdToken(),
        )
        if (!result.success) {
          await handleSignOut()
          throw new Error(result.errors[0].message)
        }

        router.replace("/v1/user")
        return
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/user-not-found") {
          setEmailError("メールアドレスが登録されていません。")
          return
        }

        setEmailError("メールアドレスまたはパスワードが正しくありません。")
        return
      }

      sendAnalyticsEvent("authenticationError", {
        error_message: JSON.stringify(error),
      })
      showError(
        "認証システムに問題が発生しました。公式アナウンスを確認してください。",
      )
    } finally {
      onChangePhase("input")
    }
  }

  const onChangeEmail = (value: string) => setEmail(value)
  const onChangePassword = (value: string) => setPassword(value)
  const onChangeQuitCode = (value: string) => setQuitCode(value)

  return {
    currentPhase,
    email,
    emailError,
    password,
    passwordError,
    quitCode,
    login,
    onChangeEmail,
    onChangePassword,
    onChangeQuitCode,
  }
}
