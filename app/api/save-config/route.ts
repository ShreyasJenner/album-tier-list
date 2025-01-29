import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const config = await request.json()
  const configJson = JSON.stringify(config, null, 2)
  return new NextResponse(configJson, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=tier-config.json",
    },
  })
}

