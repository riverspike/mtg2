import { useState } from 'react'
import ManaText from './ManaText'
import { cardPrice } from '../utils/cardUtils'
import type { CollectionCard } from '../types/card'

interface Column {
  key: string
  label: string
  sort: (a: CollectionCard, b: CollectionCard) => number
}

const COLUMNS: Column[] = [
  { key: 'name',            label: 'Name',          sort: (a, b) => a.name.localeCompare(b.name) },
  { key: 'quantity',        label: 'Qty',            sort: (a, b) => a.quantity - b.quantity },
  { key: 'manaCost',        label: 'Mana',           sort: (a, b) => a.cmc - b.cmc },
  { key: 'typeLine',        label: 'Type',           sort: (a, b) => (a.typeLine ?? '').localeCompare(b.typeLine ?? '') },
  { key: 'setName',         label: 'Card Set',       sort: (a, b) => (a.setName ?? '').localeCompare(b.setName ?? '') },
  { key: 'collectorNumber', label: 'No.',            sort: (a, b) => (a.collectorNumber ?? '').localeCompare(b.collectorNumber ?? '') },
  { key: 'isFoil',          label: 'Foil',           sort: (a, b) => Number(a.isFoil) - Number(b.isFoil) },
  { key: 'locations',       label: 'Location',       sort: (a, b) => (a.locations ?? '').localeCompare(b.locations ?? '') },
  { key: 'value',           label: 'Value',          sort: (a, b) => cardPrice(a) - cardPrice(b) },
  { key: 'priceUpdatedAt',  label: 'Price Updated',  sort: (a, b) => (a.priceUpdatedAt ?? '').localeCompare(b.priceUpdatedAt ?? '') },
]

const PAGE_SIZES = [50, 100, 150, 200, 500]


interface Props {
  cards: CollectionCard[]
  onCardClick: (card: CollectionCard) => void
}

export default function CollectionTable({ cards, onCardClick }: Props) {
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [pageSize, setPageSize] = useState(50)
  const [page, setPage] = useState(1)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sortCol = COLUMNS.find(c => c.key === sortKey)
  const sorted = [...cards].sort((a, b) => {
    const cmp = sortCol ? sortCol.sort(a, b) : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const paginated  = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <div className="table-section">
      <div className="table-controls">
        <span>{cards.length.toLocaleString()} cards</span>
        <label className="page-size-label">
          Rows&nbsp;
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
          >
            {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <span>Page {safePage} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}         disabled={safePage === 1}>‹</button>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>›</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className="sortable"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="sort-arrow">{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(card => {
              const value = cardPrice(card)
              return (
                <tr key={`${card.cardId}-${card.isFoil}`} className={`rarity-${card.rarity}`}>
                  <td className="name-cell">
                    <button className="name-btn" onClick={() => onCardClick(card)}>
                      {card.name}
                    </button>
                  </td>
                  <td className="qty">{card.quantity}</td>
                  <td className="color-cell">
                    {card.manaCost
                      ? <ManaText text={card.manaCost} size={14} />
                      : '—'}
                  </td>
                  <td>{card.typeLine ?? '—'}</td>
                  <td>{card.setName}</td>
                  <td className="collector-num">{card.collectorNumber ?? '—'}</td>
                  <td className="foil-cell">{card.isFoil ? '✦' : ''}</td>
                  <td>{card.locations ?? '—'}</td>
                  <td className="price">{value > 0 ? `$${value.toFixed(2)}` : '—'}</td>
                  <td className="date-cell">{card.priceUpdatedAt ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
