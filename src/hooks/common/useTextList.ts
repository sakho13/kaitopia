import { useState } from "react"

type Props = {
  /**
   * 初期のテキストリスト
   * @default []
   */
  initialTextList?: string[]

  /**
   * リストの末尾に追加するかどうか
   * trueの場合、addTextで追加されたテキストはリストの末尾に追加されます。
   * @default false
   */
  appendEnd?: boolean
}

/**
 * リスト構造のテキストを管理するためのカスタムフック
 */
export function useTextList({
  initialTextList = [],
  appendEnd = false,
}: Props) {
  const [textList, setTextList] = useState<string[]>(initialTextList)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingText, setEditingText] = useState<string>("")

  const addText = (text: string) => {
    if (appendEnd) {
      setTextList((prev) => [...prev, text])
    } else {
      setTextList((prev) => [text, ...prev])
    }
  }

  const removeText = (index: number) => {
    setTextList((prev) => prev.filter((_, i) => i !== index))
    setEditingIndex(null)
    setEditingText("")
  }

  /**
   * リストを**空配列**でクリアします。
   */
  const clearTextList = () => {
    setTextList([])
    setEditingIndex(null)
    setEditingText("")
  }

  /**
   * リストを**初期状態**にリセットします。
   */
  const resetTextList = () => {
    setTextList(initialTextList)
    setEditingIndex(null)
    setEditingText("")
  }

  /**
   * 指定したインデックスのテキストを編集モードにします。
   */
  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditingText(textList[index])
  }

  /**
   * 編集中のテキストを更新します。
   */
  const onChangeEditingText = (text: string) => {
    if (editingIndex === null) return
    setEditingText(text)
    setTextList((prev) => prev.map((t, i) => (i === editingIndex ? text : t)))
  }

  return {
    textList,
    editingIndex,
    editingText,
    addText,
    removeText,
    clearTextList,
    resetTextList,
    startEditing,
    onChangeEditingText,
  }
}
