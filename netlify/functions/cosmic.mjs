const bucket = Netlify.env.get("VITE_COSMIC_BUCKET");
const readKey = Netlify.env.get("VITE_COSMIC_READ_KEY");
const apiBase = "https://api.cosmicjs.com/v3";

export default async (req) => {
  if (!bucket) {
    return new Response(JSON.stringify({ error: "Missing COSMIC_BUCKET config" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const limit = url.searchParams.get("limit") || "50";
  const skip = url.searchParams.get("skip") || "0";

  const params = new URLSearchParams({
    props: "slug,title,metadata,type",
    limit,
    skip,
    status: "all",
  });
  if (readKey) params.set("read_key", readKey);

  const cosmicUrl = `${apiBase}/buckets/${encodeURIComponent(bucket)}/objects?${params.toString()}`;

  const resp = await fetch(cosmicUrl, {
    headers: { Accept: "application/json" },
  });

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    return new Response(JSON.stringify({ error: data.message || "Cosmic fetch failed" }), {
      status: resp.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
};

export const config = {
  path: "/api/cosmic",
};
