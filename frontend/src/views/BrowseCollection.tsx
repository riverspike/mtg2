import { useEffect, useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { fetchCollection } from '../store/collectionSlice'
import CardFilters, { EMPTY_FILTERS } from '../components/CardFilters'
import CollectionTable from '../components/CollectionTable'
import CardDetailModal from '../components/CardDetailModal'
import type { CollectionCard, CardFiltersState, LocationOption } from '../types/card'

function cardPrice(card: CollectionCard): number {
  return card.isFoil ? (card.usdFoil ?? 0) : (card.usd ?? 0)
}

export default function BrowseCollection() {
  const dispatch = useAppDispatch()
  const { cards, status, error } = useAppSelector(state => state.collection)
  const [filters,      setFilters]      = useState<CardFiltersState>(EMPTY_FILTERS)
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [locations,    setLocations]    = useState<LocationOption[]>([])

  useEffect(() => {
    fetch('/api/locations')
      .then(r => r.json() as Promise<LocationOption[]>)
      .then(setLocations)
      .catch(() => {})
  }, [])

  const allSets = useMemo(
    () => [...new Set(cards.map(c => c.setName).filter(Boolean))].sort(),
    [cards]
  )

  const allLocations = useMemo(
    () => locations.map(l => l.name).sort((a, b) => a.localeCompare(b)),
    [locations],
  )

  const filteredCards = useMemo(() => cards.filter(card => {
    if (filters.name && !card.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.colors.length > 0) {
      const cardColors = card.colors ? card.colors.split(',') : []
      if (!filters.colors.some(c => cardColors.includes(c))) return false
    }
    if (filters.sets.length > 0 && !filters.sets.includes(card.setName)) return false
    if (filters.locations.length > 0) {
      const cardLocs = card.locations ? card.locations.split(',').map(l => l.trim()) : []
      if (!filters.locations.some(l => cardLocs.includes(l))) return false
    }
    return true
  }), [cards, filters])

  const totalCount    = cards.reduce((s, c) => s + c.quantity, 0)
  const totalValue    = cards.reduce((s, c) => s + c.quantity * cardPrice(c), 0)
  const filteredCount = filteredCards.reduce((s, c) => s + c.quantity, 0)
  const filteredValue = filteredCards.reduce((s, c) => s + c.quantity * cardPrice(c), 0)

  return (
    <>
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Total Cards</span>
          <span className="stat-value">{totalCount.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Value</span>
          <span className="stat-value">${totalValue.toFixed(2)}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-label">Cards Shown</span>
          <span className="stat-value">{filteredCount.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Shown Value</span>
          <span className="stat-value">${filteredValue.toFixed(2)}</span>
        </div>
      </div>

      {error && <p className="error">Error: {error}</p>}

      <CardFilters
        filters={filters}
        onFiltersChange={setFilters}
        allSets={allSets}
        allLocations={allLocations}
      />

      {status === 'loading' && <div className="loading">Loading collection…</div>}
      {status === 'succeeded' && (
        <CollectionTable cards={filteredCards} onCardClick={setSelectedCard} />
      )}

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          locations={locations}
          onUpdated={() => dispatch(fetchCollection())}
        />
      )}
    </>
  )
}
