import { useState } from 'react'
import AddLocationModal    from '../components/AddLocationModal'
import RenameLocationModal from '../components/RenameLocationModal'
import DeleteLocationModal from '../components/DeleteLocationModal'

type Modal = 'add' | 'rename' | 'delete' | null

export default function EditLocations() {
  const [modal, setModal] = useState<Modal>(null)

  return (
    <div className="edit-locations-view">
      <div className="edit-location-btn-row">
        <button className="search-btn" onClick={() => setModal('add')}>
          Add New Location
        </button>
        <button className="search-btn" onClick={() => setModal('rename')}>
          Rename Location
        </button>
        <button className="search-btn" onClick={() => setModal('delete')}>
          Delete Location
        </button>
      </div>

      {modal === 'add'    && <AddLocationModal    onClose={() => setModal(null)} />}
      {modal === 'rename' && <RenameLocationModal onClose={() => setModal(null)} />}
      {modal === 'delete' && <DeleteLocationModal onClose={() => setModal(null)} />}
    </div>
  )
}
