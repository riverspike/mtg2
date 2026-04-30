const MANA_COLORS = ['W', 'U', 'B', 'R', 'G']

export default function CollectionFilters({ filters, onFiltersChange, allSets, allLocations }) {
  const toggleColor = (color) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color]
    onFiltersChange({ ...filters, colors: next })
  }

  const selectMultiple = (field, e) => {
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
        {/* TODO: replace color letters with mana SVG icons from src/images/mana/ — see MTG_Collection_App.md General > Colors */}
        <div className="color-checkboxes">
          {MANA_COLORS.map(c => (
            <label key={c} className={`color-check color-${c}`}>
              <input
                type="checkbox"
                checked={filters.colors.includes(c)}
                onChange={() => toggleColor(c)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

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
    </div>
  )
}
