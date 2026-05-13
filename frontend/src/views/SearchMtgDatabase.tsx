import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { fetchCollection } from '../store/collectionSlice'
import CardFilters from '../components/CardFilters'
import CollectionTable from '../components/CollectionTable'
import CardDetailModal from '../components/CardDetailModal'
import { searchScryfall } from '../utils/scryfallApi'
import { fetchAllSets } from '../utils/setsApi'
import type { SetOption } from '../utils/setsApi'
import type { CollectionCard, CardFiltersState, LocationOption } from '../types/card'

const EMPTY_FILTERS: CardFiltersState = { name: '', colors: [], sets: [], locations: [] }

export default function SearchMtgDatabase() {
  const dispatch = useAppDispatch()
  const [filters,      setFilters]      = useState<CardFiltersState>(EMPTY_FILTERS)
  const [results,      setResults]      = useState<CollectionCard[]>([])
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [locations,    setLocations]    = useState<LocationOption[]>([])
  const [allSetsData,  setAllSetsData]  = useState<SetOption[]>([])

  useEffect(() => {
    fetch('/api/locations')
      .then(r => r.json() as Promise<LocationOption[]>)
      .then(setLocations)
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchAllSets()
      .then(setAllSetsData)
      .catch(() => {})
  }, [])

  const allSets = useMemo(() => allSetsData.map(s => s.name), [allSetsData])

  const setCodeByName = useMemo(() => {
    const map: Record<string, string> = {}
    allSetsData.forEach(s => { map[s.name] = s.code })
    return map
  }, [allSetsData])

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
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          locations={locations}
          onAdded={() => dispatch(fetchCollection())}
        />
      )}
    </>
  )
}
