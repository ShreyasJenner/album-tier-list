const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const app = express()
const upload = multer({ dest: "uploads/" })

app.use(express.json())
app.use("/uploads", express.static("uploads"))

app.post("/api/upload", upload.array("images"), (req, res) => {
  const uploadedFiles = req.files.map((file) => ({
    id: file.filename,
    name: file.originalname,
    path: `/uploads/${file.filename}`,
  }))
  res.json(uploadedFiles)
})

app.post("/api/save-config", (req, res) => {
  const config = req.body
  fs.writeFileSync("config.json", JSON.stringify(config))
  res.json({ success: true })
})

app.get("/api/load-config", (req, res) => {
  if (fs.existsSync("config.json")) {
    const config = JSON.parse(fs.readFileSync("config.json", "utf8"))
    res.json(config)
  } else {
    res.json({ tierConfig: {}, images: [] })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

