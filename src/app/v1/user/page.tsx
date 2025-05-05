import { UserLatestResultLogs } from "@/components/organisms/UserLatestResultLogs"
import { UserRecommendExerciseSection } from "@/components/organisms/UserRecommendExerciseSection"

export default function Page() {
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <UserRecommendExerciseSection />

      {/* <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>今日の学習</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-background-subtle p-4 rounded-2xl shadow hover:shadow-lg transition'>
            <h3 className='text-lg font-bold mb-2'>レッスンを続ける</h3>
            <p>前回の単元から再開しましょう！</p>
            <button className='mt-4 bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-xl'>
              再開
            </button>
          </div>

          <div className='bg-smart text-white p-4 rounded-2xl shadow hover:shadow-lg transition'>
            <h3 className='text-lg font-bold mb-2'>テスト対策モード</h3>
            <p>模擬試験に挑戦してみよう！</p>
            <button className='mt-4 bg-white text-smart font-bold py-2 px-4 rounded-xl'>
              始める
            </button>
          </div>
        </div>
      </section> */}

      {/* <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>スキル</h2>
        <div className='flex space-x-4 mb-4'>
          <button className='bg-highlight text-text-on-color py-1 px-3 rounded-full'>
            全体
          </button>
          <button className='bg-gray-200 text-gray-700 py-1 px-3 rounded-full'>
            文法
          </button>
          <button className='bg-gray-200 text-gray-700 py-1 px-3 rounded-full'>
            語彙
          </button>
        </div>
      </section> */}

      {/* <section>
        <h2 className='text-xl font-semibold mb-4'>進捗</h2>
        <div className='flex items-end space-x-4 h-40'>
          <div className='w-6 bg-fun h-20 rounded-md'></div>
          <div className='w-6 bg-smart h-32 rounded-md'></div>
          <div className='w-6 bg-primary h-28 rounded-md'></div>
        </div>
      </section> */}

      <section>
        <h2 className='text-xl font-semibold mb-4 select-none'>
          最近のアクティビティ
        </h2>

        <UserLatestResultLogs />
      </section>
    </div>
  )
}
