import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function isImgixHost(hostname) {
  return hostname?.includes("imgix.") || hostname?.includes("imgix");
}

export function isImgixUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return isImgixHost(parsed.hostname);
  } catch {
    return false;
  }
}

export function getImgixUrl(url, params = {}) {
  if (!isImgixUrl(url)) return url;
  const parsed = new URL(url);
  const nextParams = {
    auto: "format,compress",
    fit: "max",
    ...params,
  };

  Object.entries(nextParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    parsed.searchParams.set(key, String(value));
  });

  return parsed.toString();
}

export function getImgixSrcSet(url, widths = [], params = {}) {
  if (!isImgixUrl(url) || !widths.length) return undefined;
  return widths
    .map((width) => `${getImgixUrl(url, { ...params, w: width })} ${width}w`)
    .join(", ");
}
