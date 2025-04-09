"use client"

import { useState } from "react"
import { redirect } from "next/navigation"
import { ButtonBase } from "@/components/atoms/ButtonBase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // ここでFirebase AuthやAPI呼び出し
    console.log("ログイン", { email, password })
    redirect("/v1/user")
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8'>
        <h1 className='text-3xl font-bold text-center text-primary mb-6'>
          ログイン
        </h1>

        <form onSubmit={handleLogin} className='space-y-4'>
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

          <ButtonBase
            type='submit'
            sizeMode='full'
            className='font-semibold'
            onClick={handleLogin}
          >
            ログイン
          </ButtonBase>
        </form>

        <div className='mt-6 text-center text-sm text-gray-500'>または</div>

        <ButtonBase colorMode='outline' sizeMode='full' className='mt-4'>
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
