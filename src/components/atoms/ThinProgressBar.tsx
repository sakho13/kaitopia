import { joincn } from "@/lib/functions/joincn"

type BorderColor = {
  progress: number
  color: string
}

type Props = {
  progress: number
  colorBorders?: BorderColor[]
}

export function ThinProgressBar({ progress, colorBorders }: Props) {
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
      className={joincn(`h-1 rounded-full w-full`)}
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
    </div>
  )
}
