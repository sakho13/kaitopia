import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json(
    {
      status: "OK",
      message: "Hello!",
    },
    { status: 200 },
  )
}
