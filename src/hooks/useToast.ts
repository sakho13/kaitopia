import { toast } from "react-toastify"

export function useToast() {
  /**
   * `toast.info()`
   */
  const showInfo = (message: string) => {
    toast.info(message)
  }

  /**
   * `toast.info()`
   * @description `autoClose: 8000ms`
   */
  const showInfoLong = (message: string) => {
    toast.info(message, { autoClose: 8000 })
  }

  /**
   * `toast.success()`
   */
  const showSuccess = (message: string) => {
    toast.success(message)
  }

  /**
   * `toast.success()`
   * @description `autoClose: 2000ms`
   */
  const showSuccessShort = (message: string) => {
    toast.success(message, { autoClose: 2000 })
  }

  /**
   * `toast.error()`
   */
  const showError = (message: string) => {
    toast.error(message)
  }

  return {
    showInfoLong,
    showInfo,

    showSuccess,
    showSuccessShort,

    showError,
  }
}
