import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllObjects } from "../lib/cosmicClient";

function buildPlatformBadges(platformProfiles) {
  const badges = [];
  platformProfiles.forEach((p) => {
    const platform = p.platform;
    const handle = p.userStats?.handle;
    const url = p.url || (handle ? `https://www.${platform}.com/${handle}` : null);
    const list = p.badgeStats?.badgeList || [];
    list.forEach((badge, idx) => {
      badges.push({
        id: `${platform}-${idx}-${badge.name || badge.displayName || "badge"}`,
        platform,
        name: badge.displayName || badge.name || "Badge",
        icon: badge.icon || badge.imageUrl,
        stars: badge.stars,
        url,
      });
    });
  });
  return badges;
}

export function useBadges() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cosmic-all"],
    queryFn: () => fetchAllObjects(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const cmsBadges = useMemo(() => {
    const items = Array.isArray(data) ? data : [];
    return items
      .filter((item) => item?.type === "badges")
      .sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
  }, [data]);

  const cardBadges = useMemo(() => {
    const platformData = Array.isArray(data) ? data.find((item) => item?.type === "platformdata") : null;
    const platformProfiles = platformData?.metadata?.platformdata?.platformProfiles || [];
    return buildPlatformBadges(platformProfiles);
  }, [data]);

  return { cmsBadges, cardBadges, isLoading, isError, error };
}
