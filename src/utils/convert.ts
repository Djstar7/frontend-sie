function safeParse(item: string | null) {
  if (!item || item === 'undefined' || item === 'null') return null
  try {
    return JSON.parse(item)
  } catch {
    return null
  }
}
export { safeParse }
