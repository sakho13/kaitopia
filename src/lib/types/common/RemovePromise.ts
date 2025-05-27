export type RemovePromise<T> = T extends Promise<infer U> ? RemovePromise<U> : T
