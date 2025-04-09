export default function Page() {
  return (
    <div>
      <p className='mb-4'>学習者の一覧と管理ができます。</p>
      <table className='w-full bg-white shadow rounded-xl overflow-hidden'>
        <thead className='bg-background-subtle text-left'>
          <tr>
            <th className='px-4 py-2'>名前</th>
            <th className='px-4 py-2'>メール</th>
            <th className='px-4 py-2'>登録日</th>
            <th className='px-4 py-2'>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr className='border-t'>
            <td className='px-4 py-2'>田中 太郎</td>
            <td className='px-4 py-2'>tanaka@example.com</td>
            <td className='px-4 py-2'>2025/03/12</td>
            <td className='px-4 py-2'>
              <button className='text-sm text-red-500 hover:underline'>
                削除
              </button>
            </td>
          </tr>
          {/* ...もっと追加 */}
        </tbody>
      </table>
    </div>
  )
}
