"use client"

import { useEffect, useState } from "react"
import { useUserConfigStore } from "@/hooks/stores/useUserConfigStore"
import { useGetUserInfo } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { RoundedFrame } from "../atoms/RoundedFrame"
import { ButtonBase } from "../atoms/ButtonBase"
import { Skeleton } from "../ui/skeleton"

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
          <input
            type='text'
            className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
            value={editParams.name}
            onChange={(e) => editParams.onChangeName(e.target.value)}
          />
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
            <ButtonBase
              colorMode='primary'
              onClick={handleSave}
              className='px-4'
            >
              保存
            </ButtonBase>

            <ButtonBase colorMode='ghost' onClick={cancelEdit} className='px-4'>
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
  const { dataTooGetUserInfo, isLoadingToGetUserInfo } = useGetUserInfo()
  const { config } = useUserConfigStore.getState()

  const [name, setName] = useState(
    dataTooGetUserInfo?.success ? dataTooGetUserInfo.data.user.name : "",
  )
  const [nameError, setNameError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)

  const onChangeName = (value: string) => {
    if (nameError !== null) {
      setNameError(null)
    }
    setName(value)
  }

  const toEdit = () => setIsEditing(true)
  const cancelEdit = () => {
    setName(
      dataTooGetUserInfo?.success ? dataTooGetUserInfo.data.user.name : "",
    )
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!_checkName(name)) return

    // TODO: API実装後に実装する
  }

  const _checkName = (name: string) => {
    if (name.length === 0) {
      setNameError("名前を入力してください")
      return false
    }
    if (name.length > 20) {
      setNameError("名前は20文字以内で入力してください")
      return false
    }
    return true
  }

  useEffect(() => {
    if (dataTooGetUserInfo?.success) {
      setName(dataTooGetUserInfo.data.user.name)
    }
  }, [dataTooGetUserInfo])

  return {
    isLoadingToGetUserInfo,
    isGuestUser: config.isGuest,
    editParams: {
      name,
      onChangeName,
    },
    registeredAt:
      dataTooGetUserInfo?.success && dataTooGetUserInfo.data.user.createdAt
        ? DateUtility.formatDateTime(
            DateUtility.convertToLocalDate(
              dataTooGetUserInfo.data.user.createdAt,
            ),
          )
        : "-",
    isEditing,
    toEdit,
    cancelEdit,
    handleSave,
  }
}
