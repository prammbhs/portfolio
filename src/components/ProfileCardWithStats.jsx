import { useCallback, useEffect, useRef, useState } from "react";
import {
  siLeetcode,
  siGithub,
  siGeeksforgeeks,
  siHackerrank,
  siCodeforces,
} from "simple-icons";

function SquareMousePointerIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M21.18 15.96a1 1 0 0 1-1.33.3l-4.88-2.76-1.73 4.62a1 1 0 0 1-.94.65 1 1 0 0 1-.95-.63l-4.6-12.06a1 1 0 0 1 1.3-1.3l12.06 4.6a1 1 0 0 1-.02 1.88l-4.64 1.72 2.75 4.98Z"
        fill="currentColor"
      />
    </svg>
  );
}

const UI = {
  colors: {
    statGreen: "text-emerald-500",
    statOrange: "text-amber-500",
  },
  transitionDelayMs: 2000,
};

function StatBlock({ label, value, accent, onClick, transitionsDisabled }) {
  const clickable = Boolean(onClick);
  const Wrapper = clickable ? "button" : "div";
  const hoverExtras = transitionsDisabled ? "" : "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:bg-foreground/10 hover:border-foreground/30";
  
  return (
    <Wrapper
      type={clickable ? "button" : undefined}
      onClick={onClick}
      className={`min-w-0 w-full rounded-xl border border-foreground/10 bg-foreground/5 p-4 shadow-inner text-left dark:border-white/10 dark:bg-neutral-800/40 flex flex-col justify-center items-center ${
        clickable
          ? `cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${hoverExtras} ${
              transitionsDisabled ? "" : "transition-all duration-300 ease-out"
            }`
          : ""
      }`}
      style={transitionsDisabled ? { transition: "none", transform: "none" } : undefined}
    >
      <div className={`text-base min-[900px]:text-sm font-semibold ${accent}`}>
        {label}
      </div>
      <div className="mt-2 h-px w-full bg-foreground/10" />
      <div className="mt-3 text-4xl font-extrabold text-foreground sm:text-5xl min-[900px]:text-4xl min-[900px]:mt-2">{value ?? "--"}</div>
    </Wrapper>
  );
}

function ProfilePanel({
  name,
  handle,
  statLeft,
  statRight,
  displayTags = [],
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
      className="relative w-full max-w-md min-[900px]:max-w-[420px] overflow-hidden mx-auto min-[900px]:ml-auto min-[900px]:mx-0 rounded-[2rem] border border-foreground/10 bg-card/80 backdrop-blur-xl p-6 text-foreground shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:p-7 min-[900px]:p-6 dark:bg-[#212529]/90 transition-all duration-500 ease-in-out hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]"
      style={transitionsLocked ? { transition: "none" } : undefined}
    >

      <div className="mt-2 flex flex-col items-center gap-3 min-[900px]:gap-2 text-center">
        <div className="relative group perspective-1000">
          <div className="flex h-36 w-36 min-[900px]:h-28 min-[900px]:w-28 items-center justify-center rounded-full bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 text-6xl min-[900px]:text-5xl font-black text-foreground shadow-lg dark:bg-neutral-800 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] ring-4 ring-transparent group-hover:ring-foreground/5" aria-hidden>
            {initial}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl min-[900px]:text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            {name}
            <svg viewBox="0 0 24 24" className="h-6 w-6 min-[900px]:h-5 min-[900px]:w-5 text-emerald-500" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </h2>
          {handle ? (
            <div className="inline-flex rounded-full bg-[#514332] px-4 py-1.5 min-[900px]:py-1 text-sm min-[900px]:text-xs font-semibold text-[#F3D3B1]">
              @{handle}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 min-[900px]:mt-4 grid gap-3 min-[900px]:gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 p-3 shadow-inner sm:grid-cols-2 dark:bg-neutral-900/60">
        <StatBlock
          label={statLeft.label}
          value={statLeft.value}
          accent={statLeft.accent}
          transitionsDisabled={transitionsLocked}
        />
        <StatBlock
          label={statRight.label}
          value={statRight.value}
          accent={statRight.accent}
          transitionsDisabled={transitionsLocked}
        />
      </div>

      <div className="mt-4 min-[900px]:mt-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4 min-[900px]:p-3 text-center dark:bg-neutral-900/60 shadow-inner">
        <div className="text-sm min-[900px]:text-xs font-bold text-foreground/60 mb-3 min-[900px]:mb-2">You can find me on ...</div>
        <div className="flex items-center justify-center gap-4 min-[900px]:gap-3">
          {currentProfiles.map((p) => {
            const url = p.url || getPlatformUrl(p.platform, p.userStats?.handle);
            return (
              <a
                key={p.platform}
                href={url || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 hover:text-foreground transition-colors"
                title={p.platform}
              >
                {renderPlatformIcon(p.platform, "h-8 w-8")}
              </a>
            );
          })}
        </div>
      </div>

      {displayTags?.length ? (
        <div className="mt-4 flex flex-wrap content-start gap-2 overflow-hidden h-28 rounded-xl border border-foreground/10 bg-foreground/5 p-3 shadow-inner dark:border-white/10 dark:bg-neutral-900/60">
          {isDsa ? (
            displayTags.map((topic) => (
              <span
                key={topic.tag}
                className="rounded-full bg-foreground/5 border border-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80 dark:bg-neutral-800/80 flex items-center gap-1.5"
                title={`${topic.count} solved`}
              >
                {topic.tag} <span className="opacity-50">{topic.count}</span>
              </span>
            ))
          ) : (
             displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-foreground/5 border border-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80 dark:bg-neutral-800/80"
              >
                #{tag}
              </span>
            ))
          )}
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
      {/* Moved tags to base level so it expands the card */}
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
  dsaTopics = [],
}) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showBadgesPopup, setShowBadgesPopup] = useState(false);
  const isAnyPopupOpen = showProfilePopup || showBadgesPopup;

  const isDsa = view === "dsa";
  const totals = questionTotals || dsaTotals;
  const totalBadges = badges?.length ?? 0;

  const statLeft = isDsa
    ? { label: "Questions Solved", value: totals?.total ?? "--", accent: UI.colors.statOrange }
    : { label: "Active Days", value: devActive ?? "--", accent: UI.colors.statGreen };

  const statRight = isDsa
    ? { label: "Active Days", value: devActive ?? "--", accent: UI.colors.statGreen }
    : { label: "Contributions", value: devContrib ?? "--", accent: UI.colors.statOrange };

  return (
    <div className="relative order-1 space-y-4 min-[900px]:order-2 min-[900px]:col-span-5 min-[900px]:self-start min-[900px]:-mt-20 w-full flex flex-col items-center min-[900px]:items-end min-[900px]:justify-self-end animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
      <ProfilePanel
        name={name}
        handle={isDsa ? dsaHandle : devHandle}
        statLeft={statLeft}
        statRight={statRight}
        displayTags={isDsa ? dsaTopics : tags}
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

      <div className="flex w-full max-w-md min-[900px]:max-w-[420px] mx-auto min-[900px]:ml-auto min-[900px]:mx-0 gap-3">
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
