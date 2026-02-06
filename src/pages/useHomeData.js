import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllObjects } from "../lib/cosmicClient";

const GITHUB_USER = "prammbhs";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_API_BASE = import.meta.env.VITE_GITHUB_API_BASE || "https://api.github.com";
const GITHUB_CACHE_KEY = `github-stats:${GITHUB_USER}`;

function getCachedGithubStats() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GITHUB_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedGithubStats(data) {
  if (typeof window === "undefined" || !data) return;
  try {
    window.localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

async function fetchGithubStats() {
  const userUrl = `${GITHUB_API_BASE}/users/${encodeURIComponent(GITHUB_USER)}`;
  const reposUrl = `${GITHUB_API_BASE}/users/${encodeURIComponent(GITHUB_USER)}/repos?per_page=100&sort=updated`;
  const eventsUrl = `${GITHUB_API_BASE}/users/${encodeURIComponent(GITHUB_USER)}/events/public?per_page=100`;

  const headers = {
    Accept: "application/vnd.github+json",
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  };

  let userRes;
  let reposRes;
  let eventsRes;
  try {
    [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(userUrl, { headers }),
      fetch(reposUrl, { headers }),
      fetch(eventsUrl, { headers }),
    ]);
  } catch {
    return getCachedGithubStats();
  }

  const user = await userRes.json().catch(() => ({}));
  const repos = await reposRes.json().catch(() => []);
  const events = await eventsRes.json().catch(() => []);

  if (!userRes.ok) {
    return getCachedGithubStats();
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
    handle: user?.login || GITHUB_USER,
    url: user?.html_url || `https://github.com/${GITHUB_USER}`,
    followers: user?.followers,
    publicRepos: user?.public_repos,
    stars: totalStars,
    recentContributions: recentContribs,
  };
  setCachedGithubStats(payload);
  return payload;
}

function buildSkillIcons(profile) {
  if (!profile?.metadata) return [];
  const { language = [], frontend = [], backend = [], devops_and_cloud = [], databases_and_tool = [] } = profile.metadata;
  return Array.from(
    new Set(
      [
        ...language,
        ...frontend,
        ...backend,
        ...devops_and_cloud,
        ...databases_and_tool,
      ].filter(Boolean)
    )
  );
}

function buildLeetStats(leetcode) {
  const stats = leetcode?.totalQuestionStats;
  const questions = stats ? (stats.totalQuestionCounts || 0) : null;
  return {
    handle: leetcode?.userStats?.handle,
    rating: leetcode?.userStats?.currentRating,
    maxRating: leetcode?.userStats?.maxRating,
    solved: questions,
    badge: leetcode?.badgeStats?.badgeList?.[0]?.displayName,
    avatar: leetcode?.userStats?.titlePhoto,
    url: leetcode?.userStats?.handle ? `https://leetcode.com/${leetcode.userStats.handle}/` : null,
  };
}

function buildGithubStats(githubData) {
  if (!githubData) return null;
  return {
    handle: githubData.handle,
    url: githubData.url,
    activeDays: githubData.publicRepos,
    contributions: githubData.recentContributions,
    stars: githubData.stars,
  };
}

function buildDsaTotals(platformProfiles) {
  let easy = 0;
  let medium = 0;
  let hard = 0;
  let total = 0;
  platformProfiles.forEach((p) => {
    const stats = p.totalQuestionStats || {};
    easy += stats.easyQuestionCounts || 0;
    medium += stats.mediumQuestionCounts || 0;
    hard += stats.hardQuestionCounts || 0;
    total += stats.totalQuestionCounts || 0;
  });
  return { easy, medium, hard, total };
}

function buildPlatformBadges(platformProfiles) {
  const badges = [];
  platformProfiles.forEach((p) => {
    const platform = p.platform;
    const list = p.badgeStats?.badgeList || [];
    list.forEach((badge, idx) => {
      badges.push({
        id: `${platform}-${idx}-${badge.name || badge.displayName || "badge"}`,
        platform,
        name: badge.displayName || badge.name || "Badge",
        icon: badge.icon || badge.imageUrl,
        stars: badge.stars,
      });
    });
  });
  return badges;
}

export function useHomeData() {
  const [shouldFetchGithub, setShouldFetchGithub] = useState(false);

  useEffect(() => {
    let idleId;
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setShouldFetchGithub(true), { timeout: 2500 });
      } else {
        const timer = window.setTimeout(() => setShouldFetchGithub(true), 1500);
        idleId = () => window.clearTimeout(timer);
      }
    }
    return () => {
      if (typeof idleId === "number" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      } else if (typeof idleId === "function") {
        idleId();
      }
    };
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cosmic-all"],
    queryFn: () => fetchAllObjects(),
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: githubData } = useQuery({
    queryKey: ["github-stats", GITHUB_USER],
    queryFn: fetchGithubStats,
    enabled: shouldFetchGithub,
    initialData: () => getCachedGithubStats() || undefined,
    staleTime: 6 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1500,
  });

  const [view, setView] = useState("dsa");
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate) return undefined;
    const id = window.setInterval(() => {
      setView((v) => (v === "dsa" ? "dev" : "dsa"));
    }, 8000);
    return () => window.clearInterval(id);
  }, [autoRotate]);

  const pauseAutoRotate = useCallback(() => setAutoRotate(false), []);

  const profile = useMemo(
    () => (Array.isArray(data) ? data.find((item) => item?.type === "profile") : null),
    [data]
  );

  const platformData = useMemo(
    () => (Array.isArray(data) ? data.find((item) => item?.type === "platformdata") : null),
    [data]
  );

  const skillIcons = useMemo(() => buildSkillIcons(profile), [profile]);

  const leetcode = useMemo(
    () => platformData?.metadata?.platformdata?.platformProfiles?.find((p) => p.platform === "leetcode"),
    [platformData]
  );

  const leetStats = useMemo(() => buildLeetStats(leetcode), [leetcode]);

  const githubStats = useMemo(() => buildGithubStats(githubData), [githubData]);

  const platformProfiles = platformData?.metadata?.platformdata?.platformProfiles || [];

  const dsaTotals = useMemo(() => buildDsaTotals(platformProfiles), [platformProfiles]);

  const platformBadges = useMemo(() => buildPlatformBadges(platformProfiles), [platformProfiles]);

  const cardView = view === "dsa" ? leetStats : githubStats;
  const cardUrl = cardView?.url;
  const devActive = githubStats?.activeDays ?? "--";
  const devContrib = githubStats?.contributions ?? "--";
  const devProfile = githubStats?.handle || githubStats?.url
    ? { handle: githubStats?.handle, url: githubStats?.url, contributions: githubStats?.contributions }
    : null;
  const linkedinUrl = "https://www.linkedin.com/in/paramjitpatel";
  const githubUrl = githubStats?.url || "https://github.com/ParamjitPatel";

  return {
    profile,
    isLoading,
    isError,
    error,
    view,
    setView,
    pauseAutoRotate,
    leetStats,
    githubStats,
    platformProfiles,
    dsaTotals,
    platformBadges,
    devActive,
    devContrib,
    devProfile,
    cardUrl,
    skillIcons,
    linkedinUrl,
    githubUrl,
  };
}
