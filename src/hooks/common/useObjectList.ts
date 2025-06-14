import { useState } from "react"

type Props<T> = {
  initialValue?: T[]

  appendEnd?: boolean
}

export function useObjectList<T>({ initialValue, appendEnd }: Props<T>) {
  const [list, setList] = useState<T[]>(initialValue || [])

  const onChangeObject = (index: number, newObject: T) => {
    setList((prev) => {
      const newList = [...prev]
      newList[index] = newObject
      return newList
    })
  }

  const addObject = (object: T) => {
    if (appendEnd) {
      setList((prev) => [...prev, object])
    } else {
      setList((prev) => [object, ...prev])
    }
  }

  const removeObject = (index: number) => {
    setList((prev) => prev.filter((_, i) => i !== index))
  }

  const clearList = () => {
    setList([])
  }

  const resetList = (newValue: T[] = initialValue ?? []) => {
    setList(newValue)
  }

  return {
    list,
    onChangeObject,
    addObject,
    removeObject,
    clearList,
    resetList,
  }
}
