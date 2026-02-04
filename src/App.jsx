import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./pages/Home";

function About() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">About</h2>
      <p className="mt-4 text-foreground/80">
        Brief bio and skills go here. Swap in your story, stack, and what you love to solve.
      </p>
    </section>
  );
}

function Projects() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
      <p className="mt-4 text-foreground/80">
        Showcase select projects with links, roles, and outcomes.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
      <p className="mt-4 text-foreground/80">
        Add your preferred contact methods or a form so people can reach out.
      </p>
    </section>
  );
}

function Certificates() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Certificates</h2>
      <p className="mt-4 text-foreground/80">
        Showcase verified credentials from your CMS—swap this copy with fetched certificate data or links.
      </p>
    </section>
  );
}

function Skills() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Skills</h2>
      <p className="mt-4 text-foreground/80">
        Highlight languages, frameworks, and tooling with proficiency levels or years of experience.
      </p>
    </section>
  );
}

function Badges() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Badges</h2>
      <p className="mt-4 text-foreground/80">
        Display earned badges from platforms like Credly—perfect for visual proof of skills.
      </p>
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
