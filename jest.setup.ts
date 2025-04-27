function main() {
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR = "true"
  console.error = jest.fn()
}

main()
