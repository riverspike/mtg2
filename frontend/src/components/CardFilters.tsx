import ManaText from './ManaText'
import type { CardFiltersState } from '../types/card'

const MANA_COLORS = ['W', 'U', 'B', 'R', 'G']

export const EMPTY_FILTERS: CardFiltersState = { name: '', colors: [], sets: [], locations: [] }

interface Props {
  filters: CardFiltersState
  onFiltersChange: (filters: CardFiltersState) => void
  allSets?: string[]
  allLocations?: string[]
}

export default function CardFilters({ filters, onFiltersChange, allSets, allLocations }: Props) {
  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color]
    onFiltersChange({ ...filters, colors: next })
  }

  const selectMultiple = (field: 'sets' | 'locations', e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = [...e.target.selectedOptions].map(o => o.value)
    onFiltersChange({ ...filters, [field]: selected })
  }

  return (
    <div className="filters">
      <div className="filter-group">
        <label className="filter-label">Name</label>
        <input
          type="text"
          className="filter-input"
          value={filters.name}
          onChange={e => onFiltersChange({ ...filters, name: e.target.value })}
          placeholder="Search by name…"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Color</label>
        <div className="color-checkboxes">
          {MANA_COLORS.map(c => (
            <label key={c} className="color-check">
              <input
                type="checkbox"
                checked={filters.colors.includes(c)}
                onChange={() => toggleColor(c)}
              />
              <ManaText text={`{${c}}`} size={20} />
            </label>
          ))}
        </div>
      </div>

      {allSets && allSets.length > 0 && (
        <div className="filter-group">
          <div className="filter-label-row">
            <label className="filter-label">Card Set</label>
            {filters.sets.length > 0 && (
              <button className="filter-clear-btn" onClick={() => onFiltersChange({ ...filters, sets: [] })}>Clear</button>
            )}
          </div>
          <select
            className="filter-select"
            multiple
            value={filters.sets}
            onChange={e => selectMultiple('sets', e)}
          >
            {allSets.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {allLocations && allLocations.length > 0 && (
        <div className="filter-group">
          <div className="filter-label-row">
            <label className="filter-label">Storage Location</label>
            {filters.locations.length > 0 && (
              <button className="filter-clear-btn" onClick={() => onFiltersChange({ ...filters, locations: [] })}>Clear</button>
            )}
          </div>
          <select
            className="filter-select"
            multiple
            value={filters.locations}
            onChange={e => selectMultiple('locations', e)}
          >
            {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}
