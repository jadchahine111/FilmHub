import { Button } from "@/components/ui/button"
//import Image from "next/image"
//import HeroImage from "../../assets/How-to-Create-Facebook-Login-Page-in-HTML-and-CSS.png"
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center text-center max-w-3xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          FilmHub
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Discover movies, explore details, and find your next favorite film with FilmHub, your go-to movie search engine.
        </p>
        <Link
          to="/get-started"
          className="px-6 py-3 bg-white text-black rounded-lg text-lg font-bold hover:bg-gray-200 transition"
        >Get Started</Link>
        {/* <div className="mt-12 w-full max-w-md">
          <Image
            src={HeroImage}
            alt="FilmHub Dashboard"
            width={500}
            height={300}
            layout="responsive"
            className="rounded-lg shadow-lg"
          />
        </div> */}
      </div>
    </div>
  )
}
