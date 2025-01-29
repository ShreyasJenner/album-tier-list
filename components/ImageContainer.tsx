import { memo } from "react"
import Image from "next/image"
import { Headphones } from "lucide-react"
import type React from "react" // Added import for React

interface ImageContainerProps {
  image: { id: string; url: string; name: string; listened: boolean }
  onImageMove: (imageIds: string[], tierId: string | null) => void
  onToggleListened: (imageId: string) => void
  isSelected: boolean
  onToggleSelection: (imageId: string, isShiftKey: boolean) => void
  selection: { [key: string]: boolean }
}

const ImageContainer = memo(function ImageContainer({
  image,
  onImageMove,
  onToggleListened,
  isSelected,
  onToggleSelection,
  selection,
}: ImageContainerProps) {
  const handleDragStart = (e: React.DragEvent) => {
    const selectedImageIds = Object.keys(selection).filter((id) => selection[id])
    if (selectedImageIds.length > 0) {
      e.dataTransfer.setData("text/plain", JSON.stringify(selectedImageIds))
    } else {
      e.dataTransfer.setData("text/plain", JSON.stringify([image.id]))
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    onToggleSelection(image.id, e.shiftKey)
  }

  return (
    <div className={`image-container relative group ${isSelected ? "selected" : ""}`} onClick={handleClick}>
      <Image
        src={image.url || "/placeholder.svg"}
        alt={image.name}
        width={100}
        height={100}
        className={`uploaded-image ${image.listened ? "opacity-50" : ""}`}
        draggable
        onDragStart={handleDragStart}
      />
      <span className="tooltip">{image.name}</span>
      <button
        className="remove-button absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          const selectedImageIds = Object.keys(selection).filter((id) => selection[id])
          onImageMove(selectedImageIds.length > 0 ? selectedImageIds : [image.id], null)
        }}
        type="button"
      >
        X
      </button>
      <button
        className={`listen-button absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
          image.listened ? "bg-green-500" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onToggleListened(image.id)
        }}
        type="button"
      >
        <Headphones size={16} />
      </button>
    </div>
  )
})

export default ImageContainer

