import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfileCardWithStats from "../components/ProfileCardWithStats";
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

function Home() {
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

  useEffect(() => {
    const id = window.setInterval(() => {
      setView((v) => (v === "dsa" ? "dev" : "dsa"));
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  const skillIcons = useMemo(() => {
    if (!profile?.metadata) return [];
    const { language = [], frontend = [], backend = [], devops_and_cloud = [], databases_and_tool = [] } =
      profile.metadata;
    return Array.from(
      new Set([
        ...language,
        ...frontend,
        ...backend,
        ...devops_and_cloud,
        ...databases_and_tool,
      ].filter(Boolean))
    );
  }, [profile]);

  const leetcode = useMemo(
    () => platformData?.metadata?.platformdata?.platformProfiles?.find((p) => p.platform === "leetcode"),
    [platformData]
  );

  const leetStats = useMemo(() => {
    const stats = leetcode?.totalQuestionStats;
    const questions = stats
      ? (stats.totalQuestionCounts || 0)
      : null;
    return {
      handle: leetcode?.userStats?.handle,
      rating: leetcode?.userStats?.currentRating,
      maxRating: leetcode?.userStats?.maxRating,
      solved: questions,
      badge: leetcode?.badgeStats?.badgeList?.[0]?.displayName,
      avatar: leetcode?.userStats?.titlePhoto,
      url: leetcode?.userStats?.handle ? `https://leetcode.com/${leetcode.userStats.handle}/` : null,
    };
  }, [leetcode]);

  const codolioStats = useMemo(() => {
    if (!codolioData) return null;
    return {
      handle: codolioData.githubProfile,
      url: codolioData.githubProfile ? `https://github.com/${codolioData.githubProfile}` : null,
      activeDays: codolioData.totalActiveDays,
      contributions: codolioData.totalContributions ?? codolioData.commitCounts,
      stars: codolioData.stars,
    };
  }, [codolioData]);

  const dsaTotals = useMemo(() => {
    const profiles = platformData?.metadata?.platformdata?.platformProfiles || [];
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let total = 0;
    profiles.forEach((p) => {
      const stats = p.totalQuestionStats || {};
      easy += stats.easyQuestionCounts || 0;
      medium += stats.mediumQuestionCounts || 0;
      hard += stats.hardQuestionCounts || 0;
      total += stats.totalQuestionCounts || 0;
    });
    return { easy, medium, hard, total };
  }, [platformData]);

  const cardView = view === "dsa" ? leetStats : codolioStats;
  const cardUrl = cardView?.url;
  const dsaActive = leetStats?.activeDays ?? leetStats?.rating ?? "--";
  const dsaContrib = dsaTotals?.total ?? "--";
  const devActive = codolioStats?.activeDays ?? "--";
  const devContrib = codolioStats?.contributions ?? "--";
  const linkedinUrl = "https://www.linkedin.com/in/paramjitpatel";
  const githubUrl = codolioStats?.url || "https://github.com/ParamjitPatel";

  return (
    <section id="home" className="mx-auto max-w-5xl pt-20 pb-24 md:pt-32 md:pb-28 space-y-20">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-12">
        <ProfileCardWithStats
          name={profile?.metadata?.full_name || "Profile"}
          view={view}
          setView={setView}
          dsaTotals={dsaTotals}
          dsaHandle={leetStats?.handle}
          dsaActive={dsaActive}
          dsaContrib={dsaContrib}
          devHandle={codolioStats?.handle}
          devActive={devActive}
          devContrib={devContrib}
          contactLabel={view === "dsa" ? "View DSA" : "View GitHub"}
          contactUrl={cardUrl}
          tags={skillIcons}
        />

        <div className="order-2 md:col-span-7 md:order-1 space-y-8 md:pr-4 md:pt-6">
          {isLoading && !isError && (
            <div className="space-y-2">
              <div className="h-8 w-48 rounded-md bg-foreground/10 animate-pulse" />
              <div className="h-4 w-full max-w-md rounded-md bg-foreground/10 animate-pulse" />
              <div className="h-4 w-full max-w-lg rounded-md bg-foreground/10 animate-pulse" />
            </div>
          )}

          {isError ? (
            <p className="text-sm text-red-500">{error?.message || "Failed to load profile."}</p>
          ) : profile ? (
            <>
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  {profile.metadata.full_name}
                </h1>
                <p className="text-2xl font-semibold text-foreground/80 animate-pulse">
                  {profile.metadata.headline}
                </p>
                <p className="text-foreground/80 leading-relaxed">{profile.metadata.bio}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-sm text-foreground/70 md:justify-start">
                <span className="rounded-full bg-foreground/10 px-3 py-1">{profile.metadata.location}</span>
                <a className="rounded-full bg-foreground/10 px-3 py-1 hover:text-foreground" href={`mailto:${profile.metadata.email}`}>
                  {profile.metadata.email}
                </a>
                <a
                  className="rounded-full bg-foreground/10 px-3 py-1 hover:text-foreground inline-flex items-center gap-2"
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="inline-block h-4 w-4" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                      <path d="M4.98 3.5c0 1.38-1.1 2.5-2.48 2.5C1.1 6 0 4.88 0 3.5S1.1 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.99h4.56V24H.22zM8.75 8.99h4.37v2.05h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-7.22c0-1.72-.03-3.94-2.4-3.94-2.4 0-2.77 1.87-2.77 3.8V24H8.75z" />
                    </svg>
                  </span>
                  <span>LinkedIn</span>
                </a>
                <a
                  className="rounded-full bg-foreground/10 px-3 py-1 hover:text-foreground inline-flex items-center gap-2"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="inline-block h-4 w-4" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.72.08-.71.08-.71 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.75.4-1.24.73-1.53-2.55-.29-5.24-1.27-5.24-5.67 0-1.25.45-2.27 1.17-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.73.8 1.17 1.82 1.17 3.07 0 4.41-2.69 5.38-5.26 5.66.42.36.8 1.08.8 2.18 0 1.58-.02 2.85-.02 3.24 0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
                    </svg>
                  </span>
                  <span>GitHub</span>
                </a>
                {profile.metadata.resume_pdf?.url ? (
                  <a
                    className="rounded-full bg-foreground px-3 py-1 font-semibold text-background hover:opacity-90"
                    href={profile.metadata.resume_pdf.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Resume
                  </a>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

      </div>


    </section>
  );
}

export default Home;