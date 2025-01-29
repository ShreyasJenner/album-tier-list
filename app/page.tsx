"use client"

import { useState, useCallback, useMemo } from "react"
import TierList from "../components/TierList"
import UploadSection from "../components/UploadSection"
import SearchSection from "../components/SearchSection"
import ConfigButtons from "../components/ConfigButtons"
import UploadedImagesSection from "../components/UploadedImagesSection"

interface ImageInfo {
  id: string
  url: string
  name: string
  listened: boolean
}

interface Selection {
  [key: string]: boolean
}

export default function Home() {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [tierConfig, setTierConfig] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selection, setSelection] = useState<Selection>({})

  const handleImageUpload = useCallback(
    async (files: FileList) => {
      const newImages: ImageInfo[] = []
      const existingFilenames = new Set(images.map((img) => img.url.split("/").pop()))

      for (const file of Array.from(files)) {
        if (!existingFilenames.has(file.name)) {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const { filename } = await response.json()
            newImages.push({
              id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              url: `/api/upload?filename=${filename}`,
              name: file.name,
              listened: false,
            })
            existingFilenames.add(file.name)
          }
        }
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages])
      }
    },
    [images],
  )

  const handleImageMove = useCallback((imageIds: string[], targetTier: string | null) => {
    setTierConfig((prev) => {
      const newConfig = { ...prev }
      // Remove the images from their current tiers
      Object.keys(newConfig).forEach((tier) => {
        newConfig[tier] = newConfig[tier].filter((id) => !imageIds.includes(id))
      })
      // Add the images to the new tier if it's not null
      if (targetTier !== null) {
        newConfig[targetTier] = [...(newConfig[targetTier] || []), ...imageIds]
      }
      return newConfig
    })
    // Clear selection after moving
    setSelection({})
  }, [])

  const handleSaveConfig = useCallback(() => {
    const config = {
      tierConfig,
      images: images
        .filter((img) => Object.values(tierConfig).flat().includes(img.id))
        .map((img) => ({
          id: img.id,
          name: img.name,
          url: img.url,
          listened: img.listened,
        })),
    }
    const blob = new Blob([JSON.stringify(config)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tier-config.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [images, tierConfig])

  const handleLoadConfig = useCallback(async (file: File) => {
    try {
      const content = await file.text()
      const { tierConfig: loadedConfig, images: loadedImages } = JSON.parse(content)
      setTierConfig(loadedConfig)
      setImages(loadedImages)
    } catch (error) {
      console.error("Error loading configuration:", error)
    }
  }, [])

  const getUnassignedImages = useCallback(() => {
    const assignedImageIds = Object.values(tierConfig).flat()
    return images.filter((img) => !assignedImageIds.includes(img.id))
  }, [images, tierConfig])

  const filteredImages = useMemo(
    () => images.filter((img) => img.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [images, searchTerm],
  )

  const toggleListened = useCallback((imageId: string) => {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, listened: !img.listened } : img)))
  }, [])

  const toggleSelection = useCallback(
    (imageId: string, isShiftKey: boolean) => {
      setSelection((prev) => {
        const newSelection = { ...prev }
        if (isShiftKey) {
          const selectedIds = Object.keys(prev).filter((id) => prev[id])
          if (selectedIds.length > 0) {
            const lastSelectedId = selectedIds[selectedIds.length - 1]
            const allImageIds = images.map((img) => img.id)
            const startIndex = allImageIds.indexOf(lastSelectedId)
            const endIndex = allImageIds.indexOf(imageId)
            const [start, end] = [startIndex, endIndex].sort((a, b) => a - b)
            for (let i = start; i <= end; i++) {
              newSelection[allImageIds[i]] = true
            }
          } else {
            newSelection[imageId] = !prev[imageId]
          }
        } else {
          newSelection[imageId] = !prev[imageId]
        }
        return newSelection
      })
    },
    [images],
  )

  return (
    <div className="container">
      <UploadSection onUpload={handleImageUpload} />
      <SearchSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ConfigButtons onSave={handleSaveConfig} onLoad={handleLoadConfig} />
      <TierList
        config={tierConfig}
        images={filteredImages}
        onImageMove={handleImageMove}
        onToggleListened={toggleListened}
        selection={selection}
        onToggleSelection={toggleSelection}
      />
      <UploadedImagesSection
        images={getUnassignedImages().filter((img) => img.name.toLowerCase().includes(searchTerm.toLowerCase()))}
        onImageMove={handleImageMove}
        onToggleListened={toggleListened}
        selection={selection}
        onToggleSelection={toggleSelection}
      />
    </div>
  )
}

