import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllObjects } from "../lib/cosmicClient";

export function useCertificates() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cosmic-all"],
    queryFn: () => fetchAllObjects(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const certificates = useMemo(() => {
    const items = Array.isArray(data) ? data : [];
    return items
      .filter((item) => item?.type === "certificates")
      .sort((a, b) => {
        const aFeatured = a?.metadata?.featured ? 1 : 0;
        const bFeatured = b?.metadata?.featured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return String(a?.title || "").localeCompare(String(b?.title || ""));
      });
  }, [data]);

  return {
    certificates,
    isLoading,
    isError,
    error,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  };
}
