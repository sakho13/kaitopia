function main() {
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR = "true"
  ;(process.env.NODE_ENV as unknown) = "test"
  process.env.TZ = "Asia/Tokyo"
  console.error = jest.fn()
}

main()
