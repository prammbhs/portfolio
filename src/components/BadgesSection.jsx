import { useBadges } from "../hooks/useBadges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  siCisco,
  siGeeksforgeeks,
  siCoursera,
  siFreecodecamp,
  siGoogle,
  siHackerrank,
  siLeetcode,
  siUdemy,
} from "simple-icons";


function renderPlatformLogo(platform, className = "h-8 w-8") {
  if (!platform) return null;
  const key = platform.toLowerCase();
  const iconMap = {
    hackerrank: siHackerrank,
    leetcode: siLeetcode,
    "Geek for geeks": siGeeksforgeeks,
    "geeksforgeeks": siGeeksforgeeks,
    "freecodecamp": siFreecodecamp,
    "free code camp": siFreecodecamp,
    google: siGoogle,
    coursera: siCoursera,
    udemy: siUdemy,
    cisco: siCisco,
  };
  const icon = iconMap[key] || iconMap[key.replace(/\s+/g, "")];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}

function CmsBadgeCard({ badge }) {
  const meta = badge.metadata || {};
  const title = meta.badge_name || badge.title;
  const platform = meta.issuing_platform;
  const date = meta.earned_date;
  const imageUrl = meta.badge_image?.imgix_url;
  const rating = meta.star_rating || meta.rating || "--";
  const href = meta.badge_url;
  const Wrapper = href ? "a" : "div";

  return (
    <Card className="group border-foreground/10 bg-card shadow-sm dark:bg-[#212529]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">{title}</CardTitle>
        <CardDescription className="text-xs text-foreground/60 min-h-[1rem]">
          {platform || ""}
        </CardDescription>
        <CardDescription className="text-xs text-foreground/50 min-h-[1rem]">
          {date || ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Wrapper
          {...(href
            ? {
                href,
                target: "_blank",
                rel: "noreferrer",
              }
            : {})}
          className="relative flex flex-col gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-3 text-left transition hover:border-foreground/30"
        >
                    <div className="pointer-events-none absolute left-1/2 top-0 z-10 w-56 -translate-x-1/2 -translate-y-[115%] rounded-2xl border border-foreground/10 bg-background/95 p-6 opacity-0 shadow-2xl transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex items-center justify-center">
                        {imageUrl ? (
                          <img src={imageUrl} alt={title} className="h-28 w-28 object-contain" loading="lazy" />
                        ) : (
                          renderPlatformLogo(platform, "h-28 w-28") || <span className="text-xs text-foreground/60">Logo</span>
                        )}
                      </div>
                    </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="h-8 w-8 object-contain" loading="lazy" />
              ) : (
                renderPlatformLogo(platform) || <span className="text-xs text-foreground/60">Logo</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-foreground/60">{platform || "Issued brand"}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/70 min-h-[1.25rem]">
            <span>Star rating</span>
            <span className="font-semibold text-foreground">{rating}</span>
          </div>
          <p className="text-xs text-foreground/60 min-h-[1rem]">
            {platform ? `Verified on ${platform}` : ""}
          </p>
        </Wrapper>
      </CardContent>
    </Card>
  );
}

function CardBadge({ badge }) {
  const href = badge.url;
  const Wrapper = href ? "a" : "div";
  return (
    <Card className="group border-foreground/10 bg-card shadow-sm dark:bg-[#212529]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">{badge.name}</CardTitle>
        <CardDescription className="text-xs text-foreground/60 capitalize min-h-[1rem]">
          {badge.platform || ""}
        </CardDescription>
        <CardDescription className="text-xs text-amber-500 min-h-[1rem]">
          {badge.stars ? `${badge.stars}★` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Wrapper
          {...(href
            ? {
                href,
                target: "_blank",
                rel: "noreferrer",
              }
            : {})}
          className="relative flex flex-col gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-3 text-left transition hover:border-foreground/30"
        >
                    <div className="pointer-events-none absolute left-1/2 top-0 z-10 w-56 -translate-x-1/2 -translate-y-[115%] rounded-2xl border border-foreground/10 bg-background/95 p-6 opacity-0 shadow-2xl transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex items-center justify-center">
                        {badge.icon ? (
                          <img src={badge.icon} alt={badge.name} className="h-28 w-28 object-contain" loading="lazy" />
                        ) : (
                          renderPlatformLogo(badge.platform, "h-28 w-28") || <span className="text-xs text-foreground/60">Logo</span>
                        )}
                      </div>
                    </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
              {badge.icon ? (
                <img src={badge.icon} alt={badge.name} className="h-8 w-8 object-contain" loading="lazy" />
              ) : (
                renderPlatformLogo(badge.platform) || <span className="text-xs text-foreground/60">Logo</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{badge.name}</p>
              <p className="text-xs text-foreground/60 capitalize">{badge.platform}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/70 min-h-[1.25rem]">
            <span>Star rating</span>
            <span className="font-semibold text-foreground">{badge.stars ?? "--"}</span>
          </div>
          <p className="text-xs text-foreground/60 min-h-[1rem]">
            {badge.platform ? `Verified on ${badge.platform}` : ""}
          </p>
        </Wrapper>
      </CardContent>
    </Card>
  );
}

function BadgesSection() {
  const { cmsBadges, cardBadges, isLoading, isError, error } = useBadges();

  if (isLoading) {
    return (
      <section id="badges" className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-foreground/70">Loading badges...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="badges" className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm text-red-500">{error?.message || "Failed to load badges."}</p>
      </section>
    );
  }

  return (
    <section id="badges" className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">Badges</h2>
        <p className="text-sm text-foreground/70">
          CMS badges first, followed by platform badges from the profile card.
        </p>
      </div>

      <div className="md:hidden">
        <Carousel className="relative" opts={{ align: "start", loop: true }}>
          <CarouselContent className="cursor-grab active:cursor-grabbing">
            {cmsBadges.map((badge) => (
              <CarouselItem key={badge.slug} className="basis-full">
                <CmsBadgeCard badge={badge} />
              </CarouselItem>
            ))}
            {cardBadges.map((badge) => (
              <CarouselItem key={badge.id} className="basis-full">
                <CardBadge badge={badge} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cmsBadges.map((badge) => (
          <CmsBadgeCard key={badge.slug} badge={badge} />
        ))}
        {cardBadges.map((badge) => (
          <CardBadge key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  );
}

export default BadgesSection;
