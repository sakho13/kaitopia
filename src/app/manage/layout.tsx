"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { joincn } from "@/functions/joincn"
import { ButtonBase } from "@/components/atoms/ButtonBase"

type Props = {
  children: React.ReactNode
}

type NaviType = {
  label: string
  href: string
}

export default function Layout({ children }: Props) {
  const NAVI: NaviType[] = useMemo(
    () => [
      {
        label: "ダッシュボード",
        href: "/manage/overview",
      },
      {
        label: "問題管理",
        href: "/manage/questions",
      },
      {
        label: "テスト管理",
        href: "/manage/question-tests",
      },
      {
        label: "ユーザー管理",
        href: "/manage/users",
      },
    ],
    [],
  )
  const path = usePathname()

  const pageTitle = useMemo(
    () => NAVI.find((item) => item.href === path)?.label || "ダッシュボード",
    [path, NAVI],
  )

  return (
    <div
      className={joincn(`min-h-screen flex bg-background text-text font-sans`)}
    >
      <aside className='w-64 bg-primary text-white p-6 space-y-4 flex flex-col'>
        <h1 className='text-2xl font-bold'>KAITOPIA</h1>

        <nav className='space-y-2 mt-6'>
          {NAVI.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block w-full text-left px-4 py-2 rounded-md hover:bg-primary-hover ${
                path === item.href ? "bg-primary-hover" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className='space-y-2 mt-auto'>
          <Link
            href={"/user"}
            className={`block w-full text-left px-4 py-2 rounded-md hover:bg-primary-hover`}
          >
            ユーザ画面
          </Link>
        </nav>
      </aside>

      <main className='flex-1 p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-semibold'>{pageTitle}</h2>

          <ButtonBase
            colorMode='ghost'
            sizeMode='fit'
            className='px-4 py-2 text-sm'
          >
            ログアウト
          </ButtonBase>
        </div>

        {children}
      </main>
    </div>
  )
}
