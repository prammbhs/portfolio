import { useMemo } from "react";
import { useProfileForgeBadges } from "./useProfileForge";

export function useBadges() {
  const { data, isLoading, isError, error } = useProfileForgeBadges();

  const cmsBadges = useMemo(() => {
    if (!data) return [];
    return Object.values(data).map((b, idx) => ({
      slug: `pf-badge-${idx}`,
      title: b.name,
      metadata: {
        issuing_platform: b.issuerName || "ProfileForge",
        badge_name: b.name,
        badge_image: { imgix_url: b.image },
        star_rating: b.stars || "--",
        badge_url: null, // Add if url available in future
      }
    }));
  }, [data]);

  const cardBadges = useMemo(() => {
    // Return empty array since all badges (including cards) have been unified in ProfileForge output.
    return [];
  }, [data]);

  return { cmsBadges, cardBadges, isLoading, isError, error };
}
