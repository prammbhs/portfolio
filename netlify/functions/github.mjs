const GITHUB_TOKEN = Netlify.env.get("VITE_GITHUB_TOKEN");
const GITHUB_API_BASE = "https://api.github.com";

export default async (req) => {
  const url = new URL(req.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({ error: "Missing username parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = {
    Accept: "application/vnd.github+json",
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  };

  const encodedUser = encodeURIComponent(username);

  let userRes, reposRes, eventsRes;
  try {
    [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${encodedUser}`, { headers }),
      fetch(`${GITHUB_API_BASE}/users/${encodedUser}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`${GITHUB_API_BASE}/users/${encodedUser}/events/public?per_page=100`, { headers }),
    ]);
  } catch {
    return new Response(JSON.stringify({ error: "GitHub API request failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await userRes.json().catch(() => ({}));
  const repos = await reposRes.json().catch(() => []);
  const events = await eventsRes.json().catch(() => []);

  if (!userRes.ok) {
    return new Response(JSON.stringify({ error: "GitHub user fetch failed" }), {
      status: userRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const totalStars = Array.isArray(repos)
    ? repos.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0)
    : 0;

  const recentContribs = Array.isArray(events)
    ? events.filter((evt) =>
        ["PushEvent", "PullRequestEvent", "IssuesEvent", "CreateEvent"].includes(evt?.type)
      ).length
    : 0;

  const payload = {
    handle: user?.login || username,
    url: user?.html_url || `https://github.com/${username}`,
    followers: user?.followers,
    publicRepos: user?.public_repos,
    stars: totalStars,
    recentContributions: recentContribs,
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=600",
    },
  });
};

export const config = {
  path: "/api/github",
};
