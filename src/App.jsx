import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
const ProjectSection = lazy(() => import("./components/ProjectSection"));
const CertificateSection = lazy(() => import("./components/CertificateSection"));
const BadgesSection = lazy(() => import("./components/BadgesSection"));

function LazySection({ children, fallback, rootMargin = "200px" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (isVisible) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}

function Contact() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("https://formsubmit.co/ajax/paramjeetpatelmbhs@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success === "true" || data.success === true) {
        setStatus({ type: "success", message: "Thanks! Your message has been sent." });
        event.currentTarget.reset();
      } else {
        setStatus({ type: "error", message: "Something went wrong. Please try again later." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Something went wrong. Please try again later." });
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-12 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
        <p className="mt-2 text-foreground/80">
          Send a message and I’ll get back to you soon.
        </p>
      </div>
      <form
        className="mx-auto grid w-full max-w-3xl gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="subject" value="Portfolio Contact" />
        <label className="grid gap-2 text-sm text-foreground/70">
          Name
          <input
            type="text"
            name="name"
            required
            className="h-11 rounded-md border border-foreground/20 bg-background px-3 text-foreground"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2 text-sm text-foreground/70">
          Email
          <input
            type="email"
            name="email"
            required
            className="h-11 rounded-md border border-foreground/20 bg-background px-3 text-foreground"
            placeholder="you@email.com"
          />
        </label>
        <label className="grid gap-2 text-sm text-foreground/70">
          Message
          <textarea
            name="message"
            rows="5"
            required
            className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground"
            placeholder="Write your message..."
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-md bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
        {status.message ? (
          <p
            className={`text-sm ${status.type === "error" ? "text-red-500" : "text-emerald-600"}`}
            role="status"
            aria-live="polite"
          >
            {status.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId;
    let start;
    const duration = 500;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick);
      } else {
        setIsLoading(false);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isLoading ? (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-black">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Paramjit Patel</h1>
          <div className="absolute bottom-10 left-1/2 w-[80vw] max-w-3xl -translate-x-1/2">
            <div className="h-3 w-full rounded-full bg-black/10">
              <div
                className="h-3 rounded-full bg-black transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm font-semibold text-black text-center">Loading {progress}%</div>
          </div>
        </div>
      ) : null}
      <Navbar />
      <main>
        <Home />
        <About />
        <LazySection fallback={<div className="mx-auto max-w-5xl px-4 py-12 text-sm text-foreground/70">Loading projects...</div>}>
          <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-12 text-sm text-foreground/70">Loading projects...</div>}>
            <ProjectSection />
          </Suspense>
        </LazySection>
        <LazySection fallback={<div className="mx-auto max-w-5xl px-4 py-12 text-sm text-foreground/70">Loading certificates...</div>}>
          <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-12 text-sm text-foreground/70">Loading certificates...</div>}>
            <CertificateSection />
          </Suspense>
        </LazySection>
        <LazySection fallback={<div className="mx-auto max-w-5xl px-4 py-12 text-sm text-foreground/70">Loading badges...</div>}>
          <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-12 text-sm text-foreground/70">Loading badges...</div>}>
            <BadgesSection />
          </Suspense>
        </LazySection>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
