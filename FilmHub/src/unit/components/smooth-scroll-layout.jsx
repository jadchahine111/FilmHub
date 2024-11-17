"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Hero from "./Hero"
import About from "./About"
import FeaturedMovies from "./FeaturedMovies"
import FAQ from "./FAQ"
import CTA from "./CTA"
import NavBar from "./NavBar"

const sections = ["home", "about", "featured", "faq", "cta"]

const sectionVariants = {
  home: {
    initial: { opacity: 0, scale: 0.8 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 1.2, transition: { duration: 0.5 } }
  },
  about: {
    initial: { opacity: 0, x: -100 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } }
  },
  featured: {
    initial: { opacity: 0, y: 100 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -100, transition: { duration: 0.5 } }
  },
  faq: {
    initial: { opacity: 0, scale: 1.2 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } }
  },
  cta: {
    initial: { opacity: 0, scale: 0, rotate: 180 },
    enter: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0, rotate: -180, transition: { duration: 0.5 } }
  }
}

export default function Component() {
  const [activeSection, setActiveSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const touchStartY = useRef(0)
  const lastScrollTime = useRef(Date.now())

  const debounce = (func, wait) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const handleSectionChange = useCallback((direction) => {
    const now = Date.now()
    if (now - lastScrollTime.current < 1000) return
    lastScrollTime.current = now

    setActiveSection((prev) => {
      const next = prev + direction
      return Math.max(0, Math.min(next, sections.length - 1))
    })
  }, [])

  const debouncedHandleSectionChange = useCallback(
    debounce(handleSectionChange, 100),
    [handleSectionChange]
  )

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (e.deltaY > 0) {
        debouncedHandleSectionChange(1)
      } else if (e.deltaY < 0) {
        debouncedHandleSectionChange(-1)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [debouncedHandleSectionChange])

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    const touchEndY = e.touches[0].clientY
    const touchDiff = touchStartY.current - touchEndY

    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        debouncedHandleSectionChange(1)
      } else {
        debouncedHandleSectionChange(-1)
      }
    }
  }

  const scrollToSection = (sectionIndex) => {
    setActiveSection(sectionIndex)
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden  text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <NavBar
        activeSection={sections[activeSection]}
        scrollToSection={scrollToSection}
        isCtaActive={activeSection === sections.length - 1}
      />
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={sections[activeSection]}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={sectionVariants[sections[activeSection]]}
          >
            {activeSection === 0 && <Hero />}
            {activeSection === 1 && <About />}
            {activeSection === 2 && <FeaturedMovies />}
            {activeSection === 3 && <FAQ />}
            {activeSection === 4 && <CTA />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}