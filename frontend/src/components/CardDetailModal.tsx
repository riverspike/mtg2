import { useState, useEffect } from 'react'
import ManaText from './ManaText'
import { addCardToCollection } from '../utils/collectionApi'
import type { CollectionCard, LocationOption } from '../types/card'

interface Props {
  card: CollectionCard
  onClose: () => void
  locations?: LocationOption[]
  onAdded?: () => void
}

export default function CardDetailModal({ card, onClose, locations, onAdded }: Props) {
  const isDfc    = Array.isArray(card.faces) && card.faces.length === 2
  const [activeFace, setActiveFace] = useState(0)

  const [locationId, setLocationId] = useState('')
  const [quantity,   setQuantity]   = useState(1)
  const [isFoil,     setIsFoil]     = useState(false)
  const [adding,     setAdding]     = useState(false)
  const [addError,   setAddError]   = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)

  useEffect(() => {
    if (!addSuccess) return
    const timer = setTimeout(() => setAddSuccess(false), 2500)
    return () => clearTimeout(timer)
  }, [addSuccess])

  const face = isDfc ? card.faces![activeFace] : null

  const detail = {
    manaCost:   isDfc ? face!.manaCost   : card.manaCost,
    typeLine:   isDfc ? face!.typeLine   : card.typeLine,
    oracleText: isDfc ? face!.oracleText : card.oracleText,
    flavorText: isDfc ? face!.flavorText : card.flavorText,
    power:      isDfc ? face!.power      : card.power,
    toughness:  isDfc ? face!.toughness  : card.toughness,
  }

  const handleAdd = async () => {
    if (!locationId) return
    setAdding(true)
    setAddError(null)
    try {
      await addCardToCollection(card, Number(locationId), quantity, isFoil)
      setAddSuccess(true)
      onAdded?.()
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Failed to add card')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">{card.name}</h2>

        <div className="modal-images">
          {card.imageNormal ? (
            <div className="modal-img-wrap">
              {isDfc && <span className="face-label">Front</span>}
              <img
                src={card.imageNormal}
                alt={isDfc ? card.faces![0].name : card.name}
                className={`modal-card-img ${!isDfc || activeFace === 0 ? 'large' : 'small'}`}
                onClick={() => isDfc && setActiveFace(0)}
                style={{ cursor: isDfc ? 'pointer' : 'default' }}
                title={isDfc ? 'Click to view front face details' : undefined}
              />
            </div>
          ) : (
            <div className="modal-no-image">No image</div>
          )}

          {isDfc && card.imageNormalBack && (
            <div className="modal-img-wrap">
              <span className="face-label">Back</span>
              <img
                src={card.imageNormalBack}
                alt={card.faces![1].name}
                className={`modal-card-img ${activeFace === 1 ? 'large' : 'small'}`}
                onClick={() => setActiveFace(1)}
                style={{ cursor: 'pointer' }}
                title="Click to view back face details"
              />
            </div>
          )}
        </div>

        {isDfc && (
          <p className="face-hint">
            Showing details for: <strong>{face!.name}</strong>
          </p>
        )}

        <dl className="card-details">
          <dt>Rarity</dt>
          <dd className="capitalize">{card.rarity}</dd>

          {detail.manaCost && <>
            <dt>Mana Cost</dt>
            <dd><ManaText text={detail.manaCost} size={18} /></dd>
          </>}

          <dt>Type</dt>
          <dd>{detail.typeLine ?? '—'}</dd>

          {detail.oracleText && <>
            <dt>Oracle Text</dt>
            <dd className="oracle">{detail.oracleText}</dd>
          </>}

          {detail.flavorText && <>
            <dt>Flavor Text</dt>
            <dd className="flavor">{detail.flavorText}</dd>
          </>}

          {detail.power != null && <>
            <dt>Power / Toughness</dt>
            <dd>{detail.power} / {detail.toughness}</dd>
          </>}
        </dl>

        {locations && locations.length > 0 && (
          <div className="add-to-collection">
            <div className="add-divider" />
            <h3 className="add-title">Add to Collection</h3>
            <div className="add-form">
              <div className="add-field">
                <label className="add-label">Location</label>
                <select
                  className="add-select"
                  value={locationId}
                  onChange={e => { setLocationId(e.target.value); setAddError(null) }}
                  disabled={addSuccess}
                >
                  <option value="">Select location…</option>
                  {locations.map(l => (
                    <option key={l.locationId} value={l.locationId}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div className="add-field">
                <label className="add-label">Quantity</label>
                <input
                  type="number"
                  className="add-qty"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                  disabled={addSuccess}
                />
              </div>
              <label className="add-foil-check">
                <input
                  type="checkbox"
                  checked={isFoil}
                  onChange={e => setIsFoil(e.target.checked)}
                  disabled={addSuccess}
                />
                Foil
              </label>
              <button
                className="add-btn"
                onClick={handleAdd}
                disabled={!locationId || adding || addSuccess}
              >
                {adding ? 'Adding…' : 'Add to Collection'}
              </button>
            </div>
            {addError   && <p className="error add-feedback">{addError}</p>}
            {addSuccess && <p className="add-success">✓ Added to collection</p>}
          </div>
        )}
      </div>
    </div>
  )
}
