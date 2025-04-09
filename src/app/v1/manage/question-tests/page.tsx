export default function Page() {
  return (
    <div>
      <p className='mb-4'>管理者向けのサマリ情報を表示します。</p>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-xl p-4 shadow'>
          <h3 className='text-sm text-gray-500'>登録ユーザー数</h3>
          <p className='text-2xl font-bold'>128</p>
        </div>
        <div className='bg-white rounded-xl p-4 shadow'>
          <h3 className='text-sm text-gray-500'>今週のアクティブ</h3>
          <p className='text-2xl font-bold'>64</p>
        </div>
        <div className='bg-white rounded-xl p-4 shadow'>
          <h3 className='text-sm text-gray-500'>解答された問題数</h3>
          <p className='text-2xl font-bold'>342</p>
        </div>
      </div>
    </div>
  )
}
