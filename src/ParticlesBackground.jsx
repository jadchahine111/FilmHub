import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#000", // Dark background for a cinematic feel
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#fff", // White particles to resemble stars
      },
      links: {
        color: "#fff", // White links for connections
        distance: 150,
        enable: false, // No connections between particles
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 0.5, // Reduced speed for slower movement
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50, // Reduced number of particles for less density
      },
      opacity: {
        value: 0.5, // Lower opacity for less clutter
      },
      shape: {
        type: "star", // Star shape for particles
        stroke: {
          width: 0,
          color: "#000",
        },
        polygon: {
          nb_sides: 5,
        },
      },
      size: {
        value: { min: 1, max: 5 }, // Slightly larger size for visibility
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
    />
  );
}
