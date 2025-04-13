import { joincn } from "@/lib/functions/joincn"

type Props = {
  children: React.ReactNode
  sizeMode?: "none" | "full"
  colorMode?: "white" | "bg-subtle"
  className?: string
  onClick?: () => void
}

export function InfoArea({
  children,
  sizeMode,
  colorMode,
  className,
  onClick,
}: Props) {
  const sizeClass = sizeMode === "full" ? "w-full" : ""
  const colorClass = colorMode === "white" ? "bg-white" : "bg-background-subtle"
  return (
    <div
      className={joincn(
        colorClass,
        `rounded-xl p-4 shadow`,
        sizeClass,
        className ?? "",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
