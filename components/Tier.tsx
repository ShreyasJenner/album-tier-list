import type React from "react"
import ImageContainer from "./ImageContainer"

interface TierProps {
  id: string
  title: string
  images: Array<{ id: string; url: string; name: string; listened: boolean }>
  onImageMove: (imageIds: string[], tierId: string | null) => void
  onToggleListened: (imageId: string) => void
  selection: { [key: string]: boolean }
  onToggleSelection: (imageId: string, isShiftKey: boolean) => void
}

export default function Tier({
  id,
  title,
  images,
  onImageMove,
  onToggleListened,
  selection,
  onToggleSelection,
}: TierProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const imageIdsJson = e.dataTransfer.getData("text/plain")
    const imageIds = JSON.parse(imageIdsJson)
    onImageMove(imageIds, id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="tier" id={id}>
      <h2>{title}</h2>
      <div className="drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
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
}

