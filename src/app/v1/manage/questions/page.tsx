"use client"

import { ButtonBase } from "@/components/atoms/ButtonBase"
import { redirect } from "next/navigation"

export default function Page() {
  return (
    <div>
      <p className='mb-4'>問題の一覧や新規作成ができます。</p>

      <div className='flex justify-between mb-4'>
        <h3 className='text-lg font-semibold'>登録済みの問題</h3>

        <ButtonBase
          onClick={() => redirect("/v1/manage/questions/new")}
          colorMode='smart'
          sizeMode='fit'
          className='px-4'
        >
          新しい問題を追加
        </ButtonBase>
      </div>

      <ul className='space-y-2'>
        <li className='bg-white p-4 rounded-xl shadow'>
          <p>Q. 次のうち、JavaScriptのデータ型でないものは？</p>
        </li>

        <li className='bg-white p-4 rounded-xl shadow'>
          <p>Q. HTMLの略は？</p>
        </li>
      </ul>
    </div>
  )
}
