interface ConfigButtonsProps {
  onSave: () => void
  onLoad: (file: File) => void
}

export default function ConfigButtons({ onSave, onLoad }: ConfigButtonsProps) {
  const handleLoadClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        onLoad(file)
      }
    }
    input.click()
  }

  return (
    <div className="config-buttons">
      <button onClick={onSave}>Save Configuration</button>
      <button onClick={handleLoadClick}>Load Configuration</button>
    </div>
  )
}

