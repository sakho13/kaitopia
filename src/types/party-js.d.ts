declare module "party-js" {
  export interface ConfettiOptions {
    count?: number
    angle?: number
    spread?: number
  }
  export function confetti(source: HTMLElement, options?: ConfettiOptions): void
  export const variation: {
    range: (min: number, max: number) => number
  }
  const party: {
    confetti: typeof confetti
    variation: typeof variation
  }
  export default party
}
