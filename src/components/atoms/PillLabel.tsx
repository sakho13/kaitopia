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
  red: {
    background: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-600/10",
  },
  yellow: {
    background: "bg-yellow-50",
    text: "text-yellow-800",
    ring: "ring-yellow-600/20",
  },
  green: {
    background: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-600/20",
  },
  blue: {
    background: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-700/10",
  },
  indigo: {
    background: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-700/10",
  },
  purple: {
    background: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-700/10",
  },
  pink: {
    background: "bg-pink-50",
    text: "text-pink-700",
    ring: "ring-pink-700/10",
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
