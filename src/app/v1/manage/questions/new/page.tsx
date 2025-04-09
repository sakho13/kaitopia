"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ButtonBase } from "@/components/atoms/ButtonBase"

export default function Page() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState<"初級" | "中級" | "上級">("初級")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここでAPIやPrisma経由でDBに保存する処理
    console.log({ title, category, difficulty })
    router.push("/admin/questions") // 登録後一覧に戻る
  }

  return (
    <div className='min-h-screen bg-background text-text p-8 font-sans'>
      <div className='max-w-3xl mx-auto bg-white p-6 rounded-xl shadow'>
        <h1 className='text-2xl font-bold mb-6'>新しい問題を作成</h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>タイトル</label>
            <input
              type='text'
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-kaitopia-primary'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>カテゴリ</label>
            <input
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-kaitopia-primary'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>難易度</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className='w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-kaitopia-primary'
            >
              <option value='初級'>初級</option>
              <option value='中級'>中級</option>
              <option value='上級'>上級</option>
            </select>
          </div>

          <div className='flex justify-end gap-3'>
            <ButtonBase
              type='button'
              colorMode='outline'
              className='px-4 py-2 text-sm'
            >
              キャンセル
            </ButtonBase>

            <ButtonBase
              type='submit'
              colorMode='primary'
              className='font-semibold px-6 py-2'
            >
              登録
            </ButtonBase>
          </div>
        </form>
      </div>
    </div>
  )
}
