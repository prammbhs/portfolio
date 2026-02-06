import { createContext, useCallback, useContext, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../../lib/utils";

function ChevronLeftIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M15 6L9 12l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CarouselContext = createContext(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used within Carousel");
  }
  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  plugins,
  setApi,
  className,
  children,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: orientation === "horizontal" ? "x" : "y",
      ...opts,
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setApi?.(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        emblaRef,
        emblaApi,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }) {
  const { emblaRef, orientation } = useCarousel();
  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
}

function CarouselPrevious({ className, ...props }) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type="button"
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/80 text-foreground shadow-sm transition hover:bg-background",
        className
      )}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeftIcon className="h-5 w-5" />
    </button>
  );
}

function CarouselNext({ className, ...props }) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type="button"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/80 text-foreground shadow-sm transition hover:bg-background",
        className
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRightIcon className="h-5 w-5" />
    </button>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
