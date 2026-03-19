import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllObjects } from "../lib/cosmicClient";
import { 
  useProfileForgeStats, 
  useProfileForgePlatform,
  useProfileForgeBadges
} from "../hooks/useProfileForge";

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

function buildLeetStats(pfLeetcode) {
  const pd = pfLeetcode?.platform_data;
  return {
    handle: pfLeetcode?.username,
    rating: pd?.ranking,
    maxRating: pd?.ranking, // fallback
    solved: pd?.submitStatsGlobal?.acSubmissionNum?.find(i => i.difficulty === "All")?.count || null,
    badge: pd?.activeBadge?.displayName || pd?.badges?.[0]?.displayName,
    avatar: pd?.avatar,
    url: pfLeetcode?.profile_url,
  };
}

function buildGithubStats(pfGithub) {
  if (!pfGithub) return null;
  const repos = pfGithub?.platform_data?.profile?.repos || [];
  const activeDays = repos.length;
  const stars = repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const contributions = repos.reduce((acc, r) => acc + (r.commits?.length || 0), 0);
  return {
    handle: pfGithub.username,
    url: pfGithub.profile_url,
    activeDays,
    contributions,
    stars,
    repos,
  };
}

function buildDsaTotals(pfStats) {
  if (!pfStats) return { easy: 0, medium: 0, hard: 0, total: 0, topics: [] };
  return {
    easy: pfStats.easy || 0,
    medium: pfStats.medium || 0,
    hard: pfStats.hard || 0,
    total: pfStats.totalSolved || 0,
    topics: pfStats.topics || [],
  };
}

// Removed buildPlatformBadges since we fetch them directly from PF API now

export function useHomeData() {
  const { data, isLoading: cosmicLoading, isError: cosmicIsError, error: cosmicError } = useQuery({
    queryKey: ["cosmic-all"],
    queryFn: () => fetchAllObjects(),
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: pfStats, isLoading: statsLoading } = useProfileForgeStats();
  const { data: pfGithub, isLoading: githubLoading } = useProfileForgePlatform("github");
  const { data: pfLeetcode, isLoading: leetcodeLoading } = useProfileForgePlatform("leetcode");
  const { data: pfBadges, isLoading: badgesLoading } = useProfileForgeBadges();

  const isLoading = cosmicLoading || statsLoading || githubLoading || leetcodeLoading || badgesLoading;
  const isError = cosmicIsError;
  const error = cosmicError;

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

  const leetStats = useMemo(() => buildLeetStats(pfLeetcode), [pfLeetcode]);

  const githubStats = useMemo(() => buildGithubStats(pfGithub), [pfGithub]);

  // Keep old platform data structure if needed by Badges
  const platformProfiles = platformData?.metadata?.platformdata?.platformProfiles || [];

  const dsaTotals = useMemo(() => buildDsaTotals(pfStats), [pfStats]);
  const dsaTopics = dsaTotals.topics || [];

  const platformBadges = useMemo(() => {
    if (!pfBadges) return [];
    return Object.values(pfBadges).map((b, idx) => ({
      id: `pf-badge-${idx}`,
      platform: b.issuerName || "ProfileForge",
      name: b.name,
      icon: b.image,
      stars: b.stars, 
    }));
  }, [pfBadges]);

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
    dsaTopics,
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
