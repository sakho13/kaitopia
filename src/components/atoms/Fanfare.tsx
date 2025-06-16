"use client"

import { useEffect, useRef } from "react"

export function Fanfare() {
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    import("party-js").then(({ default: party }) => {
      if (!mounted) return
      if (leftRef.current) {
        party.confetti(leftRef.current, {
          count: party.variation.range(20, 40),
          angle: 60,
          spread: 80,
        })
      }
      if (rightRef.current) {
        party.confetti(rightRef.current, {
          count: party.variation.range(20, 40),
          angle: 120,
          spread: 80,
        })
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <div
        ref={leftRef}
        style={{ position: "fixed", left: 0, bottom: 0, pointerEvents: "none" }}
      />
      <div
        ref={rightRef}
        style={{ position: "fixed", right: 0, bottom: 0, pointerEvents: "none" }}
      />
    </>
  )
}
