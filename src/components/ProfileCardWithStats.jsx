function StatBlock({ label, value, accent }) {
  return (
    <div className="min-w-0 rounded-xl border border-foreground/10 bg-foreground/5 p-4 shadow-inner dark:border-white/10 dark:bg-black/50">
      <div className={`text-base font-semibold ${accent}`}>{label}</div>
      <div className="mt-2 h-px w-full bg-foreground/10" />
      <div className="mt-3 text-4xl font-extrabold text-foreground sm:text-5xl">{value ?? "--"}</div>
    </div>
  );
}

function ProfilePanel({
  name,
  handle,
  statLeft,
  statRight,
  tags = [],
  linkLabel,
  linkUrl,
}) {
  const initial = name?.[0]?.toUpperCase?.() || "P";
  const hasLink = Boolean(linkUrl);
  return (
    <div className="relative w-full max-w-md md:max-w-lg overflow-hidden rounded-3xl border border-foreground/12 bg-gradient-to-br from-white via-slate-100 to-white p-6 text-foreground shadow-2xl sm:p-7 md:p-8 dark:from-neutral-950 dark:via-slate-950 dark:to-black">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 32%)," +
            "radial-gradient(circle at 80% 20%, rgba(45,212,191,0.12), transparent 30%)," +
            "radial-gradient(circle at 50% 80%, rgba(59,130,246,0.15), transparent 28%)",
        }}
      />

      <div className="flex items-center justify-between text-sm font-semibold tracking-wide text-foreground/70">
        <span className="text-xs uppercase tracking-[0.3em] text-foreground/60">Card</span>
        <button
          type="button"
          onClick={hasLink ? () => window.open(linkUrl, "_blank", "noopener,noreferrer") : undefined}
          disabled={!hasLink}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
            hasLink
              ? "border-foreground/20 text-foreground/80 hover:border-foreground/40 hover:text-foreground"
              : "cursor-not-allowed border-foreground/10 text-foreground/40"
          }`}
        >
          {linkLabel}
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <div className="relative">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-orange-200 bg-gradient-to-br from-purple-600 to-purple-500 text-6xl font-black text-white shadow-2xl" aria-hidden>
            {initial}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">{name}</h2>
          {handle ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 text-sm font-semibold text-foreground/80 dark:bg-neutral-800">
              <span>@{handle}</span>
              <span className="text-emerald-400">●</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-4 shadow-inner sm:grid-cols-2 dark:bg-neutral-900/60">
        <StatBlock label={statLeft.label} value={statLeft.value} accent={statLeft.accent} />
        <StatBlock label={statRight.label} value={statRight.value} accent={statRight.accent} />
      </div>

      <div className="mt-5 space-y-2 rounded-2xl border border-foreground/10 bg-foreground/5 p-4 shadow-inner dark:bg-neutral-900/70">
        <div className="text-sm font-semibold text-foreground/70">You can find me on</div>
        {hasLink ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-2 text-sm font-semibold text-foreground/85 transition hover:border hover:border-foreground/20 hover:bg-foreground/15 hover:text-foreground dark:bg-neutral-800"
          >
            <span className="text-lg">🌐</span>
            <span>{handle || "profile"}</span>
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-2 text-sm font-semibold text-foreground/85 dark:bg-neutral-800">
            <span className="text-lg">🌐</span>
            <span>{handle || "profile"}</span>
          </div>
        )}
      </div>

      {tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 p-3 dark:bg-neutral-900/60">
          {tags.slice(0, 8).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80 dark:bg-neutral-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProfileCardWithStats({
  name,
  view,
  setView,
  dsaTotals,
  dsaHandle,
  dsaActive,
  dsaContrib,
  devHandle,
  devActive,
  devContrib,
  contactLabel,
  contactUrl,
  tags,
}) {
  const isDsa = view === "dsa";
  const statLeft = isDsa
    ? { label: "Active Days", value: dsaActive ?? "--", accent: "text-emerald-300" }
    : { label: "Active Days", value: devActive ?? "--", accent: "text-emerald-300" };
  const statRight = isDsa
    ? { label: "Contributions", value: dsaContrib ?? dsaTotals?.total ?? "--", accent: "text-orange-300" }
    : { label: "Contributions", value: devContrib ?? "--", accent: "text-orange-300" };

  return (
    <div className="relative order-1 space-y-4 md:order-2 md:col-span-5 md:self-start md:-mt-6 w-full flex flex-col items-center">
      <ProfilePanel
        name={name}
        handle={isDsa ? dsaHandle : devHandle}
        statLeft={statLeft}
        statRight={statRight}
        tags={tags}
        linkLabel={contactLabel}
        linkUrl={contactUrl}
      />

      <div className="flex w-full max-w-md md:max-w-lg gap-3">
        <button
          type="button"
          onClick={() => setView("dsa")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            isDsa
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 bg-foreground/5 text-foreground/80 hover:border-foreground/40"
          }`}
        >
          DSA Stats
        </button>
        <button
          type="button"
          onClick={() => setView("dev")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            !isDsa
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 bg-foreground/5 text-foreground/80 hover:border-foreground/40"
          }`}
        >
          Dev Stats
        </button>
      </div>
    </div>
  );
}

export default ProfileCardWithStats;
