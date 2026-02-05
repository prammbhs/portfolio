import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import About from "./pages/About";

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
      <p className="mt-4 text-foreground/80">
        Showcase select projects with links, roles, and outcomes.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
      <p className="mt-4 text-foreground/80">
        Add your preferred contact methods or a form so people can reach out.
      </p>
    </section>
  );
}

function Certificates() {
  return (
    <section id="certificates" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-semibold text-foreground">Certificates</h2>
      <p className="mt-4 text-foreground/80">
        Showcase verified credentials from your CMS—swap this copy with fetched certificate data or links.
      </p>
    </section>
  );
}


function Badges() {
  return (
    <section id="badges" className="mx-auto max-w-5xl px-4 py-12">
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
      <main>
        <Home />
        <About />
        <Projects />
        <Certificates />
        <Badges />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
