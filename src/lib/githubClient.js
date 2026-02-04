const apiBase = "https://api.github.com";

function extractHandle(urlOrHandle) {
  if (!urlOrHandle) return null;
  try {
    const asUrl = new URL(urlOrHandle);
    const seg = asUrl.pathname.replace(/^\//, "").split("/")[0];
    return seg || null;
  } catch {
    return urlOrHandle.replace(/^@/, "");
  }
}

export function getGithubHandleFromProfile(profile) {
  const url = profile?.metadata?.social_links?.github;
  return extractHandle(url);
}

export async function fetchGithubUser(handle) {
  if (!handle) throw new Error("Missing GitHub handle");
  const url = `${apiBase}/users/${encodeURIComponent(handle)}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "force-cache" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json.message || `${res.status} ${res.statusText}`;
    throw new Error(`GitHub fetch failed: ${message}`);
  }
  return json;
}
