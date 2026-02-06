import { useEffect, useMemo, useState } from "react";

function SunIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2.75 12h2.5M18.75 12h2.5M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20.2 14.3A8.4 8.4 0 0 1 9.7 3.8a.75.75 0 0 0-.95-.94A9.5 9.5 0 1 0 21.14 15.25a.75.75 0 0 0-.94-.95Z"
        fill="currentColor"
      />
    </svg>
  );
}

const links = [
  { name: "About", to: "#about" },
  { name: "Projects", to: "#projects" },
  { name: "Certificates", to: "#certificates" },
  { name: "Skills", to: "#skills" },
  { name: "Badges", to: "#badges" },
  { name: "Contact", to: "#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored || "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const navLinkClass = useMemo(
    () =>
      [
        "text-base font-semibold px-2 py-1.5 rounded-md transition-all duration-200",
        "text-foreground/70 hover:text-foreground hover:scale-105",
      ].join(" "),
    []
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-12 px-3 sm:px-4 lg:px-6">
        <a href="#home" className=" w-min text-3xl leading-6 tracking-tight font-bold text-foreground">
          <p className="font-sans">Paramjit Patel</p>
        </a>

        <div className="hidden items-center gap-8 min-[900px]:flex">
          {links.map((link) => (
            <a key={link.to} href={link.to} className={navLinkClass} onClick={() => setIsOpen(false)}>
              {link.name}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground shadow-sm transition hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-4.5 w-4.5" /> : <MoonIcon className="h-4.5 w-4.5" />}
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground transition hover:bg-white/10 min-[900px]:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-current transition ${isOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="bg-background px-4 py-3 min-[900px]:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

export default Navbar;