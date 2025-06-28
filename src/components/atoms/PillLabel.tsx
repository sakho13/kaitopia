import { joincn } from "@/lib/functions/joincn"

type Props = {
  label: string
  colorMode: keyof typeof ColorMap
}

const ColorMap = {
  gray: {
    background: "bg-gray-50",
    text: "text-gray-600",
    ring: "ring-gray-500/10",
  },
}

export function PillLabel({ label, colorMode }: Props) {
  const { background, text, ring } = ColorMap[colorMode]
  return (
    <span
      className={joincn(
        `${background} ${text} ${ring}`,
        "inline-flex items-center rounded-md",
        "ring-1 ring-inset",
        "font-medium text-xs",
        "px-2 py-1",
        "select-none",
      )}
    >
      {label}
    </span>
  )
}
