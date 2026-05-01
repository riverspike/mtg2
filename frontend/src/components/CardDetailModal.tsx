import { useState } from 'react'
import ManaText from './ManaText'
import type { CollectionCard } from '../types/card'

interface Props {
  card: CollectionCard
  onClose: () => void
}

export default function CardDetailModal({ card, onClose }: Props) {
  const isDfc    = Array.isArray(card.faces) && card.faces.length === 2
  const [activeFace, setActiveFace] = useState(0)

  const face = isDfc ? card.faces![activeFace] : null

  const detail = {
    manaCost:   isDfc ? face!.manaCost   : card.manaCost,
    typeLine:   isDfc ? face!.typeLine   : card.typeLine,
    oracleText: isDfc ? face!.oracleText : card.oracleText,
    flavorText: isDfc ? face!.flavorText : card.flavorText,
    power:      isDfc ? face!.power      : card.power,
    toughness:  isDfc ? face!.toughness  : card.toughness,
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
      </div>
    </div>
  )
}
