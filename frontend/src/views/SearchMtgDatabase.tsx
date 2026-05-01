import { useMemo, useState } from 'react'
import { useAppSelector } from '../store/hooks'
import CardFilters from '../components/CardFilters'
import CollectionTable from '../components/CollectionTable'
import CardDetailModal from '../components/CardDetailModal'
import { searchScryfall } from '../utils/scryfallApi'
import type { CollectionCard, CardFiltersState } from '../types/card'

const EMPTY_FILTERS: CardFiltersState = { name: '', colors: [], sets: [], locations: [] }

export default function SearchMtgDatabase() {
  const { cards } = useAppSelector(state => state.collection)
  const [filters, setFilters] = useState<CardFiltersState>(EMPTY_FILTERS)
  const [results, setResults] = useState<CollectionCard[]>([])
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allSets = useMemo(
    () => [...new Set(cards.map(c => c.setName).filter(Boolean))].sort(),
    [cards]
  )

  const setCodeByName = useMemo(() => {
    const map: Record<string, string> = {}
    cards.forEach(c => { if (c.setName && c.setCode) map[c.setName] = c.setCode })
    return map
  }, [cards])

  const canSearch =
    filters.name.trim().length > 0 ||
    filters.colors.length > 0 ||
    filters.sets.length > 0

  const handleSearch = async () => {
    if (!canSearch) return
    setLoading(true)
    setError(null)
    try {
      const data = await searchScryfall(filters, setCodeByName)
      setResults(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CardFilters filters={filters} onFiltersChange={setFilters} allSets={allSets} />

      <div className="search-actions">
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={!canSearch || loading}
        >
          {loading ? 'Searching…' : 'Search Scryfall'}
        </button>
        {results.length > 0 && !loading && (
          <span className="search-result-count">{results.length.toLocaleString()} cards found</span>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {loading
        ? <div className="loading">Searching Scryfall…</div>
        : <CollectionTable cards={results} onCardClick={setSelectedCard} />
      }

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </>
  )
}
