import type { CollectionCard, CardFace, CardFiltersState } from '../types/card'

// Scryfall rate limit: 10 requests/second
// See: https://scryfall.com/docs/api — "We ask that you avoid making more than 10 requests per second."
// Each paginated page fetch includes a 100ms delay to stay within this limit.
const DELAY_MS = 100

const BASE_URL = 'https://api.scryfall.com'

const HEADERS: HeadersInit = {
  'User-Agent': 'MTGCollectionApp/1.0',
  'Accept': 'application/json',
}

// ── Scryfall response types ───────────────────────────────────────────────────

interface ScryfallImageUris {
  normal?: string
}

interface ScryfallCardFace {
  name: string
  mana_cost?: string
  type_line?: string
  oracle_text?: string
  flavor_text?: string
  power?: string
  toughness?: string
  image_uris?: ScryfallImageUris
}

interface ScryfallCard {
  id: string
  name: string
  mana_cost?: string
  cmc: number
  type_line: string
  oracle_text?: string
  flavor_text?: string
  power?: string
  toughness?: string
  rarity: string
  set: string
  set_name: string
  collector_number: string
  image_uris?: ScryfallImageUris
  card_faces?: ScryfallCardFace[]
  colors?: string[]
  artist?: string
}

interface ScryfallListResponse {
  data: ScryfallCard[]
  has_more: boolean
  next_page?: string
}

// ── Mapping ───────────────────────────────────────────────────────────────────

function mapCard(sc: ScryfallCard): CollectionCard {
  const isDfc = Array.isArray(sc.card_faces) && sc.card_faces.length >= 2

  const faces: CardFace[] | null = isDfc
    ? sc.card_faces!.map((f, idx) => ({
        face: idx,
        name: f.name,
        manaCost: f.mana_cost ?? null,
        typeLine: f.type_line ?? null,
        oracleText: f.oracle_text ?? null,
        flavorText: f.flavor_text ?? null,
        power: f.power ?? null,
        toughness: f.toughness ?? null,
      }))
    : null

  return {
    id: 0,
    cardId: sc.id,
    isFoil: false,
    quantity: 0,
    timeUpdated: null,
    name: sc.name,
    manaCost: sc.mana_cost ?? (isDfc ? (sc.card_faces![0].mana_cost ?? null) : null),
    cmc: sc.cmc,
    typeLine: sc.type_line,
    rarity: sc.rarity,
    oracleText: sc.oracle_text ?? null,
    power: sc.power ?? null,
    toughness: sc.toughness ?? null,
    artist: sc.artist ?? null,
    flavorText: sc.flavor_text ?? null,
    setCode: sc.set,
    setName: sc.set_name,
    imageNormal: isDfc
      ? (sc.card_faces![0].image_uris?.normal ?? null)
      : (sc.image_uris?.normal ?? null),
    imageNormalBack: isDfc ? (sc.card_faces![1].image_uris?.normal ?? null) : null,
    colors: sc.colors?.join(',') ?? null,
    collectorNumber: sc.collector_number,
    locations: null,
    usd: null,
    usdFoil: null,
    priceUpdatedAt: null,
    faces,
  }
}

// ── Query builder ─────────────────────────────────────────────────────────────

export function buildQuery(
  filters: CardFiltersState,
  setCodeByName: Record<string, string>
): string {
  const parts: string[] = []

  if (filters.name.trim()) {
    parts.push(`name:${filters.name.trim()}`)
  }

  if (filters.colors.length > 0) {
    const colorParts = filters.colors.map(c => `color:${c.toLowerCase()}`)
    parts.push(
      filters.colors.length === 1
        ? colorParts[0]
        : `(${colorParts.join(' OR ')})`
    )
  }

  if (filters.sets.length > 0) {
    const codes = filters.sets.map(name => setCodeByName[name]).filter(Boolean)
    if (codes.length > 0) {
      const setParts = codes.map(code => `set:${code}`)
      parts.push(codes.length === 1 ? setParts[0] : `(${setParts.join(' OR ')})`)
    }
  }

  return parts.join(' ')
}

// ── Search ────────────────────────────────────────────────────────────────────

export async function searchScryfall(
  filters: CardFiltersState,
  setCodeByName: Record<string, string>
): Promise<CollectionCard[]> {
  const q = buildQuery(filters, setCodeByName)
  if (!q.trim()) return []

  const results: CollectionCard[] = []
  let url: string | null =
    `${BASE_URL}/cards/search?q=${encodeURIComponent(q)}`

  while (url) {
    const response = await fetch(url, { headers: HEADERS })

    if (response.status === 404) break  // Scryfall returns 404 for no results
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error((body as { details?: string }).details ?? `Scryfall error ${response.status}`)
    }

    const page: ScryfallListResponse = await response.json()
    results.push(...page.data.map(mapCard))

    if (page.has_more && page.next_page) {
      url = page.next_page
      // Rate limit: 10 req/s — see https://scryfall.com/docs/api
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))
    } else {
      url = null
    }
  }

  return results
}
