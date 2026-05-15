import type { LocationOption } from '../types/card'

async function throwOnError(res: Response, fallback: string): Promise<void> {
  if (res.ok) return
  let message = fallback
  try {
    const json = await res.json()
    if (json?.message) message = json.message
  } catch {}
  throw new Error(message)
}

export async function createLocation(name: string, type: string): Promise<void> {
  const res = await fetch('/api/locations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type }),
  })
  await throwOnError(res, `Failed to create location (${res.status})`)
}

export async function renameLocation(locationId: number, name: string, type: string): Promise<void> {
  const res = await fetch(`/api/locations/${locationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type }),
  })
  await throwOnError(res, `Failed to rename location (${res.status})`)
}

export async function getEmptyLocations(): Promise<LocationOption[]> {
  const res = await fetch('/api/locations/empty')
  if (!res.ok) throw new Error(`Failed to fetch locations (${res.status})`)
  return res.json()
}

export async function deleteLocation(locationId: number): Promise<void> {
  const res = await fetch(`/api/locations/${locationId}`, { method: 'DELETE' })
  await throwOnError(res, `Failed to delete location (${res.status})`)
}
