import ProfileCardWithStats from "../components/ProfileCardWithStats";
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
  } = useHomeData();

  return (
    <section id="home" className="mx-auto max-w-5xl pt-16 pb-24 md:pt-24 md:pb-28 space-y-20">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-12">
        <ProfileCardWithStats
          name={profile?.metadata?.full_name || "Profile"}
          view={view}
          setView={setView}
          dsaTotals={dsaTotals}
          dsaHandle={leetStats?.handle}
          devHandle={codolioStats?.handle}
          devActive={devActive}
          devContrib={devContrib}
          devProfile={devProfile}
          contactUrl={cardUrl}
          tags={skillIcons}
          platformProfiles={platformProfiles}
          badges={platformBadges}
        />

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