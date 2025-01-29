import type React from "react"

interface UploadSectionProps {
  onUpload: (files: FileList) => void
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onUpload(files)
    }
  }

  return (
    <div className="upload-section">
      <h2>Upload Images</h2>
      <input
        type="file"
        id="file-input"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="p-2 w-full max-w-md"
      />
    </div>
  )
}

