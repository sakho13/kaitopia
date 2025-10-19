import React from "react"
import { joincn } from "@/lib/functions/joincn"

/**
 * SlimeButtonのプロパティ
 */
type SlimeButtonProps = {
  /** ボタンの内容 */
  children: React.ReactNode
  /** クリックイベントハンドラー */
  onClick?: () => void
  /** ボタンのタイプ */
  type?: "button" | "submit" | "reset"
  /** ボタンの無効化 */
  disabled?: boolean
  /** サイズモード */
  sizeMode?: "fit" | "full"
  /** カラーモード */
  colorMode?: "primary" | "smart" | "ghost" | "outline" | "danger"
}

/**
 * 液体/スライム表現のボタンコンポーネント
 *
 * グーイーエフェクト（gooey droplets）を持つモダンなボタン。
 * SVGフィルター（id="goo"）が必要です。
 *
 * @example
 * ```tsx
 * <SlimeButton colorMode="primary" onClick={handleClick}>
 *   ログイン
 * </SlimeButton>
 * ```
 */
export function SlimeButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  sizeMode = "fit",
  colorMode = "primary",
}: SlimeButtonProps) {
  const size = sizeMode === "full" ? "w-full" : "w-fit"

  const bgColorMap = {
    primary: "bg-primary text-text-on-color",
    smart: "bg-smart text-text-on-color",
    ghost: "bg-gray-200 text-slate-700",
    outline: "bg-white border border-gray-300 text-slate-700",
    danger: "bg-red-600 text-text-on-color",
  }

  const hoverColorMap = {
    primary: "hover:bg-primary-hover",
    smart: "hover:bg-smart-hover",
    ghost: "hover:bg-gray-300",
    outline: "hover:bg-gray-50",
    danger: "hover:bg-red-700",
  }

  const ringColorMap = {
    primary: "hover:ring-primary/60",
    smart: "hover:ring-smart/60",
    ghost: "hover:ring-gray-400/40",
    outline: "hover:ring-gray-300/60",
    danger: "hover:ring-red-200/60",
  }

  const dropletColorMap = {
    primary: { main: "bg-cyan-300/90", sub: "bg-cyan-200/90" },
    smart: { main: "bg-purple-300/90", sub: "bg-purple-200/90" },
    ghost: { main: "bg-gray-400/90", sub: "bg-gray-300/90" },
    outline: { main: "bg-gray-400/90", sub: "bg-gray-300/90" },
    danger: { main: "bg-red-400/90", sub: "bg-red-300/90" },
  }

  return (
    <div
      className={`relative inline-block ${size}`}
      style={{ filter: "url(#goo)" }}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={joincn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow ring-0 hover:ring-4 transition disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:cursor-pointer",
          size,
          bgColorMap[colorMode],
          hoverColorMap[colorMode],
          ringColorMap[colorMode],
        )}
      >
        {children}
      </button>
      {/* drifting droplets (decor) */}
      <span
        className={joincn(
          "pointer-events-none absolute -left-2 top-1.5 h-2.5 w-2.5 rounded-full",
          dropletColorMap[colorMode].main,
        )}
        style={{ animation: "drop-drift-1 3.2s ease-in-out infinite" }}
        aria-hidden
      />
      <span
        className={joincn(
          "pointer-events-none absolute -left-0.5 -bottom-1 h-1.5 w-1.5 rounded-full",
          dropletColorMap[colorMode].sub,
        )}
        style={{ animation: "drop-drift-2 2.8s ease-in-out infinite" }}
        aria-hidden
      />
    </div>
  )
}
