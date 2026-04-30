import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCollection } from './store/collectionSlice.js'
import CollectionTable from './components/CollectionTable.jsx'
import CollectionFilters from './components/CollectionFilters.jsx'
import CardDetailModal from './components/CardDetailModal.jsx'

const TABS = [
  { id: 'browse',  label: 'Browse My Collection',  enabled: true  },
  { id: 'mtgdb',   label: 'Browse MTG Database',    enabled: false },
  { id: 'edit',    label: 'Edit Collections',        enabled: false },
  { id: 'updates', label: 'Updates',                 enabled: false },
]

const EMPTY_FILTERS = { name: '', colors: [], sets: [], locations: [] }

export default function App() {
  const dispatch = useDispatch()
  const { cards, status, error } = useSelector(state => state.collection)

  const [activeTab, setActiveTab]     = useState('browse')
  const [filters, setFilters]         = useState(EMPTY_FILTERS)
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCollection())
  }, [dispatch, status])

  const allSets = useMemo(
    () => [...new Set(cards.map(c => c.setName).filter(Boolean))].sort(),
    [cards]
  )

  const allLocations = useMemo(() => {
    const locs = new Set()
    cards.forEach(c => c.locations?.split(',').forEach(l => locs.add(l.trim())))
    return [...locs].filter(Boolean).sort()
  }, [cards])

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (filters.name) {
        if (!card.name.toLowerCase().includes(filters.name.toLowerCase())) return false
      }
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
    })
  }, [cards, filters])

  const price = c => c.isFoil ? (c.usdFoil ?? 0) : (c.usd ?? 0)
  const totalCount    = cards.reduce((s, c) => s + c.quantity, 0)
  const totalValue    = cards.reduce((s, c) => s + c.quantity * price(c), 0)
  const filteredCount = filteredCards.reduce((s, c) => s + c.quantity, 0)
  const filteredValue = filteredCards.reduce((s, c) => s + c.quantity * price(c), 0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>MTG Collection</h1>
      </header>

      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            disabled={!tab.enabled}
            onClick={() => tab.enabled && setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

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

      {activeTab === 'browse' && (
        <>
          <CollectionFilters
            filters={filters}
            onFiltersChange={setFilters}
            allSets={allSets}
            allLocations={allLocations}
          />
          {status === 'loading' && <div className="loading">Loading collection…</div>}
          {status === 'succeeded' && (
            <CollectionTable
              cards={filteredCards}
              onCardClick={setSelectedCard}
            />
          )}
        </>
      )}

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  )
}
