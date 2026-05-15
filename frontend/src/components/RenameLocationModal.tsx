import { useState, useEffect } from 'react'
import { getAllLocations, renameLocation } from '../utils/locationsApi'
import type { LocationOption } from '../types/card'

interface Props {
  onClose: () => void
}

export default function RenameLocationModal({ onClose }: Props) {
  const [locations,   setLocations]   = useState<LocationOption[]>([])
  const [selectedId,  setSelectedId]  = useState('')
  const [name,        setName]        = useState('')
  const [type,        setType]        = useState('storage')
  const [busy,        setBusy]        = useState(false)
  const [log,         setLog]         = useState('')

  useEffect(() => {
    getAllLocations().then(setLocations).catch(() => {})
  }, [])

  function appendLog(msg: string) {
    setLog(prev => prev ? prev + '\n' + msg : msg)
  }

  function handleSelect(id: string) {
    setSelectedId(id)
    const loc = locations.find(l => String(l.locationId) === id)
    if (loc) {
      setName(loc.name)
      setType(loc.type)
    } else {
      setName('')
      setType('storage')
    }
  }

  function handleNameChange(value: string) {
    setName(value.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 60))
  }

  async function handleUpdate() {
    if (!selectedId || !name.trim()) return
    const oldName = locations.find(l => String(l.locationId) === selectedId)?.name ?? ''
    setBusy(true)
    appendLog('Updating location...')
    try {
      await renameLocation(Number(selectedId), name.trim(), type)
      appendLog(`Location "${oldName}" renamed to "${name.trim()}".`)
      setLocations(prev =>
        prev.map(l =>
          String(l.locationId) === selectedId ? { ...l, name: name.trim(), type } : l
        ).sort((a, b) => a.name.localeCompare(b.name))
      )
    } catch (e) {
      appendLog(e instanceof Error ? e.message : 'Failed to rename location.')
    } finally {
      setBusy(false)
    }
  }

  const selected = !!selectedId

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Rename Location</h2>

        <div className="add-form">
          <div className="add-field">
            <label className="add-label">Choose Location to Rename</label>
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

          {selected && (
            <>
              <div className="add-field">
                <label className="add-label">Location Name</label>
                <input
                  type="text"
                  className="add-select"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  maxLength={60}
                  disabled={busy}
                />
              </div>

              <div className="add-field">
                <label className="add-label">Location Type</label>
                <div className="location-type-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="renameLocType"
                      value="storage"
                      checked={type === 'storage'}
                      onChange={() => setType('storage')}
                      disabled={busy}
                    />
                    Storage
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="renameLocType"
                      value="deck"
                      checked={type === 'deck'}
                      onChange={() => setType('deck')}
                      disabled={busy}
                    />
                    Deck
                  </label>
                </div>
              </div>

              <button
                className="add-btn"
                onClick={handleUpdate}
                disabled={!name.trim() || busy}
              >
                {busy ? 'Updating…' : 'Update Location'}
              </button>
            </>
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
