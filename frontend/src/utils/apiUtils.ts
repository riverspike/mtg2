export async function throwOnError(res: Response, fallback: string): Promise<void> {
  if (res.ok) return
  let message = fallback
  try {
    const json = await res.json()
    if (json?.message) message = json.message
  } catch {}
  throw new Error(message)
}
