import { throwOnError } from './apiUtils'
import type { CollectionCard } from '../types/card'

export async function addCardToCollection(
  card: CollectionCard,
  locationId: number,
  quantity: number,
  isFoil: boolean
): Promise<void> {
  const body = {
    cardId:          card.cardId,
    setId:           card.setId ?? '',
    setCode:         card.setCode,
    setName:         card.setName,
    name:            card.name,
    manaCost:        card.manaCost,
    cmc:             card.cmc,
    typeLine:        card.typeLine,
    rarity:          card.rarity,
    oracleText:      card.oracleText,
    power:           card.power,
    toughness:       card.toughness,
    artist:          card.artist,
    flavorText:      card.flavorText,
    collectorNumber: card.collectorNumber,
    imageNormal:     card.imageNormal,
    imageNormalBack: card.imageNormalBack,
    colors:          card.colors ? card.colors.split(',').filter(Boolean) : null,
    faces:           card.faces,
    usd:             card.usd,
    usdFoil:         card.usdFoil,
    locationId,
    quantity,
    isFoil,
  }

  const res = await fetch('/api/collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to add card (${res.status})`)
  }
}

export async function updateCollectionQuantity(collectionId: number, quantity: number): Promise<void> {
  const res = await fetch(`/api/collection/${collectionId}/quantity`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
  await throwOnError(res, `Failed to update quantity (${res.status})`)
}

export async function moveCollectionCard(
  collectionId: number,
  fromLocationId: number,
  toLocationId: number,
  quantity: number,
): Promise<void> {
  const res = await fetch(`/api/collection/${collectionId}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromLocationId, toLocationId, quantity }),
  })
  await throwOnError(res, `Failed to move card (${res.status})`)
}
