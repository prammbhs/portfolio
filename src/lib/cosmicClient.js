const bucket = import.meta.env.VITE_COSMIC_BUCKET;
const readKey = import.meta.env.VITE_COSMIC_READ_KEY;
const profileSlug = import.meta.env.VITE_COSMIC_PROFILE_SLUG;
const platformSlug = import.meta.env.VITE_COSMIC_PLATFORM_SLUG;
const apiBase = "https://api.cosmicjs.com/v3";

export async function fetchProfile(slug = profileSlug) {
  if (!bucket) throw new Error("Missing VITE_COSMIC_BUCKET env var");
  if (!slug) throw new Error("Missing profile slug. Set VITE_COSMIC_PROFILE_SLUG.");

  const commonParams = new URLSearchParams({ props: "slug,title,metadata" });
  if (readKey) commonParams.set("read_key", readKey);

  // First try direct by slug
  const directUrl = new URL(
    `${apiBase}/buckets/${encodeURIComponent(bucket)}/objects/${encodeURIComponent(slug)}`
  );
  directUrl.search = commonParams.toString();

  const res = await fetch(directUrl.toString(), { headers: { Accept: "application/json" }, cache: "no-cache" });
  const json = await res.json().catch(() => ({}));

  if (res.ok && json.object) return json.object;

  // Fallback: search by slug in case of type/draft issues
  const queryUrl = new URL(`${apiBase}/buckets/${encodeURIComponent(bucket)}/objects`);
  const qParams = new URLSearchParams(commonParams);
  qParams.set("query", JSON.stringify({ slug }));
  qParams.set("limit", "1");
  qParams.set("status", "all");
  queryUrl.search = qParams.toString();

  const res2 = await fetch(queryUrl.toString(), { headers: { Accept: "application/json" }, cache: "no-cache" });
  const json2 = await res2.json().catch(() => ({}));

  if (res2.ok && json2.objects && json2.objects[0]) return json2.objects[0];

  const message = json.message || json2.message || `${res.status} ${res.statusText}` || "Unknown Cosmic error";
  throw new Error(`Cosmic fetch failed: ${message}`);
}

export async function fetchPlatformData(slug = platformSlug) {
  if (!bucket) throw new Error("Missing VITE_COSMIC_BUCKET env var");
  if (!slug) throw new Error("Missing platform slug. Set VITE_COSMIC_PLATFORM_SLUG.");

  const commonParams = new URLSearchParams({ props: "slug,title,metadata" });
  if (readKey) commonParams.set("read_key", readKey);

  const directUrl = new URL(
    `${apiBase}/buckets/${encodeURIComponent(bucket)}/objects/${encodeURIComponent(slug)}`
  );
  directUrl.search = commonParams.toString();

  const res = await fetch(directUrl.toString(), { headers: { Accept: "application/json" }, cache: "no-cache" });
  const json = await res.json().catch(() => ({}));
  if (res.ok && json.object) return json.object;

  const queryUrl = new URL(`${apiBase}/buckets/${encodeURIComponent(bucket)}/objects`);
  const qParams = new URLSearchParams(commonParams);
  qParams.set("query", JSON.stringify({ slug }));
  qParams.set("limit", "1");
  qParams.set("status", "all");
  queryUrl.search = qParams.toString();

  const res2 = await fetch(queryUrl.toString(), { headers: { Accept: "application/json" }, cache: "no-cache" });
  const json2 = await res2.json().catch(() => ({}));

  if (res2.ok && json2.objects && json2.objects[0]) return json2.objects[0];

  const message = json.message || json2.message || `${res.status} ${res.statusText}` || "Unknown Cosmic error";
  throw new Error(`Cosmic fetch failed: ${message}`);
}
