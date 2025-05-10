import { NextResponse } from "next/server"

export function GET() {
  console.log(">>", process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  return NextResponse.json(
    {
      status: "OK",
      message: "Hello!",
    },
    { status: 200 },
  )
}
