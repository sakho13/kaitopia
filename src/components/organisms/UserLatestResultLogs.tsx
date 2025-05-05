"use client"

import { useGetUserResultsLogs } from "@/hooks/useApiV1"
import { encodeBase64 } from "@/lib/functions/encodeBase64"

export function UserLatestResultLogs() {
  const {
    dataToGetUserResultLogs,
    isLoadingToGetUserResultLogs,
    totalCountToGetUserResultLogs,
    refetchGetUserResultLogs,
    loadMoreToGetUserResultLogs,
  } = useGetUserResultsLogs()

  if (totalCountToGetUserResultLogs < 1) {
    return (
      <div>
        <p className='select-none text-text'>
          最近のアクティビティはありません
        </p>
      </div>
    )
  }

  return (
    <div>
      {dataToGetUserResultLogs.map((l) => {
        return (
          <div key={encodeBase64(l.answerLogSheetId)}>
            <p>{l.exercise?.title}</p>
          </div>
        )
      })}
    </div>
  )
}
