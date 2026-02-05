import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ExperienceTimeline from "../components/ExperienceTimeline";
import SkillIconGrid from "../components/SkillIconGrid";
import { fetchAbout, fetchExperience, fetchProfile } from "../lib/cosmicClient";

function About() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: about } = useQuery({
    queryKey: ["about"],
    queryFn: () => fetchAbout(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: experienceItems } = useQuery({
    queryKey: ["experience"],
    queryFn: () => fetchExperience(),
    staleTime: 24 * 60 * 60 * 1000,
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

  const aboutParagraphs = useMemo(() => {
    const items = about?.metadata?.aboutme?.Paragraph;
    return Array.isArray(items) && items.length ? items : null;
  }, [about]);

  const filteredExperienceItems = useMemo(() => {
    const items = (experienceItems || []).filter((item) => item?.type === "experience");
    const monthMap = {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      sept: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11,
    };
    const parseMonthYear = (value) => {
      if (!value) return 0;
      const parts = value.toLowerCase().replace(/[,]/g, "").split(/\s+/).filter(Boolean);
      const year = Number(parts.find((p) => /^\d{4}$/.test(p))) || 0;
      const monthToken = parts.find((p) => monthMap[p] !== undefined);
      const month = monthToken ? monthMap[monthToken] : 0;
      return new Date(year, month, 1).getTime();
    };
    return items.sort((a, b) => {
      const aDate = parseMonthYear(a?.metadata?.start_date);
      const bDate = parseMonthYear(b?.metadata?.start_date);
      return bDate - aDate;
    });
  }, [experienceItems]);

  return (
    <section id="about" className="mx-auto max-w-5xl px-4 py-16 space-y-8">
      <div className="space-y-3 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">About</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">A bit about me</h2>
        {aboutParagraphs ? (
          <div className="space-y-0 text-base leading-relaxed text-foreground/80">
            {aboutParagraphs.map((text, index) => (
              <p key={`${index}-${text.slice(0, 12)}`}>{text}</p>
            ))}
          </div>
        ) : (
          <p className="text-base leading-relaxed text-foreground/80">
            {profile?.metadata?.bio || "Frontend developer crafting calm, intentional web experiences."}
          </p>
        )}
      </div>

      <div className="space-y-4" id="skills">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">Skills & Tools</p>
          <h3 className="text-xl font-semibold text-foreground">Stack I work with</h3>
          <p className="text-sm text-foreground/70">A quick snapshot of the technologies I use day to day.</p>
        </div>
        <SkillIconGrid items={skillIcons} />
      </div>

      {filteredExperienceItems.length ? (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">Experience & Education</p>
            <h3 className="text-2xl font-semibold text-foreground">Experience & Education</h3>
          </div>
          <ExperienceTimeline items={filteredExperienceItems} />
        </div>
      ) : null}
    </section>
  );
}

export default About;
