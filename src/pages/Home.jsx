import { Suspense, lazy } from "react";
const ProfileCardWithStats = lazy(() => import("../components/ProfileCardWithStats"));
import HomeProfileDetails from "../components/HomeProfileDetails";
import { useHomeData } from "./useHomeData";

function Home() {
  const {
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
  } = useHomeData();

  return (
    <section id="home" className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 pt-16 pb-24 min-[900px]:pt-24 min-[900px]:pb-28 space-y-20">
      <div className="flex flex-col gap-8 min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:items-start min-[900px]:gap-12">
        <Suspense fallback={<div className="h-[520px] w-full max-w-lg rounded-3xl border border-foreground/10 bg-foreground/5" />}> 
          <ProfileCardWithStats
            name={profile?.metadata?.full_name || "Profile"}
            view={view}
            setView={setView}
            onUserInteract={pauseAutoRotate}
            dsaTotals={dsaTotals}
            dsaTopics={dsaTopics}
            dsaHandle={leetStats?.handle}
            devHandle={githubStats?.handle}
            devActive={devActive}
            devContrib={devContrib}
            devProfile={devProfile}
            contactUrl={cardUrl}
            tags={skillIcons}
            platformProfiles={platformProfiles}
            badges={platformBadges}
          />
        </Suspense>

        <HomeProfileDetails
          profile={profile}
          isLoading={isLoading}
          isError={isError}
          error={error}
          linkedinUrl={linkedinUrl}
          githubUrl={githubUrl}
        />

      </div>


    </section>
  );
}

export default Home;