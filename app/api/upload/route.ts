import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const hash = crypto.createHash("md5").update(buffer).digest("hex")
  const extension = path.extname(file.name)
  const filename = `${hash}${extension}`
  const filepath = path.join(UPLOAD_DIR, filename)

  try {
    await writeFile(filepath, buffer)
    return NextResponse.json({ filename })
  } catch (error) {
    console.error("Error saving file:", error)
    return NextResponse.json({ error: "Error saving file" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filename = searchParams.get("filename")

  if (!filename) {
    return NextResponse.json({ error: "No filename provided" }, { status: 400 })
  }

  const filepath = path.join(UPLOAD_DIR, filename)

  try {
    const file = await readFile(filepath)
    const response = new NextResponse(file)
    response.headers.set("Content-Type", "image/jpeg") // Adjust based on your image types
    return response
  } catch (error) {
    console.error("Error reading file:", error)
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}

