import { useState, useEffect } from 'react'
import { getEmptyLocations, deleteLocation } from '../utils/locationsApi'
import type { LocationOption } from '../types/card'

interface Props {
  onClose: () => void
}

export default function DeleteLocationModal({ onClose }: Props) {
  const [locations,      setLocations]      = useState<LocationOption[]>([])
  const [selectedId,     setSelectedId]     = useState('')
  const [confirmPending, setConfirmPending] = useState(false)
  const [busy,           setBusy]           = useState(false)
  const [log,            setLog]            = useState('')

  useEffect(() => {
    fetchEmpty()
  }, [])

  function fetchEmpty() {
    getEmptyLocations()
      .then(setLocations)
      .catch(() => {})
  }

  function appendLog(msg: string) {
    setLog(prev => prev ? prev + '\n' + msg : msg)
  }

  function handleSelect(id: string) {
    setSelectedId(id)
    setConfirmPending(false)
  }

  async function handleConfirmYes() {
    const loc = locations.find(l => String(l.locationId) === selectedId)
    if (!loc) return
    setBusy(true)
    setConfirmPending(false)
    appendLog('Deleting location...')
    try {
      await deleteLocation(loc.locationId)
      appendLog(`Location "${loc.name}" has been deleted.`)
      setSelectedId('')
      setLocations(prev => prev.filter(l => l.locationId !== loc.locationId))
    } catch (e) {
      appendLog(e instanceof Error ? e.message : 'Failed to delete location.')
    } finally {
      setBusy(false)
    }
  }

  const selectedName = locations.find(l => String(l.locationId) === selectedId)?.name ?? ''
  const hasEmpty     = locations.length > 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Delete Location</h2>

        <p className="delete-location-info">
          Only empty locations can be deleted. Move all the cards from one location
          to another before trying to delete a location.
        </p>

        <div className="add-form">
          {hasEmpty ? (
            <>
              <div className="add-field">
                <label className="add-label">Choose Location to Delete</label>
                <select
                  className="add-select"
                  value={selectedId}
                  onChange={e => handleSelect(e.target.value)}
                  disabled={busy}
                >
                  <option value="">Select a location…</option>
                  {locations.map(l => (
                    <option key={l.locationId} value={l.locationId}>{l.name}</option>
                  ))}
                </select>
              </div>

              {selectedId && !confirmPending && (
                <button
                  className="add-btn delete-btn"
                  onClick={() => setConfirmPending(true)}
                  disabled={busy}
                >
                  Delete Location
                </button>
              )}

              {confirmPending && (
                <div className="delete-confirm">
                  <p className="delete-confirm-msg">
                    Are you sure you want to delete &ldquo;{selectedName}&rdquo;?
                  </p>
                  <div className="delete-confirm-btns">
                    <button className="add-btn delete-btn" onClick={handleConfirmYes} disabled={busy}>
                      Yes
                    </button>
                    <button className="add-btn" onClick={() => setConfirmPending(false)} disabled={busy}>
                      No
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="delete-location-none">No empty locations available to delete.</p>
          )}
        </div>

        <textarea
          className="update-log location-log"
          readOnly
          value={log}
          placeholder="Messages will appear here..."
        />
      </div>
    </div>
  )
}
