import { useState, useRef, useEffect } from "react"
import { Pencil } from "lucide-react"

interface EditableTextInputBaseProps {
  value: string
  onChange: (newValue: string) => void
  className?: string
  inputClassName?: string
}

export function EditableTextInputBase({
  value,
  onChange,
  className = "",
  inputClassName = "",
}: EditableTextInputBaseProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setDraft(value)
  }, [value])

  const handleConfirm = () => {
    if (draft.trim() !== "") {
      onChange(draft.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setIsEditing(false)
  }

  return (
    <div
      className={`flex items-center space-x-2 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type='text'
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleConfirm}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm()
            if (e.key === "Escape") handleCancel()
          }}
          className={`border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary ${inputClassName}`}
        />
      ) : (
        <div className='flex items-center space-x-1'>
          <span>{value}</span>
          <button
            onClick={() => setIsEditing(true)}
            className='p-2 py-2 rounded hover:bg-gray-100 hover:cursor-pointer'
          >
            <Pencil size={18} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  )
}
