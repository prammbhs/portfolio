const bucket = import.meta.env.VITE_COSMIC_BUCKET;
const readKey = import.meta.env.VITE_COSMIC_READ_KEY;
const apiBase = "https://api.cosmicjs.com/v3";

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
  if (!bucket) throw new Error("Missing VITE_COSMIC_BUCKET env var");

  const params = new URLSearchParams({
    props: "slug,title,metadata,type",
    limit: String(limit),
    skip: String(skip),
    status: "all",
  });
  if (readKey) params.set("read_key", readKey);

  const url = new URL(`${apiBase}/buckets/${encodeURIComponent(bucket)}/objects`);
  url.search = params.toString();

  const resp = await fetchJsonWithCache(url.toString());
  if (resp.res.ok && Array.isArray(resp.json.objects)) return resp.json.objects;

  const message = resp.json.message || `${resp.res.status} ${resp.res.statusText}` || "Unknown Cosmic error";
  throw new Error(`Cosmic fetch failed: ${message}`);
}
