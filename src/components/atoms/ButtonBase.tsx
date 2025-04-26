import { joincn } from "@/lib/functions/joincn"

type Props = {
  children: React.ReactNode
  sizeMode?: "fit" | "full"
  colorMode?: "primary" | "smart" | "ghost" | "outline" | "danger"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function ButtonBase({
  children,
  sizeMode = "fit",
  colorMode = "smart",
  className,
  ...args
}: Props) {
  const size = sizeMode === "full" ? "w-full" : "w-fit"

  const colorMap = {
    primary: "bg-primary text-text-on-color hover:bg-primary-hover",
    smart: "bg-smart text-text-on-color hover:bg-smart-hover",
    ghost: "bg-gray-200 hover:bg-gray-300",
    outline: "border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-text-on-color hover:bg-red-700",
  }

  return (
    <button
      {...args}
      className={joincn(
        size,
        colorMap[colorMode],
        `hover:cursor-pointer`,
        `py-2 rounded-xl`,
        `transition`,
        `flex items-center justify-center gap-2`,
        className ?? "",
      )}
    >
      {children}
    </button>
  )
}
