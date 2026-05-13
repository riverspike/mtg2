export interface SetOption {
  code: string
  name: string
}

export async function fetchAllSets(): Promise<SetOption[]> {
  const res = await fetch('/api/sets')
  if (!res.ok) throw new Error(`Failed to fetch sets (${res.status})`)
  return res.json()
}
