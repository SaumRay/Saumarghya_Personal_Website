import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { CharacterCard } from "@/components/sections/CharacterCard";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Interests } from "@/components/sections/Interests";
import { NotesSection } from "@/components/sections/NotesSection";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
      window.history.replaceState(null, "", window.location.pathname);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Skills />
        <CharacterCard />
        <Experience />
        <Projects />
        <Interests />
        <NotesSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}