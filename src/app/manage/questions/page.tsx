export default function Page() {
  return (
    <div>
      <p className='mb-4'>問題の一覧や新規作成ができます。</p>
      <div className='flex justify-between mb-4'>
        <h3 className='text-lg font-semibold'>登録済みの問題</h3>
        <button className='bg-smart text-white px-4 py-2 rounded-xl hover:opacity-90 transition'>
          新しい問題を追加
        </button>
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
