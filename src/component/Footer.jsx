import { NavLink } from "react-router-dom";

const footerLinks = [
    { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Projects", to: "/projects" },
  { name: "Certificates", to: "/certificates" },
  { name: "Skills", to: "/skills" },
  { name: "Contact", to: "/contact" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background/95 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight">Paramjit Patel</h3>
            <p className="text-sm leading-6 text-foreground/70">
              Frontend developer crafting calm, intentional web experiences. See more at
              <span className="ml-1 inline-flex items-center gap-1 font-semibold">
                <a
                  href="https://paramjitpatel.me"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  paramjitpatel.me
                </a>
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground/60">Navigate</h4>
            <div className="flex flex-wrap gap-3">
              {footerLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/5",
                    ].join(" ")
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground/60">Let&apos;s talk</h4>
            <p className="text-sm leading-6 text-foreground/70">
              Ready to collaborate or have a question? Jump to the contact page and drop a note.
            </p>
            <NavLink
              to="/contact"
              className="inline-flex w-fit items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Contact
            </NavLink>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-foreground/10 pt-6 text-xs text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Paramjit Patel. All rights reserved.</span>
          <span className="text-foreground/50">Built with care and curiosity.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
