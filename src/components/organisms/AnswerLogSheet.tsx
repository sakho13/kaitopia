"use client"

import { encodeBase64ForUrl } from "@/lib/functions/encodeBase64"
import { RoundedFrame } from "../atoms/RoundedFrame"
import { useGetUserResultLogSheet } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { AnswerLogSheetExercise } from "../molecules/AnswerLogSheetExercise"

type Props = {
  answerLogSheetId: string
}

export function AnswerLogSheet({ answerLogSheetId }: Props) {
  const { dataToGetUserResultLogSheet } =
    useGetUserResultLogSheet(answerLogSheetId)

  if (!dataToGetUserResultLogSheet || !dataToGetUserResultLogSheet.success) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-gray-500 font-medium'>回答記録がありません。</p>
      </div>
    )
  }

  return (
    <div id={`answer-log-sheet-${encodeBase64ForUrl(answerLogSheetId)}`}>
      <RoundedFrame>
        <div className='select-none mb-4'>
          <p className='text-xl font-bold'>回答記録</p>

          <p className='text-sm text-gray-500 text-right'>
            <span className='font-bold'>回答開始:&nbsp;</span>
            <span>
              {DateUtility.formatDateTime(
                DateUtility.convertToLocalDate(
                  dataToGetUserResultLogSheet.data.createdAt,
                ),
              )}
            </span>
          </p>
        </div>

        {dataToGetUserResultLogSheet.data.exercise && (
          <AnswerLogSheetExercise data={dataToGetUserResultLogSheet.data} />
        )}
      </RoundedFrame>
    </div>
  )
}
