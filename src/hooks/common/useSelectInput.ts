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

  const onChange = (newValue: T) => {
    setSelectedValue(newValue)
  }

  return {
    selectedValue,
    onChange,
    selectOptions,
  }
}
