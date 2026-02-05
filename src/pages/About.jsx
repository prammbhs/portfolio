import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SkillIconGrid from "../components/SkillIconGrid";
import { fetchAbout, fetchProfile } from "../lib/cosmicClient";

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
    const items = about?.metadata?.aboutme?.aboutMe;
    return Array.isArray(items) && items.length ? items : null;
  }, [about]);

  return (
    <section id="about" className="mx-auto max-w-5xl px-4 py-16 space-y-8">
      <div className="space-y-3 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">About</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">A bit about me</h2>
        {aboutParagraphs ? (
          <div className="space-y-4 text-base leading-relaxed text-foreground/80">
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
    </section>
  );
}

export default About;
