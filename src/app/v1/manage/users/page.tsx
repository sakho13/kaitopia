"use client"

import { Pencil, Trash2 } from "lucide-react"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import { useUserConfigStore } from "@/hooks/stores/useUserConfigStore"
import { useGetManageUsers } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { encodeBase64 } from "@/lib/functions/encodeBase64"

export default function Page() {
  const { config } = useUserConfigStore.getState()
  const {
    dataToGetManageUsers,
    totalCountToGetManageUsers,
    isLoadingToGetManageUsers,
    loadMoreToGetManageUsers,
  } = useGetManageUsers()

  return (
    <div>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-semibold select-none'>
            利用中のユーザ{" "}
            <span className='text-gray-600 font-medium'>
              {totalCountToGetManageUsers}人
            </span>
          </h3>

          {config.userInfo.role === "ADMIN" && (
            <div>
              <ButtonBase>ゲストクリア</ButtonBase>
            </div>
          )}
        </div>

        <table className='w-full bg-white shadow rounded-xl overflow-hidden'>
          <thead className='bg-background-subtle text-left text-sm'>
            <tr>
              <th className='py-2'></th>
              <th className='px-4 py-2 text-center'>ユーザ名</th>
              <th className='px-4 py-2 text-center'>ロール</th>
              <th className='px-4 py-2 text-center'>作成日(最終更新日)</th>
              <th className='px-4 py-2 text-center'>操作</th>
            </tr>
          </thead>

          <tbody>
            {dataToGetManageUsers.map((user, i) => (
              <tr
                key={encodeBase64(user.id)}
                className='border-t hover:bg-gray-50'
              >
                <td className='px-1 py-2 text-center select-none'>{i + 1}</td>
                <td className='px-4 py-2 max-w-32 text-nowrap overflow-x-clip text-ellipsis'>
                  {user.name}
                </td>
                <td className='px-4 py-2 text-center'>
                  {user.isGuest ? "ゲスト" : user.role}
                </td>
                <td className='px-4 py-2 text-center'>
                  {DateUtility.formatDateTime(
                    DateUtility.convertToLocalDate(user.createdAt ?? ""),
                  )}
                  &nbsp;
                  <span className='text-sm text-gray-500'>
                    (
                    {DateUtility.formatDateTime(
                      DateUtility.convertToLocalDate(user.updatedAt ?? ""),
                    )}
                    )
                  </span>
                </td>

                <td className='px-4 py-2 space-x-2 text-sm flex text-center'>
                  <ButtonBase
                    sizeMode='fit'
                    colorMode='primary'
                    className='px-4 py-2'
                    // onClick={() =>
                    //   router.push(
                    //     `/v1/manage/exercises/${encodeURIComponent(
                    //       encodeBase64(exercise.exerciseId),
                    //     )}`,
                    //   )
                    // }
                  >
                    <Pencil size={16} strokeWidth={3} />
                  </ButtonBase>

                  <ButtonBase
                    colorMode='danger'
                    className='px-4 py-2'
                    // onClick={() => {
                    //   setOpenDeleteExerciseDialog(exercise.exerciseId)
                    // }}
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </ButtonBase>
                </td>
              </tr>
            ))}

            <tr className='py-8 text-center'>
              <td colSpan={4} className='px-4 py-2'>
                {totalCountToGetManageUsers === 0 ? (
                  <span className='select-none'>
                    登録されたユーザはありません
                  </span>
                ) : (
                  <button
                    onClick={loadMoreToGetManageUsers}
                    disabled={isLoadingToGetManageUsers}
                    className={
                      isLoadingToGetManageUsers
                        ? ""
                        : "hover:underline hover:cursor-pointer"
                    }
                  >
                    {isLoadingToGetManageUsers
                      ? "読み込み中..."
                      : "さらに読み込む"}
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
