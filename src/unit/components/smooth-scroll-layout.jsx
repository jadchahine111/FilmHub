import React from "react";
import Hero from "./Hero";
import NavBar from "./NavBar";

export default function OptimizedComponent() {
  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col text-white">
      <NavBar scrollToSection={scrollToSection} />
      <main className="flex-grow space-y-8"> {/* Reduced margin between sections */}
        <section id="home">
          <Hero />
        </section>
      </main>
    </div>
  );
}
