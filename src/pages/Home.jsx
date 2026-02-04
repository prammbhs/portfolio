import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../lib/cosmicClient";

function SkillIconGrid({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const id = item?.toString().trim().toLowerCase();
        if (!id) return null;
        const src = `https://skillicons.dev/icons?i=${encodeURIComponent(id)}&theme=dark`;
        return (
          <div
            key={item}
            className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2 shadow-sm"
          >
            <img
              src={src}
              alt={id}
              loading="lazy"
              className="h-6 w-6 shrink-0"
            />
            <span className="text-sm font-medium text-foreground/80 capitalize">{item}</span>
          </div>
        );
      })}
    </div>
  );
}

function Home() {
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

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

  return (
    <section className="mx-auto max-w-5xl px-4 pt-20 pb-24 md:pt-32 md:pb-28 space-y-20">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-10">
        <div className="order-1 rounded-xl border border-foreground/10 bg-foreground/5 p-4 text-sm text-foreground/70 md:order-2 md:col-span-4 md:self-start">
          Stats card placeholder — we can populate this with live metrics later.
        </div>

        <div className="order-2 md:col-span-7 md:order-1 space-y-8 md:pr-4">
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
                <a className="rounded-full bg-foreground/10 px-3 py-1 hover:text-foreground" href={`tel:${profile.metadata.phone}`}>
                  {profile.metadata.phone}
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

      <div className="h-16 md:h-24" aria-hidden="true" />

      {profile ? (
        <div className="space-y-4 pt-8" id="skills">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">Keep scrolling</p>
            <h2 className="text-xl font-semibold text-foreground">Skills & Tools</h2>
            <p className="text-sm text-foreground/70">Icon grid sits just below the fold so it’s discoverable.</p>
          </div>
          <SkillIconGrid items={skillIcons} />
        </div>
      ) : null}
    </section>
  );
}

export default Home;