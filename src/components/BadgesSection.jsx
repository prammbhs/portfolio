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
import { getImgixSrcSet, getImgixUrl } from "../lib/utils";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

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

function CommonBadgeCard({ title, platform, date, imageUrl, rating, href, tags = [] }) {
  const largeBadgeSrc = getImgixUrl(imageUrl, { w: 400, q: 75 });
  const largeBadgeSrcSet = getImgixSrcSet(imageUrl, [200, 400, 600], { q: 75 });
  const Wrapper = href ? "a" : "div";

  return (
    <Card className="group flex flex-col h-full border-foreground/10 bg-card shadow-sm transition hover:shadow-md dark:bg-[#212529] overflow-hidden">
      <Wrapper
        {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 transition-colors hover:bg-foreground/5 dark:hover:bg-white/5"
      >
        <div className="relative flex h-48 w-full items-center justify-center bg-foreground/5 p-6 dark:bg-black/20 border-b border-foreground/5">
          {imageUrl ? (
            <img
              src={largeBadgeSrc}
              srcSet={largeBadgeSrcSet}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              alt={title || "Badge Image"}
              className="h-full w-full object-contain drop-shadow-md transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center opacity-50">
              {renderPlatformLogo(platform, "h-16 w-16 mb-2")}
              <span className="text-xs font-semibold uppercase tracking-wider">{platform || "Badge"}</span>
            </div>
          )}
        </div>
        <CardContent className="flex grow flex-col p-5">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-foreground transition group-hover:text-amber-500">
              {title}
            </h3>
            <p className="text-sm font-medium text-foreground/60">{platform || "Unknown Issuer"}</p>
          </div>
          
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-foreground/80 w-full opacity-0 transition-all duration-300 group-hover:opacity-100">
            {date && (
              <div className="flex justify-between items-center border-b border-foreground/5 pb-1.5">
                <span className="text-foreground/60 font-medium">Issued</span>
                <span className="font-semibold text-foreground">{date}</span>
              </div>
            )}
            {tags && tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <span key={idx} className="rounded-md bg-foreground/10 px-2 py-0.5 text-xs font-semibold text-foreground/80 uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {href && (
              <div className="mt-2 text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 transition hover:text-emerald-400">
                  View Credential &rarr;
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Wrapper>
    </Card>
  );
}

function CmsBadgeCard({ badge }) {
  const meta = badge.metadata || {};
  const title = meta.badge_name || badge.title;
  const platform = meta.issuing_platform;
  const date = meta.earned_date;
  const imageUrl = meta.badge_image?.imgix_url || meta.badge_image?.url;
  const rating = meta.star_rating || meta.rating || "--";
  const href = meta.badge_url;
  const tags = meta.tags || badge.tags || [];

  return (
    <CommonBadgeCard
      title={title}
      platform={platform}
      date={date}
      imageUrl={imageUrl}
      rating={rating}
      href={href}
      tags={tags}
    />
  );
}

function CardBadge({ badge }) {
  return (
    <CommonBadgeCard
      title={badge.name}
      platform={badge.platform}
      date={badge.date}
      imageUrl={badge.icon}
      rating={badge.stars || "--"}
      href={badge.url}
      tags={badge.tags || []}
    />
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
          Here are some badges I've earned from various platforms.
        </p>
      </div>

      <Carousel
        className="relative"
        opts={{ align: "start", loop: true, skipSnaps: false }}
        plugins={[WheelGesturesPlugin()]}
      >
        <CarouselContent className="cursor-grab active:cursor-grabbing pb-4 pt-1">
          {cmsBadges.map((badge) => (
            <CarouselItem key={badge.slug} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
              <div className="h-full mb-2">
                <CmsBadgeCard badge={badge} />
              </div>
            </CarouselItem>
          ))}
          {cardBadges.map((badge) => (
            <CarouselItem key={badge.id} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
              <div className="h-full mb-2">
                <CardBadge badge={badge} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="-left-4 sm:-left-6 lg:-left-8" />
          <CarouselNext className="-right-4 sm:-right-6 lg:-right-8" />
        </div>
      </Carousel>
    </section>
  );
}

export default BadgesSection;
