"use client"

import { useState } from "react"

export default function Page() {
  // 仮のユーザーデータ（将来はAPIで取得）
  const [user, setUser] = useState({
    name: "田中 太郎",
    email: "tanaka@example.com",
    registeredAt: "2025/03/01",
  })

  const [name, setName] = useState(user.name)
  const [editing, setEditing] = useState(false)

  const handleSave = () => {
    // APIに保存処理（仮）
    setUser({ ...user, name })
    setEditing(false)
    alert("プロフィールを更新しました")
  }

  return (
    <div className='bg-background min-h-screen text-text font-sans p-8'>
      <div className='max-w-xl mx-auto bg-white p-6 rounded-2xl shadow'>
        <h1 className='text-2xl font-bold mb-6'>プロフィール</h1>

        {/* 名前 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>名前</label>
          {editing ? (
            <input
              type='text'
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className='text-lg'>{user.name}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>
            メールアドレス
          </label>
          <p className='text-lg'>{user.email}</p>
        </div>

        {/* 登録日 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>登録日</label>
          <p className='text-lg'>{user.registeredAt}</p>
        </div>

        {/* ボタン */}
        <div className='mt-6 flex gap-4 justify-end'>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className='bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover'
              >
                保存
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setName(user.name)
                }}
                className='px-4 py-2 rounded border hover:bg-gray-50'
              >
                キャンセル
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className='bg-smart text-white px-4 py-2 rounded hover:opacity-90'
            >
              編集
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
