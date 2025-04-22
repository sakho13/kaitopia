export type AppendNull<T> = T extends object
  ? {
      [K in keyof T]: T[K] | null
    }
  : T extends unknown[]
  ? (T[number] | null)[]
  : T | null
