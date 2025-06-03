import { useState } from "react"

type Props<T> = {
  /**
   * セレクトボックスの選択肢
   */
  selectOptions: T[]
  /**
   * 初期値
   */
  initialValue?: T | null
}

/**
 * セレクトボックスの入力を管理するカスタムフック
 */
export function useSelectInput<T>({ selectOptions, initialValue }: Props<T>) {
  const [selectedValue, setSelectedValue] = useState<T | null>(
    initialValue ?? null,
  )

  const onChange = (newValue: unknown) => {
    if (!_isValidValue(newValue)) return
    setSelectedValue(newValue)
  }

  const _isValidValue = (value: unknown): value is T => {
    return selectOptions.includes(value as T)
  }

  return {
    selectedValue,
    onChange,
    selectOptions,
  }
}
