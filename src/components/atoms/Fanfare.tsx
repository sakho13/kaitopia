"use client"

import { useEffect } from "react"

export function Fanfare() {
  useEffect(() => {
    const left = document.createElement("div")
    left.style.position = "fixed"
    left.style.left = "0"
    left.style.bottom = "0"
    const right = document.createElement("div")
    right.style.position = "fixed"
    right.style.right = "0"
    right.style.bottom = "0"
    document.body.appendChild(left)
    document.body.appendChild(right)

    import("party-js").then((party) => {
      party.confetti(left, {
        count: party.variation.range(20, 40),
        angle: 60,
        spread: 80,
      })
      party.confetti(right, {
        count: party.variation.range(20, 40),
        angle: 120,
        spread: 80,
      })
      setTimeout(() => {
        left.remove()
        right.remove()
      }, 4000)
    })

    return () => {
      left.remove()
      right.remove()
    }
  }, [])

  return null
}
