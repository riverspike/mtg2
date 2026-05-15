import { useState, useEffect, useMemo } from 'react'
import ManaText from './ManaText'
import { addCardToCollection, updateCollectionQuantity, moveCollectionCard } from '../utils/collectionApi'
import type { CollectionCard, LocationOption } from '../types/card'

interface Props {
  card: CollectionCard
  onClose: () => void
  locations?: LocationOption[]
  onAdded?: () => void
  onUpdated?: () => void
}

export default function CardDetailModal({ card, onClose, locations, onAdded, onUpdated }: Props) {
  const isDfc = Array.isArray(card.faces) && card.faces.length === 2
  const [activeFace, setActiveFace] = useState(0)

  // ── Add-to-collection state (Search mode) ──────────────────────────────
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

  // ── Edit-card state (Browse mode) ──────────────────────────────────────
  const cardLocationNames = useMemo(
    () => (card.locations ? card.locations.split(',').map(l => l.trim()) : []),
    [card.locations],
  )
  const cardLocations = useMemo(
    () => (locations ?? []).filter(l => cardLocationNames.includes(l.name)),
    [locations, cardLocationNames],
  )

  const [editMode,    setEditMode]    = useState<'quantity' | 'move' | null>(null)
  const [newQty,      setNewQty]      = useState(card.quantity)
  const [moveQty,     setMoveQty]     = useState(1)
  const [fromLocId,   setFromLocId]   = useState(
    cardLocations.length === 1 ? String(cardLocations[0].locationId) : '',
  )
  const [toLocId,     setToLocId]     = useState('')
  const [editBusy,    setEditBusy]    = useState(false)
  const [editError,   setEditError]   = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState<string | null>(null)

  const switchEditMode = (mode: 'quantity' | 'move') => {
    setEditMode(prev => (prev === mode ? null : mode))
    setEditError(null)
    setEditSuccess(null)
  }

  const handleUpdateQuantity = async () => {
    setEditBusy(true)
    setEditError(null)
    try {
      await updateCollectionQuantity(card.id, newQty)
      setEditSuccess(newQty === 0 ? '✓ Removed from collection' : '✓ Quantity updated')
      onUpdated?.()
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to update quantity')
    } finally {
      setEditBusy(false)
    }
  }

  const handleMoveCard = async () => {
    if (!fromLocId) { setEditError('Please select a source location'); return }
    if (!toLocId)   { setEditError('Please select a destination location'); return }
    if (Number(fromLocId) === Number(toLocId)) { setEditError('Source and destination must be different'); return }
    if (moveQty <= 0) { setEditError('Quantity to move must be greater than 0'); return }
    if (moveQty > card.quantity) { setEditError(`Quantity to move exceeds total quantity (${card.quantity})`); return }

    setEditBusy(true)
    setEditError(null)
    try {
      await moveCollectionCard(card.id, Number(fromLocId), Number(toLocId), moveQty)
      setEditSuccess('✓ Card moved')
      onUpdated?.()
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to move card')
    } finally {
      setEditBusy(false)
    }
  }

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

          <dt>Foil</dt>
          <dd>
            <label className="foil-status-label">
              <input type="checkbox" checked={card.isFoil} readOnly disabled />
              {card.isFoil ? 'Yes' : 'No'}
            </label>
          </dd>

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

          <dt>Set</dt>
          <dd>{card.setName}</dd>
        </dl>

        {/* ── Search mode: Add to Collection ── */}
        {!onUpdated && locations && locations.length > 0 && (
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

        {/* ── Browse mode: Edit Card in Collection ── */}
        {onUpdated && (
          <div className="add-to-collection">
            <div className="add-divider" />
            <h3 className="add-title">Edit Card in Collection</h3>
            <div className="edit-btn-row">
              <button
                className={`edit-toggle-btn${editMode === 'quantity' ? ' active' : ''}`}
                onClick={() => switchEditMode('quantity')}
              >
                Change Quantity
              </button>
              <button
                className={`edit-toggle-btn${editMode === 'move' ? ' active' : ''}`}
                onClick={() => switchEditMode('move')}
              >
                Move Card(s)
              </button>
            </div>

            {editMode === 'quantity' && (
              <div className="add-form">
                <p className="edit-current-qty">Current quantity: <strong>{card.quantity}</strong></p>
                <div className="add-field">
                  <label className="add-label">New quantity</label>
                  <input
                    type="number"
                    className="add-qty"
                    min={0}
                    max={999}
                    value={newQty}
                    onChange={e => { setNewQty(Math.max(0, Number(e.target.value))); setEditError(null) }}
                    disabled={editBusy || editSuccess !== null}
                  />
                </div>
                <button
                  className="add-btn"
                  onClick={handleUpdateQuantity}
                  disabled={editBusy || editSuccess !== null}
                >
                  {editBusy ? 'Updating…' : 'Update Quantity'}
                </button>
                {editError   && <p className="error add-feedback">{editError}</p>}
                {editSuccess && <p className="add-success">{editSuccess}</p>}
              </div>
            )}

            {editMode === 'move' && (
              <div className="add-form">
                {cardLocations.length > 1 && (
                  <div className="add-field">
                    <label className="add-label">From location</label>
                    <select
                      className="add-select"
                      value={fromLocId}
                      onChange={e => { setFromLocId(e.target.value); setEditError(null) }}
                      disabled={editBusy || editSuccess !== null}
                    >
                      <option value="">Select location…</option>
                      {cardLocations.map(l => (
                        <option key={l.locationId} value={l.locationId}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="add-field">
                  <label className="add-label">New location</label>
                  <select
                    className="add-select"
                    value={toLocId}
                    onChange={e => { setToLocId(e.target.value); setEditError(null) }}
                    disabled={editBusy || editSuccess !== null}
                  >
                    <option value="">Select location…</option>
                    {(locations ?? []).map(l => (
                      <option key={l.locationId} value={l.locationId}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="add-field">
                  <label className="add-label">Quantity to move</label>
                  <input
                    type="number"
                    className="add-qty"
                    min={1}
                    max={card.quantity}
                    value={moveQty}
                    onChange={e => { setMoveQty(Math.max(1, Number(e.target.value))); setEditError(null) }}
                    disabled={editBusy || editSuccess !== null}
                  />
                </div>
                <button
                  className="add-btn"
                  onClick={handleMoveCard}
                  disabled={editBusy || editSuccess !== null}
                >
                  {editBusy ? 'Moving…' : 'Update Location'}
                </button>
                {editError   && <p className="error add-feedback">{editError}</p>}
                {editSuccess && <p className="add-success">{editSuccess}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
