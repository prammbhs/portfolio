import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile, fetchPlatformData } from "../lib/cosmicClient";

const CODOLIO_USER_KEY = "Paramjit_Patel";

async function fetchCodolioProfile() {
  const url = `https://api.codolio.com/github/profile?userKey=${encodeURIComponent(CODOLIO_USER_KEY)}`;
  const res = await fetch(url, { method: "GET" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.data) {
    const msg = json?.status?.message || `${res.status} ${res.statusText}`;
    throw new Error(`Codolio fetch failed: ${msg}`);
  }
  return json.data;
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

function buildCodolioStats(codolioData) {
  if (!codolioData) return null;
  return {
    handle: codolioData.githubProfile,
    url: codolioData.githubProfile ? `https://github.com/${codolioData.githubProfile}` : null,
    activeDays: codolioData.totalActiveDays,
    contributions: codolioData.totalContributions ?? codolioData.commitCounts,
    stars: codolioData.stars,
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
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  const { data: platformData } = useQuery({
    queryKey: ["platformdata"],
    queryFn: () => fetchPlatformData(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: codolioData } = useQuery({
    queryKey: ["codolio", CODOLIO_USER_KEY],
    queryFn: fetchCodolioProfile,
    staleTime: 6 * 60 * 60 * 1000,
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

  const skillIcons = useMemo(() => buildSkillIcons(profile), [profile]);

  const leetcode = useMemo(
    () => platformData?.metadata?.platformdata?.platformProfiles?.find((p) => p.platform === "leetcode"),
    [platformData]
  );

  const leetStats = useMemo(() => buildLeetStats(leetcode), [leetcode]);

  const codolioStats = useMemo(() => buildCodolioStats(codolioData), [codolioData]);

  const platformProfiles = platformData?.metadata?.platformdata?.platformProfiles || [];

  const dsaTotals = useMemo(() => buildDsaTotals(platformProfiles), [platformProfiles]);

  const platformBadges = useMemo(() => buildPlatformBadges(platformProfiles), [platformProfiles]);

  const cardView = view === "dsa" ? leetStats : codolioStats;
  const cardUrl = cardView?.url;
  const devActive = codolioStats?.activeDays ?? "--";
  const devContrib = codolioStats?.contributions ?? "--";
  const devProfile = codolioStats?.handle || codolioStats?.url
    ? { handle: codolioStats?.handle, url: codolioStats?.url, contributions: codolioStats?.contributions }
    : null;
  const linkedinUrl = "https://www.linkedin.com/in/paramjitpatel";
  const githubUrl = codolioStats?.url || "https://github.com/ParamjitPatel";

  return {
    profile,
    isLoading,
    isError,
    error,
    view,
    setView,
    pauseAutoRotate,
    leetStats,
    codolioStats,
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
