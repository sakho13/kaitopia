"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type QuestionSet = {
  id: number
  title: string
  questionsCount: number
  createdAt: string
}

export default function Page() {
  const router = useRouter()
  const [sets, setSets] = useState<QuestionSet[]>([
    {
      id: 1,
      title: "基本情報技術者 午前対策",
      questionsCount: 45,
      createdAt: "2025/04/05",
    },
    {
      id: 2,
      title: "JavaScript 初級講座",
      questionsCount: 20,
      createdAt: "2025/04/01",
    },
  ])

  return (
    <div>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-semibold'>登録済みの問題集</h3>

          <Dialog>
            <DialogTrigger asChild>
              <ButtonBase colorMode='smart' className='px-4 py-2'>
                新しい問題集を作成
              </ButtonBase>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しい問題集</DialogTitle>
              </DialogHeader>

              <div>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    問題集名
                  </label>
                  <input
                    type='text'
                    className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                    // value={name}
                    // onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className='mt-6 flex gap-4 justify-end'>
                  <ButtonBase
                    colorMode='primary'
                    className='px-4 py-2'
                    sizeMode='fit'
                  >
                    保存
                  </ButtonBase>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <table className='w-full bg-white shadow rounded-xl overflow-hidden'>
          <thead className='bg-background-subtle text-left text-sm'>
            <tr>
              <th className='px-4 py-2'>タイトル</th>
              <th className='px-4 py-2'>問題数</th>
              <th className='px-4 py-2'>作成日</th>
              <th className='px-4 py-2'>操作</th>
            </tr>
          </thead>

          <tbody>
            {sets.map((set) => (
              <tr key={set.id} className='border-t'>
                <td className='px-4 py-2'>{set.title}</td>
                <td className='px-4 py-2'>{set.questionsCount} 問</td>
                <td className='px-4 py-2'>{set.createdAt}</td>
                <td className='px-4 py-2 space-x-2 text-sm'>
                  <button
                    onClick={() =>
                      router.push(`/admin/question-sets/${set.id}/edit`)
                    }
                    className='text-primary hover:underline'
                  >
                    編集
                  </button>
                  <button className='text-red-500 hover:underline'>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
