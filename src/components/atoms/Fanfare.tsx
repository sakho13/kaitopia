"use client"

import { useEffect } from "react"

export function Fanfare() {
  useEffect(() => {
    const container = document.createElement("div")
    container.className =
      "fanfare-container pointer-events-none fixed inset-0 overflow-hidden"
    document.body.appendChild(container)

    const createPetal = (side: "left" | "right") => {
      const el = document.createElement("span")
      el.className = `fanfare-petal fanfare-${side}`
      el.style.setProperty(
        "--x",
        side === "left"
          ? `${40 + Math.random() * 60}px`
          : `${-40 - Math.random() * 60}px`,
      )
      el.style.setProperty("--y", `${-150 - Math.random() * 100}px`)
      el.style.setProperty("--duration", `${2 + Math.random()}s`)
      container.appendChild(el)
      el.addEventListener("animationend", () => el.remove())
    }

    const timer = setInterval(() => {
      createPetal("left")
      createPetal("right")
    }, 200)

    const timeout = setTimeout(() => {
      clearInterval(timer)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(timeout)
      container.remove()
    }
  }, [])

  return null
}
