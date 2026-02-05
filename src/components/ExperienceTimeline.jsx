function ExperienceTimeline({ items = [] }) {
  if (!items.length) return null;

  return (
    <section id="experience" className="space-y-6">
      <div className="relative">
        <div className="absolute left-1/2 top-2 hidden h-full w-px -translate-x-1/2 bg-foreground/15 md:block" />
        <div className="space-y-10">
          {items.map((item, index) => {
            const meta = item.metadata || {};
            const isLeft = index % 2 === 0;
            const dates = [meta.start_date, meta.end_date].filter(Boolean).join(" - ");
            const additional = meta.additional_info;

            return (
              <div key={item.slug || index} className="relative md:grid md:grid-cols-2 md:gap-10">
                <div className={`md:col-span-1 ${isLeft ? "md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}`}>
                  <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-5 shadow-sm dark:bg-[#212529]">
                    <p className="text-sm font-semibold text-foreground">{meta.title || item.title}</p>
                    {meta.organization ? (
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">
                        {meta.organization}
                      </p>
                    ) : null}
                    {dates ? <p className="mt-2 text-xs text-foreground/60">{dates}</p> : null}

                    {meta.description ? (
                      <p className="mt-3 text-sm text-foreground/80">{meta.description}</p>
                    ) : null}

                    {additional ? (
                      <p className="mt-3 text-xs font-semibold text-foreground/70">{additional}</p>
                    ) : null}
                  </div>
                </div>

                <div className="absolute left-1/2 top-6 hidden -translate-x-1/2 md:block">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-foreground bg-background">
                    <span className="h-2 w-2 rounded-full bg-foreground" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExperienceTimeline;
