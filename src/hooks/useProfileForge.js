import { useQuery } from "@tanstack/react-query";

const API_BASE = "https://profileforge.duckdns.org/api/v1/keys";
const API_KEY = import.meta.env.VITE_PROFILEFORGE_KEY;

const STALE_TIME = 6 * 60 * 60 * 1000; // 6 hours

async function fetchFromProfileForge(endpoint) {
  if (!API_KEY) {
    throw new Error("ProfileForge API key is missing in .env");
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ProfileForge ${endpoint}`);
  }
  return res.json();
}

export function useProfileForgeStats() {
  return useQuery({
    queryKey: ["pf-stats"],
    queryFn: () => fetchFromProfileForge("/stats"),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useProfileForgeBadges() {
  return useQuery({
    queryKey: ["pf-badges"],
    queryFn: () => fetchFromProfileForge("/badges"),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useProfileForgePlatform(platform) {
  return useQuery({
    queryKey: ["pf-platform", platform],
    queryFn: () => fetchFromProfileForge(`/platforms/${platform}`),
    enabled: !!platform,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });
}
