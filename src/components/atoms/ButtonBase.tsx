import { joincn } from "@/lib/functions/joincn"

type Props = {
  children: React.ReactNode
  sizeMode?: "fit" | "full"
  colorMode?: "primary" | "smart" | "ghost" | "outline" | "danger"
  disableHover?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function ButtonBase({
  children,
  sizeMode = "fit",
  colorMode = "smart",
  className,
  disableHover = false,
  ...args
}: Props) {
  const size = sizeMode === "full" ? "w-full" : "w-fit"

  const bgColorMap = {
    primary: "bg-primary text-text-on-color",
    smart: "bg-smart text-text-on-color",
    ghost: "bg-gray-200",
    outline: "border border-gray-300",
    danger: "bg-red-600 text-text-on-color",
  }

  const hoverColorMap = {
    primary: "hover:bg-primary-hover",
    smart: "hover:bg-smart-hover",
    ghost: "hover:bg-gray-300",
    outline: "hover:bg-gray-50",
    danger: "hover:bg-red-700",
  }

  return (
    <button
      {...args}
      className={joincn(
        size,
        bgColorMap[colorMode],
        disableHover ? "" : hoverColorMap[colorMode] + " hover:cursor-pointer",
        `py-2 px-4 rounded-xl`,
        `transition`,
        `flex items-center justify-center gap-2`,
        className ?? "",
      )}
    >
      {children}
    </button>
  )
}
