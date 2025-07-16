"use client"

import { ButtonBase } from "../atoms/ButtonBase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { useBoolean } from "@/hooks/common/useBoolean"
import { useValidateInput } from "@/hooks/common/useValidateInput"
import { usePostUserQuit } from "@/hooks/useApiV1"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { Textarea } from "../ui/textarea"
import { useRouter } from "next/navigation"

export function UserQuitDialog() {
  const router = useRouter()
  const { signOut } = useAuth()
  const { showWarn, showInfo } = useToast()
  const { requestPostUserQuit } = usePostUserQuit()

  const { value: loading, onChange: onChangeLoading } = useBoolean(true)

  const { value: isOpen, onChange: onChangeDialog } = useBoolean(false)
  const {
    value: reason,
    onChange: _onChangeReason,
    errorMessage: reasonError,
    reset: _resetReason,
  } = useValidateInput({
    initialValue: "",
    validate: (value) => {
      if (value.length < 5) {
        return "退会理由は5文字以上で入力してください"
      }
      return null
    },
  })

  const quit = async () => {
    onChangeLoading(true)
    try {
      const result = await requestPostUserQuit({ reason })
      if (result.success) {
        await signOut()
        closeDialog()
        router.push("/")
        showInfo("退会処理が完了しました。")
        return
      }
      showWarn(result.errors[0].message)
    } catch (error) {
      console.error("Failed to quit>", error)
    } finally {
      onChangeLoading(false)
    }
  }

  const onChangeReason = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    _onChangeReason(e.target.value)
  }

  const closeDialog = () => {
    onChangeDialog(false)
    _resetReason("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChangeDialog}>
      <DialogTrigger className='font-bold underline hover:cursor-pointer hover:text-primary'>
        退会する
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>退会する</DialogTitle>
          <DialogDescription>本当に退会しますか？</DialogDescription>
        </DialogHeader>

        <div>
          <Textarea
            value={reason}
            onChange={onChangeReason}
            placeholder='退会理由を入力してください'
            rows={5}
            disabled={loading}
          />
          {reasonError && <p className='text-red-500'>{reasonError}</p>}
        </div>

        <DialogFooter>
          <ButtonBase
            colorMode='ghost'
            onClick={closeDialog}
            disabled={loading}
          >
            キャンセル
          </ButtonBase>
          <ButtonBase
            colorMode={reason && !reasonError ? "primary" : "ghost"}
            disabled={reason === "" || !!reasonError || loading}
            disableHover={reason === "" || !!reasonError || loading}
            onClick={quit}
          >
            退会する
          </ButtonBase>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
