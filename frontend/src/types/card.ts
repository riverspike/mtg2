export interface CardFace {
  face: number
  name: string
  manaCost: string | null
  typeLine: string | null
  oracleText: string | null
  flavorText: string | null
  power: string | null
  toughness: string | null
}

export interface LocationOption {
  locationId: number
  name: string
  type: string
}

export interface CollectionCard {
  id: number
  cardId: string
  setId?: string | null
  isFoil: boolean
  quantity: number
  timeUpdated: string | null
  name: string
  manaCost: string | null
  cmc: number
  typeLine: string | null
  rarity: string
  oracleText: string | null
  power: string | null
  toughness: string | null
  artist: string | null
  flavorText: string | null
  setCode: string
  setName: string
  imageNormal: string | null
  imageNormalBack: string | null
  colors: string | null
  collectorNumber: string | null
  locations: string | null
  usd: number | null
  usdFoil: number | null
  priceUpdatedAt: string | null
  faces: CardFace[] | null
}

export interface CardFiltersState {
  name: string
  colors: string[]
  sets: string[]
  locations: string[]
}
