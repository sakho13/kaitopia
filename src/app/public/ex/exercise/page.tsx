import Image from "next/image"

export default function Page() {
  return (
    <div>
      <h1 className='text-4xl font-bold font-mono text-text select-none'>
        📚 問題集
      </h1>

      <div className='px-8 pt-4'>
        <div className='mb-3'>
          <h2 className='text-xl font-semibold font-mono text-text select-none'>
            <span className='text-2xl'>回</span>答中の画面
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-4'>
          <div>
            <Image
              src={"/lp/exercise_demo_1.png"}
              alt='Exercise Demo 1'
              width={200}
              height={200}
              className='rounded-lg shadow-lg select-none'
            />
          </div>

          <div>
            <p className='text-text'>
              <span className='text-xl font-bold'>回</span>
              答に集中できるシンプルな画面構成
            </p>

            <div className='mt-2'>
              <p className='text-text'>
                <span className='text-xl font-bold'>複</span>数種類の回答形式
              </p>

              <ul className='list-disc pl-5 mt-2'>
                <li>選択肢問題</li>
                <li>記述式問題(開発中)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='px-8 pt-8'>
        <div className='mb-3'>
          <h2 className='text-xl font-semibold font-mono text-text select-none'>
            <span className='text-2xl'>色</span>んな問題集
          </h2>
        </div>

        <div className='px-4'>
          <ul className='list-disc pl-5 text-text'>
            <li>プログラミングの基礎を学べる問題集</li>
            <li>原付免許用問題集</li>
            <li>危険物乙4用問題集(予定)</li>
          </ul>

          <div className='mt-4'>
            <p>順次問題は追加予定!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
