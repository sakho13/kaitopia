export type IgnoreKeysObject<T, IGNORE_KEYS extends string> = T extends Record<
  string,
  unknown
>
  ? {
      [K in Exclude<keyof T, IGNORE_KEYS>]: IgnoreKeysObject<T[K], IGNORE_KEYS>
    }
  : T extends Array<infer U>
  ? IgnoreKeysObject<U, IGNORE_KEYS>[]
  : T
