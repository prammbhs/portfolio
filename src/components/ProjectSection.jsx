import { useEffect, useRef, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { getImgixSrcSet, getImgixUrl } from "../lib/utils";

function ProjectCard({ project, isVisible, variant = "stack" }) {
  const meta = project.metadata || {};
  const techStack = Array.isArray(meta.tech_stack) ? meta.tech_stack : [];
  const valueProp = meta.value_prop || meta.tagline || meta.description?.split(".")[0] || "Project impact summary";
  const galleryImages = Array.isArray(meta.gallery)
    ? meta.gallery.map((item) => item?.imgix_url || item?.url).filter(Boolean)
    : [];
  const featuredImage = meta.featured_image?.imgix_url || meta.featured_image?.url || galleryImages[0];
  const images = featuredImage ? [featuredImage, ...galleryImages.filter((url) => url !== featuredImage)] : galleryImages;
  const isStack = variant === "stack";
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrl = images[imageIndex];
  const imageSrc = getImgixUrl(imageUrl, { w: 1200, q: 60 });
  const imageSrcSet = getImgixSrcSet(imageUrl, [480, 768, 1024, 1280, 1600], { q: 60 });

  useEffect(() => {
    setImageIndex(0);
  }, [project.slug]);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const intervalId = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className={isStack ? "min-h-[85vh] py-6" : "py-6"}>
      <div className={`mx-auto flex ${isStack ? "min-h-[70vh]" : ""} max-w-5xl items-center px-4`}>
        <Card
          className={`w-full border-foreground/10 bg-card transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-semibold">{meta.project_name || project.title}</CardTitle>
            <CardDescription className="text-base text-foreground/70">
              {valueProp}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2 lg:flex lg:flex-row lg:items-start">
            <div className="space-y-4">
              <p className="text-sm text-foreground/80">{meta.description}</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
              <Separator />
              <div className="flex flex-wrap gap-3">
                {meta.live_url ? (
                  <a
                    className={buttonVariants({ variant: "outline" })}
                    href={meta.live_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live
                  </a>
                ) : null}
                {meta.github_url ? (
                  <a
                    className={buttonVariants({ variant: "outline" })}
                    href={meta.github_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-center">
              {images.length ? (
                <div className="group relative w-full overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5">
                  <div className="flex aspect-[16/9] items-center justify-center">
                    <img
                      src={imageSrc}
                      srcSet={imageSrcSet}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      alt={meta.project_name || project.title}
                      width="1280"
                      height="720"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5 text-sm text-foreground/60">
                  Featured image placeholder
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ProjectSection() {
  const { projects, isLoading, isError, error } = useProjects();
  const [visibleIds, setVisibleIds] = useState(() => new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef(null);
  const galleryRef = useRef(null);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const autoRotateMs = 5000;
  const resumeDelayMs = 6000;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const viewObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    viewObserver.observe(section);
    return () => viewObserver.disconnect();
  }, []);

  useEffect(() => {
    observerRef.current?.disconnect?.();
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.dataset.projectId);
          });
          return next;
        });
      },
      { threshold: 0.2 }
    );
    observerRef.current = observer;

    const nodes = document.querySelectorAll("[data-project-id]");
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [projects]);

  const mobileProjects = projects.slice(0, 2);
  const hasGallery = projects.length > 1;

  useEffect(() => {
    if (!hasGallery) return undefined;
    setActiveIndex(0);
    return undefined;
  }, [hasGallery, projects.length]);

  useEffect(() => {
    if (!hasGallery || isPaused || !isInView) return undefined;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, autoRotateMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [hasGallery, isPaused, isInView, projects.length]);

  useEffect(() => {
    if (!hasGallery || !isInView) return undefined;
    const container = galleryRef.current;
    if (!container) return undefined;
    const items = container.querySelectorAll("[data-gallery-item]");
    const target = items[activeIndex];
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    return undefined;
  }, [activeIndex, hasGallery, isInView, projects.length]);

  const handleUserInteract = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, resumeDelayMs);
  };

  if (isLoading) {
    return (
      <section id="projects" className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm text-foreground/70">Loading projects...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="projects" className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm text-red-500">{error?.message || "Failed to load projects."}</p>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} className="space-y-8">
      <div className="mx-auto max-w-5xl px-4 pt-10">
        <h2 className="text-3xl font-semibold text-foreground">Projects</h2>
        <p className="mt-2 text-sm text-foreground/70">
          These are my recent projects, curated to match the theme and highlight the work I’m most proud of.
        </p>
      </div>
      <div className="space-y-8 min-[772px]:hidden">
        {mobileProjects.map((project) => (
          <div key={project.slug} data-project-id={project.slug}>
            <ProjectCard project={project} isVisible={visibleIds.has(project.slug)} variant="stack" />
          </div>
        ))}
      </div>
      <div className="hidden min-[772px]:block">
        <div
          ref={galleryRef}
          className="flex overflow-x-auto pb-4 pl-0 pr-0 snap-x snap-mandatory scroll-smooth scrollbar-hidden"
          onMouseEnter={handleUserInteract}
          onClick={handleUserInteract}
        >
          {projects.map((project, index) => (
            <div
              key={project.slug}
              data-project-id={project.slug}
              data-gallery-item
              className={`min-w-full snap-center px-4 transition-transform duration-500 ${
                index === activeIndex ? "scale-100 opacity-100" : "scale-[0.98] opacity-70"
              }`}
            >
              <div className="mx-auto max-w-5xl">
                <ProjectCard project={project} isVisible={visibleIds.has(project.slug)} variant="inline" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectSection;
