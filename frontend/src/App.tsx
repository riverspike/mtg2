import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchCollection } from './store/collectionSlice'
import BrowseCollection from './views/BrowseCollection'
import SearchMtgDatabase from './views/SearchMtgDatabase'
import EditLocations from './views/EditLocations'
import Updates from './views/Updates'

interface Tab {
  id: string
  label: string
  enabled: boolean
}

const TABS: Tab[] = [
  { id: 'browse',  label: 'Browse My Collection',  enabled: true  },
  { id: 'search',  label: 'Search MTG Database',    enabled: true  },
  { id: 'edit',    label: 'Edit Locations',            enabled: true  },
  { id: 'updates', label: 'Updates',                 enabled: true  },
]

export default function App() {
  const dispatch = useAppDispatch()
  const { status } = useAppSelector(state => state.collection)
  const [activeTab, setActiveTab] = useState('browse')

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCollection())
  }, [dispatch, status])

  return (
    <div className="app">
      <header className="app-header">
        <h1>MTG Collection</h1>
      </header>

      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            disabled={!tab.enabled}
            onClick={() => tab.enabled && setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'browse'  && <BrowseCollection />}
      {activeTab === 'search'  && <SearchMtgDatabase />}
      {activeTab === 'edit'    && <EditLocations />}
      {activeTab === 'updates' && <Updates />}
    </div>
  )
}
