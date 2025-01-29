import React, { memo } from "react"
import Tier from "./Tier"

interface TierListProps {
  config: Record<string, string[]>
  images: Array<{ id: string; url: string; name: string; listened: boolean }>
  onImageMove: (imageIds: string[], tierId: string | null) => void
  onToggleListened: (imageId: string) => void
  selection: { [key: string]: boolean }
  onToggleSelection: (imageId: string, isShiftKey: boolean) => void
}

const TierList = memo(function TierList({
  config,
  images,
  onImageMove,
  onToggleListened,
  selection,
  onToggleSelection,
}: TierListProps) {
  const tiers = ["S", "A", "B", "C"]

  return (
    <>
      {tiers.map((tier) => {
        const tierId = `tier-${tier.toLowerCase()}`
        // Filter out undefined values during the find operation
        const tierImages = (config[tierId] || [])
          .map((id) => images.find((img) => img.id === id))
          .filter((img): img is { id: string; url: string; name: string; listened: boolean } => img !== undefined)

        return (
          <Tier
            key={tier}
            id={tierId}
            title={`${tier} Tier`}
            images={tierImages}
            onImageMove={onImageMove}
            onToggleListened={onToggleListened}
            selection={selection}
            onToggleSelection={onToggleSelection}
          />
        )
      })}
    </>
  )
})

export default TierList

