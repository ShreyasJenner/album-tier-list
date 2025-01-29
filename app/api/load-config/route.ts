import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("config") as File
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const config = JSON.parse(await file.text())
  return NextResponse.json(config)
}

