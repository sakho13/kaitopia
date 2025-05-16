export {}

expect.extend({
  toBeIsoUtcString(received: string) {
    const pass =
      typeof received === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(received) &&
      !isNaN(Date.parse(received))

    if (pass) {
      return {
        message: () =>
          `expected "${received}" はISO 8601 UTCフォーマットの文字列であると予想していませんでした。`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected "${received}" はISO 8601 UTCフォーマットの文字列であるべきでした。`,
        pass: false,
      }
    }
  },
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeIsoUtcString(): R
    }
  }
}
