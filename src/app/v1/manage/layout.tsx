"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { joincn } from "@/lib/functions/joincn"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import { KaitopiaTitle } from "@/components/atoms/KaitopiaTitle"

type Props = {
  children: React.ReactNode
}

type NaviType = {
  label: string
  href: string
  showNavBar: boolean
}

export default function Layout({ children }: Props) {
  const [schools, setSchools] = useState([
    {
      schoolId: "2jen2ih",
      schoolName: "KAITOPIA",
    },
    {
      schoolId: "3jen2ih",
      schoolName: "KAITOPIA2",
    },
    {
      schoolId: "4jen2ih",
      schoolName: "KAITOPIA3",
    },
    {
      schoolId: "5jen2ih",
      schoolName: "KAITOPIA4",
    },
    {
      schoolId: "6jen2ih",
      schoolName: "KAITOPIA5",
    },
  ])
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0].schoolId)

  const NAVI: NaviType[] = useMemo(
    () => [
      {
        label: "ダッシュボード",
        href: "/v1/manage/overview",
        showNavBar: true,
      },
      {
        label: "問題集管理",
        href: "/v1/manage/exercises",
        showNavBar: true,
      },
      {
        label: "問題管理",
        href: "/v1/manage/questions",
        showNavBar: true,
      },
      {
        label: "問題作成",
        href: "/v1/manage/questions/new",
        showNavBar: false,
      },
      {
        label: "テスト管理",
        href: "/v1/manage/question-tests",
        showNavBar: true,
      },
      {
        label: "ユーザー管理",
        href: "/v1/manage/users",
        showNavBar: true,
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
        <KaitopiaTitle href='/v1/manage/overview' />

        <div>
          <label htmlFor='schoolSelect' className='text-sm block mb-1 mt-4'>
            所属スクール
          </label>
          <select
            id='schoolSelect'
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className='w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:bg-primary-hover hover:cursor-pointer'
          >
            {schools.map((school) => (
              <option
                key={school.schoolId}
                value={school.schoolId}
                className='bg-white text-black'
              >
                {school.schoolName}
              </option>
            ))}
          </select>
        </div>

        <nav className='space-y-2'>
          {NAVI.filter((item) => item.showNavBar).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block w-full text-left px-4 py-2 rounded-md hover:bg-primary-hover ${
                path.startsWith(item.href) ? "bg-primary-hover" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className='space-y-2 mt-auto'>
          <Link
            href={"/v1/user"}
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
