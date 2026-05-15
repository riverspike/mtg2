import { useState } from 'react'
import { updateCardSetList, updateCardPrices } from '../utils/updatesApi'
import { useLog } from '../hooks/useLog'

export default function Updates() {
  const [setListLoading, setSetListLoading] = useState(false)
  const [pricesLoading,  setPricesLoading]  = useState(false)
  const [log, appendLog] = useLog()

  async function handleUpdateSetList() {
    setSetListLoading(true)
    appendLog('Starting card set list update...')
    try {
      const { total, added } = await updateCardSetList()
      appendLog(`Done. ${total} total set${total !== 1 ? 's' : ''}. ${added} new set${added !== 1 ? 's' : ''} added.`)
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
