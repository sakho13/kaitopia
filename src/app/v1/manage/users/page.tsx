"use client"

import { Pencil, Trash2 } from "lucide-react"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import { useUserConfigStore } from "@/hooks/stores/useUserConfigStore"
import {
  useDeleteManageGuestUsersOver5days,
  useGetManageUsers,
} from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { encodeBase64 } from "@/lib/functions/encodeBase64"
import { useToast } from "@/hooks/useToast"
import { joincn } from "@/lib/functions/joincn"

export default function Page() {
  const { config } = useUserConfigStore()
  const { showSuccess, showError } = useToast()
  const {
    dataToGetManageUsers,
    totalCountToGetManageUsers,
    isLoadingToGetManageUsers,
    loadMoreToGetManageUsers,
    refetchGetManageUsers,
  } = useGetManageUsers()
  const { requestDeleteGuestUsers } = useDeleteManageGuestUsersOver5days()

  const deleteGuestUsers = async () => {
    if (confirm("5日間を経過したゲストユーザを削除しますか？")) {
      const result = await requestDeleteGuestUsers()
      if (result.success) {
        showSuccess(
          `ゲストユーザを削除しました ${result.data.deletedUserCount} 名`,
        )
        refetchGetManageUsers() // ユーザ一覧を再取得
        return
      }

      showError(
        `ゲストユーザの削除に失敗しました。 (${result.errors
          .map((e) => JSON.stringify(e))
          .join(", ")})`,
      )
    }
  }

  if (!("role" in config.userInfo)) {
    return <p>loading...</p>
  }

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
              <ButtonBase onClick={deleteGuestUsers}>ゲストクリア</ButtonBase>
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
                className={joincn(
                  "border-t hover:bg-gray-50",
                  user.deletedAt
                    ? "opacity-50 hover:cursor-not-allowed hover:bg-gray-100"
                    : "",
                )}
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

                  {!user.deletedAt && config.userInfo.role === "ADMIN" ? (
                    <ButtonBase
                      colorMode='danger'
                      className='px-4 py-2'
                      // onClick={() => {
                      //   setOpenDeleteExerciseDialog(exercise.exerciseId)
                      // }}
                    >
                      <Trash2 size={16} strokeWidth={3} />
                    </ButtonBase>
                  ) : null}
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
