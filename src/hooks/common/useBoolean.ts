import { useCallback, useState } from "react"

/**
 * booleanステートを便利に使うためのカスタムフック
 * @description 固定値セット、トグルに対応
 * @param initialValue 初期値
 * @returns
 */
export function useBoolean(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)

  const onChange = useCallback((newValue: boolean) => {
    setValue(newValue)
  }, [])

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return { value, onChange, toggle }
}
