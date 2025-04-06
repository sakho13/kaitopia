import { joincn } from "@/functions/joincn"

type Props = {
  children: React.ReactNode
  sizeMode?: "fit" | "full"
  colorMode?: "primary" | "secondary" | "tertiary" | "outline"
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function ButtonBase({
  children,
  sizeMode = "fit",
  colorMode = "primary",
  onClick,
  className,
  ...args
}: Props) {
  const size = sizeMode === "full" ? "w-full" : "w-fit"

  const colorMap = {
    primary: "bg-primary text-text-on-color hover:bg-primary-hover",
    secondary: "bg-secondary text-text-on-color hover:bg-secondary-hover",
    tertiary: "bg-tertiary text-text-on-color hover:bg-tertiary-hover",
    outline: "border border-gray-300 hover:bg-gray-50",
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
      onClick={onClick}
    >
      {children}
    </button>
  )
}
