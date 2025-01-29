import React from "react"

interface SearchSectionProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function SearchSection({ searchTerm, setSearchTerm }: SearchSectionProps) {
  return (
    <div className="search-section">
      <input
        type="text"
        id="search-input"
        placeholder="Search images by file name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

