import type { CollectionCard } from '../types/card'

export function cardPrice(card: CollectionCard): number {
  return card.isFoil ? (card.usdFoil ?? 0) : (card.usd ?? 0)
}
