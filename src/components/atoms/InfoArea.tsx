import { joincn } from "@/lib/functions/joincn"

type Props = {
  children: React.ReactNode
  sizeMode?: "none" | "full"
}

export function InfoArea({ children, sizeMode }: Props) {
  const sizeClass = sizeMode === "full" ? "w-full" : ""
  return (
    <div className={joincn(`bg-white rounded-xl p-4 shadow`, sizeClass)}>
      {children}
    </div>
  )
}
