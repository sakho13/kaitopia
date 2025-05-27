import { joincn } from "@/lib/functions/joincn"
import { ReactNode } from "react"

type BorderColor = {
  progress: number
  color: string
}

type Props = {
  progress: number
  colorBorders?: BorderColor[]
  cursor?: ReactNode
}

export function ThinProgressBar({ progress, colorBorders, cursor }: Props) {
  const barColor = colorBorders
    ? colorBorders
        .sort((a, b) => a.progress - b.progress)
        .reduce((p, c) => {
          if (progress >= c.progress) {
            return c.color
          }
          return p
        }, "#d3d3d3")
    : "#d3d3d3"

  return (
    <div
      className={joincn(`h-1 rounded-full w-full relative`)}
      style={{ backgroundColor: "#f8f8f8" }}
    >
      <div
        className='h-1 rounded-full w-full'
        style={{
          width: `${progress}%`,
          backgroundColor: barColor,
          transition: "width 0.5s ease-in-out",
        }}
      />

      {cursor && (
        <div
          className='absolute top-[-19px] translate-x-[-50%]'
          style={{
            left: `${progress}%`,
          }}
        >
          {cursor}
        </div>
      )}
    </div>
  )
}
