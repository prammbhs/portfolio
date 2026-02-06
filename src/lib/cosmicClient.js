const responseCache = new Map();
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

function getCachedResponse(cacheKey) {
  const entry = responseCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(cacheKey);
    return null;
  }
  return entry.json;
}

async function fetchJsonWithCache(url, { cacheKey = url, ttlMs = DEFAULT_CACHE_TTL } = {}) {
  const cached = getCachedResponse(cacheKey);
  if (cached) return { res: { ok: true, status: 200, statusText: "OK" }, json: cached };

  const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-cache" });
  const json = await res.json().catch(() => ({}));
  if (res.ok) {
    responseCache.set(cacheKey, { json, expiresAt: Date.now() + ttlMs });
  }
  return { res, json };
}

export async function fetchAllObjects({ limit = 50, skip = 0 } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  const url = `/api/cosmic?${params.toString()}`;

  const resp = await fetchJsonWithCache(url);
  if (resp.res.ok && Array.isArray(resp.json.objects)) return resp.json.objects;

  const message = resp.json.error || resp.json.message || `${resp.res.status} ${resp.res.statusText}` || "Unknown Cosmic error";
  throw new Error(`Cosmic fetch failed: ${message}`);
}
