import { joincn } from "@/lib/functions/joincn"

type ProgressProp = {
  progress: number
  color: string
}

type Props = {
  totalProgress: number
  progresses: ProgressProp[]
}

export function ThinMultiProgressBar({ progresses, totalProgress }: Props) {
  return (
    <div
      className={joincn(`h-1 rounded-full w-full flex`)}
      style={{ backgroundColor: "#f8f8f8" }}
      aria-label='進捗バー'
      aria-valuenow={progresses.reduce((acc, p) => acc + p.progress, 0)}
      aria-valuemin={0}
      aria-valuemax={totalProgress}
    >
      {progresses.map((p, i) => {
        const barColor = p.color
        const safeTotalProgress = totalProgress === 0 ? 1 : totalProgress
        const progress = (p.progress / safeTotalProgress) * 100

        return (
          <div
            key={i}
            className={joincn(
              "h-1",
              i === 0 ? "rounded-l-full" : "",
              i === progresses.length - 1 ? "rounded-r-full" : "",
            )}
            style={{
              width: `${progress}%`,
              backgroundColor: barColor,
              transition: "width 0.5s ease-in-out",
            }}
          />
        )
      })}
    </div>
  )
}
