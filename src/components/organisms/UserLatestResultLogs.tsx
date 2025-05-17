"use client"

import { useRouter } from "next/navigation"
import { useGetUserResultsLogs } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { encodeBase64, encodeBase64ForUrl } from "@/lib/functions/encodeBase64"
import { joincn } from "@/lib/functions/joincn"
import { InfoArea } from "../atoms/InfoArea"
import { ThinMultiProgressBar } from "../atoms/ThinMultiProgressBar"

export function UserLatestResultLogs() {
  const router = useRouter()
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
      {dataToGetUserResultLogs.map((l, i) => {
        const createdAtt = DateUtility.convertToLocalDate(l.createdAt)
        const isInProgress = l.isInProgress

        return (
          <div
            key={encodeBase64(l.answerLogSheetId)}
            className={joincn("select-none", i === 0 ? "" : "mt-4")}
          >
            <div
              className={joincn(
                "flex gap-4 px-4",
                l.isInProgress ? "" : "hover:cursor-pointer hover:opacity-80",
              )}
              onClick={() => {
                if (l.isInProgress) return

                router.push(
                  `/v1/user/result/logs?answerLogSheetId=${encodeBase64ForUrl(
                    l.answerLogSheetId,
                  )}`,
                )
              }}
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

            <div>
              <ThinMultiProgressBar
                totalProgress={l.totalQuestionCount}
                progresses={[
                  { progress: l.totalUnansweredCount, color: "#d3d3d3" },
                  { progress: l.totalCorrectCount, color: "#98d0ff" },
                  { progress: l.totalIncorrectCount, color: "#ff6b6b" },
                ]}
              />
            </div>
          </div>
        )
      })}
    </InfoArea>
  )
}
