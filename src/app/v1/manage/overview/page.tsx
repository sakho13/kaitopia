"use client"

import { InfoArea } from "@/components/atoms/InfoArea"
import { Skeleton } from "@/components/ui/skeleton"
import { useManageStore } from "@/hooks/stores/useManageStore"
import { useGetManageDashboard } from "@/hooks/useApiV1"

export default function Page() {
  const { schoolId } = useManageStore()

  const { dataToGetManageDashboard, isLoadingToGetManageDashboard } =
    useGetManageDashboard(schoolId)

  if (!dataToGetManageDashboard?.success) {
    return (
      <div className='grid gap-6'>
        <p>ダッシュボードのデータを取得できませんでした。</p>
      </div>
    )
  }

  return (
    <div className='grid gap-6'>
      {/* <section>
        <p className='mb-4'>あなたのサマリ情報を表示します。</p>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
          <InfoArea>
            <h3 className='text-sm text-gray-500'>今週の正答数</h3>
            <p className='text-2xl font-bold'>64 / 102</p>
          </InfoArea>
        </div>
      </section> */}

      <section>
        <p className='mb-4'>管理者向けのサマリ情報を表示します。</p>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
          {isLoadingToGetManageDashboard ? (
            <Skeleton className='rounded-xl shadow' />
          ) : (
            <InfoArea>
              <h3 className='text-sm text-gray-500 select-none'>
                登録ユーザー総数
              </h3>
              <p className='text-2xl font-bold'>
                {dataToGetManageDashboard.data.totalUserCount}
              </p>
            </InfoArea>
          )}

          {isLoadingToGetManageDashboard ? (
            <Skeleton className='rounded-xl shadow' />
          ) : (
            <InfoArea>
              <h3 className='text-sm text-gray-500 select-none'>
                アクティブユーザー数
              </h3>
              <p className='text-2xl font-bold'>
                {dataToGetManageDashboard.data.totalActiveUserCount}
              </p>
            </InfoArea>
          )}

          {isLoadingToGetManageDashboard ? (
            <Skeleton className='rounded-xl shadow' />
          ) : (
            <InfoArea>
              <h3 className='text-sm text-gray-500 select-none'>
                登録ゲストユーザー数
              </h3>
              <p className='text-2xl font-bold'>
                {dataToGetManageDashboard.data.totalActiveGuestUserCount}
              </p>
            </InfoArea>
          )}

          {isLoadingToGetManageDashboard ? (
            <Skeleton className='rounded-xl shadow' />
          ) : (
            <InfoArea>
              <h3 className='text-sm text-gray-500 select-none'>登録問題数</h3>
              <p className='text-2xl font-bold'>
                {dataToGetManageDashboard.data.totalQuestionCount}
              </p>
            </InfoArea>
          )}

          {isLoadingToGetManageDashboard ? (
            <Skeleton className='rounded-xl shadow' />
          ) : (
            <InfoArea>
              <h3 className='text-sm text-gray-500 select-none'>
                登録問題集数
              </h3>
              <p className='text-2xl font-bold'>
                {dataToGetManageDashboard.data.totalExerciseCount}
              </p>
            </InfoArea>
          )}
        </div>
      </section>
    </div>
  )
}
