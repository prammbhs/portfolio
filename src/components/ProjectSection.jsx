import { useEffect, useState, useRef } from "react";
import { useProjects } from "../hooks/useProjects";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { getImgixSrcSet, getImgixUrl } from "../lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

function ProjectCard({ project, isActive }) {
  const meta = project.metadata || {};
  const techStack = Array.isArray(meta.tech_stack) ? meta.tech_stack : [];
  const valueProp = meta.value_prop || meta.tagline || meta.description?.split(".")[0] || "Project impact summary";
  const galleryImages = Array.isArray(meta.gallery)
    ? meta.gallery.map((item) => item?.imgix_url || item?.url).filter(Boolean)
    : [];
  const featuredImage = meta.featured_image?.imgix_url || meta.featured_image?.url || galleryImages[0];
  const images = featuredImage ? [featuredImage, ...galleryImages.filter((url) => url !== featuredImage)] : galleryImages;
  
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => { setImageIndex(0); }, [project.slug]);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const intervalId = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <Card
      className={`relative h-full w-full overflow-hidden border-foreground/10 bg-card/80 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isActive ? "scale-100 opacity-100 shadow-2xl" : "scale-[0.85] opacity-30 shadow-none pointer-events-none"
      } rounded-[2rem] flex flex-col`}
    >
      <CardHeader className="space-y-3 pb-6 border-b border-foreground/5 bg-foreground/[0.02] px-8 pt-8">
        <CardTitle className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{meta.project_name || project.title}</CardTitle>
        <CardDescription className="text-lg font-medium text-foreground/70 line-clamp-2">
          {valueProp}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row gap-8 lg:items-start p-8 grow">
        <div className="flex flex-col space-y-6 lg:w-[40%] h-full">
          <p className="text-sm text-foreground/80 leading-relaxed font-medium line-clamp-5">{meta.description}</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-foreground/10 hover:bg-foreground/20 text-foreground/80 font-semibold">{tech}</Badge>
            ))}
          </div>
          <Separator className="bg-foreground/10" />
          <div className="flex flex-wrap gap-4 mt-auto pt-4">
            {meta.live_url && (
              <a className={buttonVariants({ variant: "default" }) + " rounded-full px-8 py-6 text-sm transition hover:scale-105 shadow-md flex-1 text-center font-bold"} href={meta.live_url} target="_blank" rel="noreferrer">
                Live Preview
              </a>
            )}
            {meta.github_url && (
              <a className={buttonVariants({ variant: "outline" }) + " rounded-full px-8 py-6 text-sm transition hover:scale-105 bg-background border-foreground/20 shadow-sm hover:bg-foreground/5 flex-1 text-center font-bold"} href={meta.github_url} target="_blank" rel="noreferrer">
                Source Code
              </a>
            )}
          </div>
        </div>

        <div className="flex h-full w-full items-center justify-center lg:w-[60%] lg:h-auto min-h-[300px]">
          {images.length ? (
            <div className="group relative w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 h-full flex items-center shadow-inner">
              <img
                src={getImgixUrl(images[imageIndex], { w: 1200, q: 60 })}
                srcSet={getImgixSrcSet(images[imageIndex], [480, 768, 1024, 1280, 1600], { q: 60 })}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={meta.project_name || project.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover sm:object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          ) : (
             <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/5 text-sm font-semibold text-foreground/40">
                Image Placeholder
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectSection() {
  const { projects, isLoading, isError, error } = useProjects();
  const [carouselApi, setCarouselApi] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const autoRotateMs = 5000;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!carouselApi || !projects.length) return undefined;
    const handleSelect = () => setActiveIndex(carouselApi.selectedScrollSnap());
    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);
    handleSelect();
    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi, projects.length]);

  useEffect(() => {
    if (!carouselApi || isPaused || projects.length <= 1 || !isInView) return undefined;
    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, autoRotateMs);
    return () => clearInterval(intervalId);
  }, [carouselApi, isPaused, projects.length, isInView]);

  if (isLoading) {
    return (
      <section id="projects" className="py-16 md:py-24 mx-auto max-w-6xl px-4 text-center">
        <p className="text-sm text-foreground/70">Loading projects...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="projects" className="py-16 md:py-24 mx-auto max-w-6xl px-4 text-center">
        <p className="text-sm text-red-500">{error?.message || "Failed to load projects."}</p>
      </section>
    );
  }

  if (!projects.length) return null;

  return (
    <section id="projects" ref={sectionRef} className="py-16 md:py-24 space-y-10 overflow-hidden relative">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Featured Projects</h2>
        <p className="mt-4 text-base font-medium text-foreground/60 max-w-2xl mx-auto">
          These are my recent projects
        </p>
      </div>

      <div 
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <Carousel
          className="w-full"
          setApi={setCarouselApi}
          opts={{ align: "center", loop: true, skipSnaps: false }}
          plugins={[WheelGesturesPlugin()]}
        >
          <CarouselContent className="items-stretch py-4">
            {projects.map((project, index) => (
              <CarouselItem key={project.slug} className="basis-[92%] sm:basis-[85%] md:basis-[75%] lg:basis-[70%] xl:basis-[60%] pl-4 sm:pl-6 lg:pl-10">
                <div className="h-full flex px-1 pb-4 pt-2">
                  <ProjectCard project={project} isActive={index === activeIndex} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {projects.length > 1 && (
          <div className="mt-6 flex justify-center w-full px-4">
            <div className="inline-flex items-center gap-4 rounded-full border border-foreground/10 bg-foreground/5 px-6 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl dark:bg-black/40">
              <div className="flex items-center gap-2.5">
                {projects.map((_, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={index}
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => carouselApi?.scrollTo(index)}
                      className={`h-2.5 rounded-full transition-all duration-500 hover:bg-foreground ${
                        isActive ? "w-10 bg-foreground shadow-sm" : "w-2.5 bg-foreground/30 hover:bg-foreground/50"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="h-5 w-px bg-foreground/20 mx-1" />
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="group flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-all hover:bg-foreground hover:text-background hover:scale-110 active:scale-95"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 ml-0.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectSection;
