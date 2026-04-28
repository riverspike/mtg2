import { useDispatch, useSelector } from 'react-redux'
import { fetchCollection } from './store/collectionSlice.js'
import CollectionTable from './components/CollectionTable.jsx'

function App() {
  const dispatch = useDispatch()
  const { cards, status, error } = useSelector((state) => state.collection)

  return (
    <div className="app">
      <header>
        <h1>MTG Card Collection</h1>
        <button
          className="load-btn"
          onClick={() => dispatch(fetchCollection())}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Loading…' : 'Load All'}
        </button>
      </header>

      {error && <p className="error">Error: {error}</p>}

      {status === 'succeeded' && (
        <p className="count">{cards.length} cards loaded</p>
      )}

      {cards.length > 0 && <CollectionTable cards={cards} />}
    </div>
  )
}

export default App
