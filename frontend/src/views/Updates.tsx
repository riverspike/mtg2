import { useState } from 'react'
import { updateCardSetList, updateCardPrices } from '../utils/updatesApi'

export default function Updates() {
  const [setListLoading, setSetListLoading] = useState(false)
  const [pricesLoading,  setPricesLoading]  = useState(false)
  const [log,            setLog]            = useState('')

  function appendLog(msg: string) {
    setLog(prev => prev ? prev + '\n' + msg : msg)
  }

  async function handleUpdateSetList() {
    setSetListLoading(true)
    appendLog('Starting card set list update...')
    try {
      const { added } = await updateCardSetList()
      appendLog(added > 0 ? `Done. Added ${added} new set${added !== 1 ? 's' : ''}.` : 'Done. No changes.')
    } catch (err) {
      appendLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSetListLoading(false)
    }
  }

  async function handleUpdatePrices() {
    setPricesLoading(true)
    appendLog('Starting card price update (this will take a while)...')
    try {
      const { updated } = await updateCardPrices()
      appendLog(`Done. Updated prices for ${updated} card${updated !== 1 ? 's' : ''}.`)
    } catch (err) {
      appendLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setPricesLoading(false)
    }
  }

  return (
    <div className="updates-view">
      <div className="update-section">
        <button
          className="search-btn"
          onClick={handleUpdateSetList}
          disabled={setListLoading || pricesLoading}
        >
          {setListLoading ? 'Updating…' : 'Update Card Set List'}
        </button>
      </div>

      <div className="update-section">
        <button
          className="search-btn"
          onClick={handleUpdatePrices}
          disabled={setListLoading || pricesLoading}
        >
          {pricesLoading ? 'Updating…' : 'Update Card Prices'}
        </button>
      </div>

      <textarea
        className="update-log"
        readOnly
        value={log}
        placeholder="Messages will appear here..."
      />
    </div>
  )
}
