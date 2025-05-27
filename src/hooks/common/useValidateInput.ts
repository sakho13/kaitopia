import { useState } from "react"

type Props<T> = {
  initialValue: T
  validate?: (value: T) => string | null
}

export function useValidateInput<T>({
  initialValue,
  validate = () => null,
}: Props<T>) {
  const [value, setValue] = useState<T>(initialValue)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const _onChange = (newValue: T) => {
    setValue(newValue)
    setErrorMessage(validate(newValue))
  }

  const _reset = (resetValue: T) => {
    setValue(resetValue)
    setErrorMessage(null)
  }

  return { value, errorMessage, onChange: _onChange, reset: _reset }
}
