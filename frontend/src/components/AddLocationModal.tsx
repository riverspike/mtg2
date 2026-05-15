import { useState } from 'react'
import ModalShell from './ModalShell'
import { useLog } from '../hooks/useLog'
import { createLocation } from '../utils/locationsApi'

interface Props {
  onClose: () => void
}

export default function AddLocationModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState('storage')
  const [busy, setBusy] = useState(false)
  const [log, appendLog] = useLog()

  function handleNameChange(value: string) {
    setName(value.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 60))
  }

  async function handleCreate() {
    if (!name.trim()) return
    setBusy(true)
    appendLog('Creating new location...')
    try {
      await createLocation(name.trim(), type)
      appendLog(`New Location "${name.trim()}" created and now usable to add cards.`)
      setName('')
    } catch (e) {
      appendLog(e instanceof Error ? e.message : 'Failed to create location.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell title="Add New Location" onClose={onClose}>
      <div className="add-form">
        <div className="add-field">
          <label className="add-label">Location Name</label>
          <input
            type="text"
            className="add-select"
            placeholder="e.g. Storage Box 1"
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
                name="locationType"
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
                name="locationType"
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
          onClick={handleCreate}
          disabled={!name.trim() || busy}
        >
          {busy ? 'Creating…' : 'Create Location'}
        </button>
      </div>

      <textarea
        className="update-log location-log"
        readOnly
        value={log}
        placeholder="Messages will appear here..."
      />
    </ModalShell>
  )
}
