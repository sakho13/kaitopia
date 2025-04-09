import { InfoArea } from "@/components/atoms/InfoArea"

export default function Page() {
  return (
    <div className='grid gap-6'>
      <section>
        <p className='mb-4'>あなたのサマリ情報を表示します。</p>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
          <InfoArea>
            <h3 className='text-sm text-gray-500'>今週の正答数</h3>
            <p className='text-2xl font-bold'>64 / 102</p>
          </InfoArea>
        </div>
      </section>

      <section>
        <p className='mb-4'>管理者向けのサマリ情報を表示します。</p>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
          <InfoArea>
            <h3 className='text-sm text-gray-500'>登録ユーザー数</h3>
            <p className='text-2xl font-bold'>128</p>
          </InfoArea>

          <InfoArea>
            <h3 className='text-sm text-gray-500'>今週のアクティブ</h3>
            <p className='text-2xl font-bold'>64</p>
          </InfoArea>

          <InfoArea>
            <h3 className='text-sm text-gray-500'>解答された問題数</h3>
            <p className='text-2xl font-bold'>342</p>
          </InfoArea>
        </div>
      </section>
    </div>
  )
}
