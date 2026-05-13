export async function updateCardSetList(): Promise<{ added: number }> {
  const res = await fetch('/api/sets/update', { method: 'POST' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Server error (${res.status})`)
  }
  return res.json()
}

export async function updateCardPrices(): Promise<{ updated: number }> {
  const res = await fetch('/api/prices/update', { method: 'POST' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Server error (${res.status})`)
  }
  return res.json()
}
