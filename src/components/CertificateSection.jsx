import { useEffect, useRef, useState } from "react";
import { useCertificates } from "../hooks/useCertificates";
import { SquareMousePointer } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const BREAKPOINTS = [
  { min: 1400, count: 5 },
  { min: 1200, count: 4 },
  { min: 992, count: 3 },
  { min: 768, count: 2 },
];

function useVisibleCount(defaultCount = 1) {
  const [count, setCount] = useState(defaultCount);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const next = BREAKPOINTS.find((bp) => width >= bp.min)?.count || 1;
      setCount(next);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;
  const meta = certificate.metadata || {};
  const imageUrl = meta.certificate_image?.imgix_url || meta.certificate_image?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close certificate preview"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur"
      />
      <div className="relative z-10 w-full max-w-4xl rounded-2xl border border-foreground/10 bg-background p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-2 pb-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Certificate</p>
            <h3 className="text-lg font-semibold text-foreground">{meta.certificate_name || certificate.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-foreground/70 transition hover:text-foreground"
          >
            Close
          </button>
        </div>
        <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 p-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={meta.certificate_name || certificate.title}
              className="max-h-[65vh] w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center text-sm text-foreground/60">
              Certificate preview unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ certificate, onView, className = "", imageClassName = "" }) {
  const meta = certificate.metadata || {};
  const imageUrl = meta.certificate_image?.imgix_url || meta.certificate_image?.url;
  const title = meta.certificate_name || certificate.title;
  const org = meta.issuing_organization;
  const date = meta.issue_date;

  return (
    <Card className={`w-full border-foreground/10 bg-card shadow-sm dark:bg-[#212529] ${className}`}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-base font-semibold text-foreground line-clamp-2">{title}</CardTitle>
        {org ? <CardDescription className="text-xs text-foreground/60">{org}</CardDescription> : null}
        {date ? <CardDescription className="text-xs text-foreground/50">{date}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`flex items-center justify-center overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 ${imageClassName}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <span className="text-xs text-foreground/60">No image</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onView}
            className={buttonVariants({ variant: "default", size: "sm" }) + " w-full rounded-full"}
          >
            View
          </button>
          {meta.certificate_pdf?.url ? (
            <a
              className={buttonVariants({ variant: "default", size: "sm" }) + " w-full rounded-full"}
              href={meta.certificate_pdf.url}
              target="_blank"
              rel="noreferrer"
              download
            >
              Download
            </a>
          ) : null}
          {meta.credential_url ? (
            <a
              className={buttonVariants({ variant: "default", size: "sm" }) + " col-span-2 w-full rounded-full justify-between"}
              href={meta.credential_url}
              target="_blank"
              rel="noreferrer"
            >
              <span>Verify</span>
              <SquareMousePointer className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function CertificateSection() {
  const {
    certificates,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [carouselApi, setCarouselApi] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const visibleCount = useVisibleCount(1);

  useEffect(() => {
    if (!carouselApi || !certificates.length) return undefined;
    const handleSelect = () => {
      if (!hasNextPage) return;
      const lastIndex = certificates.length - 1;
      const slidesInView = carouselApi.slidesInView();
      const maxVisible = Math.max(...slidesInView);
      if (maxVisible >= lastIndex - 1) {
        fetchNextPage();
      }
    };
    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);
    handleSelect();
    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi, certificates.length, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (!carouselApi) return undefined;
    return undefined;
  }, [carouselApi]);

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
    if (!carouselApi || !isInView) return undefined;
    const intervalId = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);
    return () => window.clearInterval(intervalId);
  }, [carouselApi, isInView]);

  useEffect(() => {
    if (!isInView || !hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isInView]);

  const cardClassName =
    visibleCount === 1
      ? "w-[94vw] max-w-[720px]"
      : visibleCount === 2
        ? "max-w-[400px]"
        : visibleCount === 3
          ? "max-w-[360px]"
          : visibleCount === 4
            ? "max-w-[340px]"
            : "max-w-[320px]";

  const imageClassName =
    visibleCount === 1 ? "h-56 sm:h-64" : visibleCount === 2 ? "h-48" : "h-44";

  if (isLoading) {
    return (
      <section id="certificates" className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-sm text-foreground/70">Loading certificates...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="certificates" className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-sm text-red-500">{error?.message || "Failed to load certificates."}</p>
      </section>
    );
  }

  return (
    <section id="certificates" ref={sectionRef} className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">Certificates</h2>
        <p className="text-sm text-foreground/70">
          Recent certifications presented in a responsive carousel — tap any card to explore details.
        </p>
      </div>
      <Carousel
        className="relative"
        setApi={setCarouselApi}
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="cursor-auto">
          {certificates.map((certificate) => (
            <CarouselItem
              key={certificate.slug}
              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
            >
              <div className="flex h-full justify-center">
                <CertificateCard
                  certificate={certificate}
                  onView={() => setSelectedCertificate(certificate)}
                  className={cardClassName}
                  imageClassName={imageClassName}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {selectedCertificate ? (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      ) : null}
    </section>
  );
}

export default CertificateSection;
