import { ReactNode } from "react"
import { joincn } from "@/lib/functions/joincn"

type Props = {
  children: ReactNode
  sizeMode?: "none" | "full"
  disableAnimate?: boolean
  className?: string
  onClick?: () => void
}

/**
 * 情報エリアコンポーネント
 *
 */
export function PopCard({
  children,
  sizeMode,
  disableAnimate = false,
  className,
  onClick,
}: Props) {
  const sizeClass = sizeMode === "full" ? "w-full" : ""

  return (
    <article
      className={joincn(
        "group relative rounded-2xl border border-slate-200 bg-white/90 shadow-sm",
        disableAnimate
          ? ""
          : "transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:rotate-[0.6deg] hover:shadow-md",
        sizeClass,
        onClick ? "cursor-pointer" : "",
        className ?? "",
      )}
      onClick={onClick}
    >
      {/* corner sparkle */}
      <span className='pointer-events-none absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.2)_60%,transparent_70%)] animate-pulse' />

      <div className='p-5'>{children}</div>
    </article>
  )
}
