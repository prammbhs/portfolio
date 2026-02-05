import { useCallback, useEffect, useRef, useState } from "react";
import { SquareMousePointer } from "lucide-react";
import {
  siLeetcode,
  siGithub,
  siGeeksforgeeks,
  siHackerrank,
  siCodeforces,
} from "simple-icons/icons";

const UI = {
  colors: {
    badgeLabel: "text-foreground",
    badgeArrow: "text-foreground",
    profileArrow: "text-current",
    statGreen: "text-foreground",
    statOrange: "text-foreground",
  },
  classes: {
    profileButton:
      "inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/40 focus:ring-offset-background dark:bg-white dark:text-black",
  },
  transitionDelayMs: 2000,
};

function StatBlock({ label, value, accent, breakdown, onClick, showBreakdown = true, transitionsDisabled }) {
  const clickable = Boolean(onClick);
  const Wrapper = clickable ? "button" : "div";
  const labelClass = clickable ? UI.colors.badgeLabel : accent;
  const hoverExtras = transitionsDisabled ? "" : "hover:-translate-y-0.5 hover:shadow-lg hover:border-foreground/60";
  const arrowIcon = clickable ? (
    <SquareMousePointer className={`h-4 w-4 ${UI.colors.badgeArrow}`} aria-hidden />
  ) : null;
  return (
    <Wrapper
      type={clickable ? "button" : undefined}
      onClick={onClick}
      className={`min-w-0 w-full rounded-xl border border-foreground/10 bg-foreground/5 p-4 shadow-inner text-left dark:border-white/10 dark:bg-black/50 ${
        clickable
          ? `cursor-pointer border-foreground/30 bg-foreground/5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${hoverExtras} ${
              transitionsDisabled ? "" : "transition"
            }`
          : ""
      }`}
      style={transitionsDisabled ? { transition: "none", transform: "none" } : undefined}
    >
      <div className={`text-base font-semibold flex items-center gap-2 ${labelClass}`}>
        <span>{label}</span>
        {arrowIcon}
      </div>
      <div className="mt-2 h-px w-full bg-foreground/10" />
      <div className="mt-3 text-4xl font-extrabold text-foreground sm:text-5xl text-center">{value ?? "--"}</div>
      {showBreakdown && breakdown ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-foreground/70">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${item.dot}`} aria-hidden />
              <span>{item.label}</span>
              <span className="text-foreground font-bold text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </Wrapper>
  );
}

function ProfilePanel({
  name,
  handle,
  statLeft,
  statRight,
  tags = [],
  linkUrl,
  platformProfiles = [],
  badges = [],
  isDsa,
  devProfile,
  showProfilePopup,
  setShowProfilePopup,
  showBadgesPopup,
  setShowBadgesPopup,
  onUserInteract,
}) {
  const [transitionsDisabled, setTransitionsDisabled] = useState(false);
  const transitionResetTimer = useRef();
  const initial = name?.[0]?.toUpperCase?.() || "P";

  const renderPlatformIcon = useCallback((key, className = "h-6 w-6") => {
    const icons = {
      leetcode: siLeetcode,
      github: siGithub,
      geeksforgeeks: siGeeksforgeeks,
      hackerrank: siHackerrank,
      codeforces: siCodeforces,
    };
    const icon = icons[key];
    if (!icon) {
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9Zm0 2c1.16 0 2.24.32 3.17.87l-1.67 1.67A5 5 0 0 0 7.9 12H5.05A7.01 7.01 0 0 1 12 5Zm-3 7a3 3 0 0 1 4.9-2.3l-2.6 2.6H9Zm6.1-1H18.9A7.01 7.01 0 0 1 12 19c-1.16 0-2.24-.32-3.17-.87l1.67-1.67A5 5 0 0 0 16.1 12ZM5.1 14h2.02a7 7 0 0 0 .48 1.36l-1.43 1.43A7 7 0 0 1 5.1 14Zm11.78 0a5 5 0 0 1-4.38 3.9l2.6-2.6h1.78ZM10 9.12 12.88 6.2A7.03 7.03 0 0 1 18.9 10h-2.02a7 7 0 0 0-.48-1.36l1.43-1.43A7 7 0 0 1 18.9 10Z" fill="currentColor" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path fill="currentColor" d={icon.path} />
      </svg>
    );
  }, []);

  const getPlatformUrl = useCallback((platform, handleValue) => {
    if (!handleValue) return null;
    switch (platform) {
      case "leetcode":
        return `https://leetcode.com/${handleValue}/`;
      case "geeksforgeeks":
        return `https://auth.geeksforgeeks.org/user/${handleValue}/`;
      case "hackerrank":
        return `https://www.hackerrank.com/profile/${handleValue}`;
      case "codeforces":
        return `https://codeforces.com/profile/${handleValue}`;
      default:
        return null;
    }
  }, []);

  const currentProfiles = isDsa
    ? platformProfiles
    : (() => {
        const devHandleValue = devProfile?.handle || handle;
        const totalContributions = devProfile?.contributions ?? statRight?.value;
        const profileUrl = devProfile?.url || linkUrl;
        return devHandleValue || profileUrl
          ? [{
              platform: "github",
              userStats: { handle: devHandleValue },
              totalQuestionStats: { totalQuestionCounts: totalContributions },
              url: profileUrl,
            }]
          : [];
      })();

  const startDisableTransitions = useCallback(() => {
    if (transitionResetTimer.current) clearTimeout(transitionResetTimer.current);
    setTransitionsDisabled(true);
  }, []);

  const allowTransitionsLater = useCallback(() => {
    if (transitionResetTimer.current) clearTimeout(transitionResetTimer.current);
    transitionResetTimer.current = setTimeout(() => setTransitionsDisabled(false), UI.transitionDelayMs);
  }, []);

  const isAnyPopupOpen = showProfilePopup || showBadgesPopup;

  const openPlatformPopup = useCallback(() => {
    if (currentProfiles?.length) {
      onUserInteract?.();
      startDisableTransitions();
      setShowProfilePopup(true);
    }
  }, [currentProfiles, onUserInteract, startDisableTransitions, setShowProfilePopup]);

  const closePlatformPopup = useCallback(() => {
    setShowProfilePopup(false);
    allowTransitionsLater();
  }, [allowTransitionsLater]);

  const openBadgesPopup = useCallback(() => {
    if (badges?.length) {
      onUserInteract?.();
      startDisableTransitions();
      setShowBadgesPopup(true);
    }
  }, [badges, onUserInteract, startDisableTransitions, setShowBadgesPopup]);

  const closeBadgesPopup = useCallback(() => {
    setShowBadgesPopup(false);
    allowTransitionsLater();
  }, [allowTransitionsLater]);

  useEffect(() => () => {
    if (transitionResetTimer.current) clearTimeout(transitionResetTimer.current);
  }, []);

  const transitionsLocked = transitionsDisabled || isAnyPopupOpen;

  const statRightForRender = isDsa
    ? { ...statRight, onClick: badges?.length ? openBadgesPopup : undefined }
    : statRight;

  return (
    <div
      className="relative w-full max-w-md min-[900px]:max-w-lg overflow-hidden rounded-3xl border border-foreground/12 bg-card p-6 text-foreground shadow-2xl sm:p-7 min-[900px]:p-8 dark:bg-[#212529]"
      style={transitionsLocked ? { transition: "none" } : undefined}
    >

      <div className="flex items-center justify-between text-sm font-semibold tracking-wide text-foreground/70">
        <span className="text-xs uppercase tracking-[0.3em] text-foreground/60">Card</span>
        
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <div className="relative">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-foreground/20 bg-white text-6xl font-black text-black shadow-2xl dark:bg-black dark:text-white" aria-hidden>
            {initial}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">{name}</h2>
          {handle ? (
            <button
              type="button"
              onClick={openPlatformPopup}
              aria-haspopup="dialog"
              aria-expanded={showProfilePopup}
              className={`${UI.classes.profileButton} ${
                transitionsLocked ? "" : "transition hover:-translate-y-0.5 hover:shadow-xl"
              }`}
              style={transitionsLocked ? { transition: "none", transform: "none" } : undefined}
            >
              <span>View platforms profile</span>
              <SquareMousePointer className={`h-4 w-4 ${UI.colors.profileArrow}`} aria-hidden />
              <span className="text-emerald-400">●</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-4 shadow-inner sm:grid-cols-2 dark:bg-neutral-900/60">
        <StatBlock
          label={statLeft.label}
          value={statLeft.value}
          accent={statLeft.accent}
          breakdown={statLeft.breakdown}
          showBreakdown={false}
          transitionsDisabled={transitionsLocked}
        />
        <StatBlock
          label={statRightForRender.label}
          value={statRightForRender.value}
          accent={statRightForRender.accent}
          breakdown={statRightForRender.breakdown}
          onClick={statRightForRender.onClick}
          transitionsDisabled={transitionsLocked}
        />
      </div>

      {isDsa && statLeft.breakdown ? (
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-foreground/80">
          {statLeft.breakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.dot}`} aria-hidden />
              <span>{item.label}</span>
              <span className="text-foreground font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      ) : null}

      {showProfilePopup ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <button
            type="button"
            aria-label="Close profile popup"
            onClick={closePlatformPopup}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white/95 p-6 text-left shadow-2xl ring-1 ring-foreground/10 dark:bg-neutral-900/95 dark:ring-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">Profiles</div>
                <div className="text-lg font-bold text-foreground">All platforms</div>
              </div>
              <button
                type="button"
                onClick={closePlatformPopup}
                className="text-sm font-semibold text-foreground/70 transition hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentProfiles.map((p) => {
                const userHandle = p.userStats?.handle;
                const totalSolved = p.totalQuestionStats?.totalQuestionCounts;
                const url = p.url || getPlatformUrl(p.platform, userHandle);
                return (
                  <div key={p.platform} className="rounded-xl border border-foreground/10 bg-foreground/5 p-4 shadow-inner dark:border-white/10 dark:bg-neutral-800/70">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-foreground dark:bg-neutral-700">
                        {renderPlatformIcon(p.platform)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground capitalize truncate">{p.platform}</div>
                        {userHandle ? (
                          <div className="text-xs text-foreground/70 truncate" title={`@${userHandle}`}>@{userHandle}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-foreground/75">
                      <span>Total solved</span>
                      <span className="font-semibold text-foreground">{totalSolved ?? "--"}</span>
                    </div>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background transition hover:opacity-90"
                      >
                        <span>Open profile</span>
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {showBadgesPopup ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <button
            type="button"
            aria-label="Close badges popup"
            onClick={closeBadgesPopup}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white/95 p-6 text-left shadow-2xl ring-1 ring-foreground/10 dark:bg-neutral-900/95 dark:ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">Badges</div>
                <div className="text-lg font-bold text-foreground">All platforms</div>
              </div>
              <button
                type="button"
                onClick={closeBadgesPopup}
                className="text-sm font-semibold text-foreground/70 transition hover:text-foreground"
              >
                Close
              </button>
            </div>

            {badges?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-3 shadow-inner dark:border-white/10 dark:bg-neutral-800/70">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 text-foreground dark:bg-neutral-700">
                      {badge.icon ? (
                        <img
                          src={badge.icon}
                          alt={badge.name}
                          className="h-10 w-10 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-foreground">{renderPlatformIcon(badge.platform, "h-10 w-10 text-foreground")}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{badge.name}</div>
                      <div className="text-xs text-foreground/70">{badge.platform}</div>
                      {badge.stars ? <div className="text-xs text-amber-500 font-semibold">{badge.stars}★</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-foreground/70">No badges available.</p>
            )}
          </div>
        </div>
      ) : null}

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
  onUserInteract,
  dsaTotals,
  dsaHandle,
  devHandle,
  devActive,
  devContrib,
  devProfile,
  contactLabel,
  contactUrl,
  tags,
  platformProfiles = [],
  badges = [],
  questionTotals,
}) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showBadgesPopup, setShowBadgesPopup] = useState(false);
  const isAnyPopupOpen = showProfilePopup || showBadgesPopup;

  const isDsa = view === "dsa";
  const totals = questionTotals || dsaTotals;
  const totalBadges = badges?.length ?? 0;

  const questionBreakdown = isDsa && totals
    ? [
        { label: "Easy", value: totals.easy ?? 0, dot: "bg-emerald-300" },
        { label: "Medium", value: totals.medium ?? 0, dot: "bg-amber-300" },
        { label: "Hard", value: totals.hard ?? 0, dot: "bg-rose-300" },
      ]
    : null;

  const statLeft = isDsa
    ? { label: "Solved", value: totals?.total ?? "--", accent: UI.colors.statGreen, breakdown: questionBreakdown }
    : { label: "Active Days", value: devActive ?? "--", accent: UI.colors.statGreen };

  const statRight = isDsa
    ? { label: "Badges", value: totalBadges, accent: UI.colors.statOrange }
    : { label: "Contributions", value: devContrib ?? "--", accent: UI.colors.statOrange };

  return (
    <div className="relative order-1 space-y-4 min-[900px]:order-2 min-[900px]:col-span-5 min-[900px]:self-start min-[900px]:-mt-6 w-full flex flex-col items-center">
      <ProfilePanel
        name={name}
        handle={isDsa ? dsaHandle : devHandle}
        statLeft={statLeft}
        statRight={statRight}
        tags={tags}
        linkLabel={contactLabel}
        linkUrl={contactUrl}
        platformProfiles={platformProfiles}
        badges={badges}
        isDsa={isDsa}
        showProfilePopup={showProfilePopup}
        setShowProfilePopup={setShowProfilePopup}
        showBadgesPopup={showBadgesPopup}
        setShowBadgesPopup={setShowBadgesPopup}
        onUserInteract={onUserInteract}
      />

      <div className="flex w-full max-w-md min-[900px]:max-w-lg gap-3">
        <button
          type="button"
          onClick={() => {
            onUserInteract?.();
            setView("dsa");
          }}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
            isDsa
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 bg-foreground/5 text-foreground/80 hover:border-foreground/40"
          } transition`}
        >
          DSA Stats
        </button>
        <button
          type="button"
          onClick={() => {
            onUserInteract?.();
            setView("dev");
          }}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
            !isDsa
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 bg-foreground/5 text-foreground/80 hover:border-foreground/40"
          } transition`}
        >
          Dev Stats
        </button>
      </div>
    </div>
  );
}

export default ProfileCardWithStats;
