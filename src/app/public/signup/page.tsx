"use client"

import { ButtonBase } from "@/components/atoms/ButtonBase"
import { useState } from "react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      alert("パスワードが一致しません")
      return
    }

    // Firebase Auth や API 呼び出しなどに置き換え
    console.log("サインアップ", { email, password })
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8'>
        <h1 className='text-3xl font-bold text-center text-primary mb-6'>
          サインアップ
        </h1>

        <form onSubmit={handleSignup} className='space-y-4'>
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
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
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <ButtonBase
            type='submit'
            sizeMode='full'
            colorMode='primary'
            className='font-semibold'
          >
            サインアップ
          </ButtonBase>
        </form>

        <div className='mt-6 text-center text-sm text-gray-500'>または</div>

        <ButtonBase className='mt-4' colorMode='outline' sizeMode='full'>
          <img src='/google-logo.svg' alt='Google' className='w-5 h-5' />
          Googleでサインアップ
        </ButtonBase>

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
    </div>
  )
}
