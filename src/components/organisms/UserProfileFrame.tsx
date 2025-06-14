"use client"

import { useEffect, useState } from "react"
import { useUserConfigStore } from "@/hooks/stores/useUserConfigStore"
import { useGetUserInfo, usePatchUserInfo } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { RoundedFrame } from "../atoms/RoundedFrame"
import { ButtonBase } from "../atoms/ButtonBase"
import { Skeleton } from "../ui/skeleton"
import { STATICS } from "@/lib/statics"
import { useToast } from "@/hooks/useToast"
import { useValidateInput } from "@/hooks/common/useValidateInput"

export function UserProfileFrame() {
  const {
    isLoadingToGetUserInfo,
    isGuestUser,
    editParams,
    registeredAt,
    isEditing,
    toEdit,
    cancelEdit,
    handleSave,
  } = useUserProfileFrame()

  return (
    <RoundedFrame>
      <h1 className='text-2xl font-bold mb-6 select-none'>プロフィール</h1>

      {isGuestUser ? (
        <div className='mb-4 select-none'>
          <label className='block text-sm font-medium mb-1'>ゲストユーザ</label>
          <p className='text-lg text-gray-700'>
            ゲストとしてログインしています。
          </p>
        </div>
      ) : null}

      {/* 名前 */}
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1 select-none'>
          名前
        </label>
        {isLoadingToGetUserInfo ? (
          <Skeleton className='w-full h-[50px]' />
        ) : isEditing ? (
          <div className='relative'>
            <div className='absolute text-sm text-gray-500 top-1 right-3 flex items-center gap-1'>
              <p className='w-fit'>{editParams.name.length}/20</p>
            </div>

            <input
              type='text'
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
              value={editParams.name}
              onChange={(e) => editParams.onChangeName(e.target.value)}
            />

            <div>
              <p
                className={`text-sm mt-1 ${
                  editParams.nameError ? "text-red-500" : "text-gray-500"
                }`}
              >
                {editParams.nameError ?? "名前を入力してください(20文字以内)"}
              </p>
            </div>
          </div>
        ) : (
          <p className='text-lg'>{editParams.name}</p>
        )}
      </div>

      {/* 登録日 */}
      <div className='mb-4 select-none'>
        <label className='block text-sm font-medium mb-1'>登録日</label>
        <p className='text-lg'>{registeredAt}</p>
      </div>

      {/* ボタン */}
      <div className='mt-6 flex gap-4 justify-end'>
        {isEditing ? (
          <>
            <ButtonBase colorMode='primary' onClick={handleSave}>
              保存
            </ButtonBase>

            <ButtonBase colorMode='ghost' onClick={cancelEdit}>
              キャンセル
            </ButtonBase>
          </>
        ) : (
          <ButtonBase
            colorMode={isGuestUser ? "ghost" : "primary"}
            onClick={toEdit}
            className={isGuestUser ? "px-4" : ""}
            disabled={isGuestUser}
            title={
              isGuestUser
                ? "ゲストユーザは編集できません"
                : "現在、編集機能はご利用できません。"
            }
          >
            編集
          </ButtonBase>
        )}
      </div>
    </RoundedFrame>
  )
}

function useUserProfileFrame() {
  const { requestPatchUserInfo } = usePatchUserInfo()
  const { dataToGetUserInfo, isLoadingToGetUserInfo, refetchUserInfo } =
    useGetUserInfo()
  const { config } = useUserConfigStore()
  const { showSuccessShort, showError } = useToast()

  const {
    value: name,
    errorMessage: nameError,
    onChange: onChangeName,
    reset: resetName,
  } = useValidateInput({
    initialValue: dataToGetUserInfo?.success
      ? dataToGetUserInfo.data.user.name
      : "",
    validate: (value: string) => _checkName(value),
  })

  const [isEditing, setIsEditing] = useState(false)

  const toEdit = () => setIsEditing(true)

  const handleSave = async () => {
    const resultCheckName = _checkName(name)
    if (resultCheckName) return
    if (dataToGetUserInfo?.success === false) return

    const trimmedName = name.trim()
    const editName = dataToGetUserInfo?.data.user.name !== trimmedName

    const saveResult = await requestPatchUserInfo({
      user: {
        name: editName ? trimmedName : undefined,
        birthDayDate: undefined, // 生年月日は編集しない
      },
    })

    if (!saveResult.success) {
      showError("プロフィールの更新に失敗しました。もう一度お試しください。")
      return
    }

    const res = await refetchUserInfo()

    if (!res?.success) return
    // 編集完了
    _resetEdit(res)
    showSuccessShort("プロフィールを更新しました")
  }

  const cancelEdit = () => {
    _resetEdit(dataToGetUserInfo)
  }

  const _checkName = (name: string) => {
    if (name.length < STATICS.VALIDATE.NAME.MIN_LENGTH) {
      return "名前を入力してください"
    }
    if (name.length > STATICS.VALIDATE.NAME.MAX_LENGTH) {
      return `名前は${STATICS.VALIDATE.NAME.MAX_LENGTH}文字以内で入力してください`
    }
    return null
  }

  const _resetEdit = (
    rawData: ReturnType<typeof useGetUserInfo>["dataToGetUserInfo"],
  ) => {
    if (!rawData || !rawData.success) {
      setIsEditing(false)
      return
    }

    resetName(rawData.data.user.name)
    setIsEditing(false)
  }

  useEffect(() => {
    if (!dataToGetUserInfo || !dataToGetUserInfo.success) return

    resetName(dataToGetUserInfo.data.user.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataToGetUserInfo])

  return {
    isLoadingToGetUserInfo,
    isGuestUser: config.isGuest,
    editParams: {
      name,
      onChangeName,
      nameError,
    },
    registeredAt:
      dataToGetUserInfo?.success && dataToGetUserInfo.data.user.createdAt
        ? DateUtility.formatDateTime(
            DateUtility.convertToLocalDate(
              dataToGetUserInfo.data.user.createdAt,
            ),
          )
        : "-",
    isEditing,
    toEdit,
    cancelEdit,
    handleSave,
  }
}
