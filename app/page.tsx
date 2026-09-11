"use client";

import { Contact } from "@/components/Contact";
import { Credentials } from "@/components/Credentials";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { KonamiEasterEgg } from "@/components/KonamiEasterEgg";
import { Metrics } from "@/components/Metrics";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Skills } from "@/components/Skills";
import { Terminal } from "@/components/Terminal";
import { useReveal } from "@/hooks/useReveal";

export default function Home() {
  useReveal();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Experience />
        <Projects />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <Terminal />
      <KonamiEasterEgg />
    </>
  );
}
