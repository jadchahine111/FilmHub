import React from 'react' 
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

// Original sections array
const sections = [
  "home",
  "about",
  "featured",
  "faq",
  "cta" // This will be hidden in the NavBar
]

// Filtered sections for NavBar (excluding "cta")
const filteredSections = sections.filter(section => section !== "cta");

export default function NavBar({ activeSection, scrollToSection, isCtaActive }) {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 sticky top-0 z-10 ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link to="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6">
            {filteredSections.map((section, index) => (
              <Link
                key={section}
                to={`#${section}`}
                className={`flex w-full items-center py-2 text-lg font-semibold ${
                  activeSection === section ? 'text-primary' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(index);
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Link>
            ))}
            <Link to="/get-started" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Get Started
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link to="/" className="mr-6 hidden lg:flex" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>

      <nav className="ml-auto hidden lg:flex gap-6">
        {filteredSections.map((section, index) => (
          <Link
            key={section}
            to={`#${section}`}
            className={`link group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-gray-900 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50 ${
              activeSection === section ? 'text-primary border-b-2 border-primary' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(index);
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Link>
        ))}
        {/* Exclude the CTA link from the navbar */}
  {/* Correctly wrapping Link with motion for the Get Started button */}
  <Link to="/get-started" prefetch={false}>
    <motion.div
      className="group inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      animate={isCtaActive ? { scale: [1, 1.1, 1] } : {}} // Zoom in and out effect
      transition={{ duration: 0.5, repeat: isCtaActive ? Infinity : 0 }} // Repeat if active
    >
      Get Started
    </motion.div>
  </Link>
      </nav>
    </header>
  )
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
