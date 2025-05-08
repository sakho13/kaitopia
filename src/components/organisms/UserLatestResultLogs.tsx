"use client"

import { useGetUserResultsLogs } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { encodeBase64 } from "@/lib/functions/encodeBase64"
import { joincn } from "@/lib/functions/joincn"
import { InfoArea } from "../atoms/InfoArea"

export function UserLatestResultLogs() {
  const { dataToGetUserResultLogs, totalCountToGetUserResultLogs } =
    useGetUserResultsLogs()

  if (totalCountToGetUserResultLogs < 1) {
    return (
      <InfoArea colorMode='white'>
        <p className='select-none text-text'>
          最近のアクティビティはありません
        </p>
      </InfoArea>
    )
  }

  return (
    <InfoArea colorMode='white'>
      {dataToGetUserResultLogs.map((l) => {
        const createdAtt = DateUtility.convertToLocalDate(l.createdAt)
        const isInProgress = l.isInProgress

        return (
          <div
            key={encodeBase64(l.answerLogSheetId)}
            className={joincn("select-none", "flex gap-4")}
          >
            <div>
              <span className='text-gray-500'>
                {DateUtility.formatDateTime(createdAtt)}
              </span>
            </div>

            <div>
              <span className='text-text'>
                {l.exercise ? `問題集「${l.exercise.title}」` : ""}
              </span>
            </div>
            <div>
              {l.totalCorrectCount} / {l.totalQuestionCount}問
              {isInProgress && " 🏃"}
            </div>
          </div>
        )
      })}
    </InfoArea>
  )
}
