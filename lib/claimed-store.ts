// ── Claimed Load Store ────────────────────────────────────────────────────────
// Persists across page navigations via localStorage.
// Broadcasts to other components on the same page via CustomEvent.

const STORAGE_KEY = 'vrpro_claimed_loads'
const EVENT_NAME  = 'vrpro_load_claimed'

let _cache: Set<string> | null = null

function getCache(): Set<string> {
  if (_cache) return _cache
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    _cache = raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set()
  } catch {
    _cache = new Set()
  }
  return _cache
}

function persist(store: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...store]))
  } catch { /* quota exceeded — still works in-memory */ }
}

/** Returns true if the delivery has already been claimed in this session. */
export function isLoadClaimed(id: string): boolean {
  return getCache().has(id)
}

/** Mark a delivery as claimed, persist it, and broadcast to the board. */
export function claimLoad(id: string): void {
  const store = getCache()
  if (store.has(id)) return
  store.add(id)
  persist(store)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { id } }))
  }
}

/** Listen for claim events fired by the detail page. Returns a cleanup fn. */
export function onLoadClaimed(cb: (id: string) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: Event) => cb((e as CustomEvent<{ id: string }>).detail.id)
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}

/** All claimed IDs (copy). Used by the board to filter on mount. */
export function getClaimedIds(): Set<string> {
  return new Set(getCache())
}
