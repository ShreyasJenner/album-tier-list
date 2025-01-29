import React, { memo } from "react"
import ImageContainer from "./ImageContainer"

interface UploadedImagesSectionProps {
  images: Array<{ id: string; url: string; name: string; listened: boolean }>
  onImageMove: (imageIds: string[], tierId: string | null) => void
  onToggleListened: (imageId: string) => void
  selection: { [key: string]: boolean }
  onToggleSelection: (imageId: string, isShiftKey: boolean) => void
}

const UploadedImagesSection = memo(function UploadedImagesSection({
  images,
  onImageMove,
  onToggleListened,
  selection,
  onToggleSelection,
}: UploadedImagesSectionProps) {
  return (
    <div className="uploaded-images-section">
      <h2>Uploaded Images</h2>
      <div className="uploaded-images" id="uploaded-images">
        {images.map((image) => (
          <ImageContainer
            key={image.id}
            image={image}
            onImageMove={onImageMove}
            onToggleListened={onToggleListened}
            isSelected={selection[image.id] || false}
            onToggleSelection={onToggleSelection}
            selection={selection}
          />
        ))}
      </div>
    </div>
  )
})

export default UploadedImagesSection

