import { useState } from "react"

export function usePhaseState<T>(_phases: T[], initialValue: T) {
  const [phase, setPhase] = useState<T>(initialValue)

  const onChangePhase = (newPhase: T) => {
    setPhase(newPhase)
  }

  const resetPhase = () => {
    setPhase(initialValue)
  }

  return {
    currentPhase: phase,
    onChangePhase,
    resetPhase,
  }
}
