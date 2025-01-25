"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500" // TMDB image base URL

const mockMovies = [
  {
    id: 1,
    title: "Interstellar",
    subText: "Mankind's next step will be our greatest.",
    overview:
      "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", // TMDB poster path
    vote_average: 8.6,
    release_date: "2014-11-07"
  },  
  {
    id: 2,
    title: "The Shawshank Redemption",
    subText: "Fear can hold you prisoner. Hope can set you free.",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", // TMDB poster path
    vote_average: 9.3,
    release_date: "1994-09-23"
  },
  {
    id: 3,
    title: "The Dark Knight",
    subText: "Why so serious?",
    overview:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster_path: "/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg", // TMDB poster path
    vote_average: 9.0,
    release_date: "2008-07-18"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    subText: "You won't know the facts until you've seen the fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", // TMDB poster path
    vote_average: 8.9,
    release_date: "1994-10-14"
  },
  {
    id: 5,
    title: "Forrest Gump",
    subText: "Life is like a box of chocolates",
    overview:
      "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    poster_path: "/h5J4W4veyxMXDMjeNxZI46TsHOb.jpg", // TMDB poster path
    vote_average: 8.8,
    release_date: "1994-07-06"
  },
  {
    id: 6,
    title: "The Matrix",
    subText: "Welcome to the Real World",
    overview:
      "A computer programmer discovers that reality as he knows it is a simulation created by machines to subjugate humanity.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", // TMDB poster path
    vote_average: 8.7,
    release_date: "1999-03-31"
  }
]

export default function FeaturedMovies() {
  const [movies, setMovies] = useState(mockMovies)
  const [width, setWidth] = useState(0)
  const carousel = useRef(null)
  const controls = useAnimation()

  useEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  useEffect(() => {
    const infiniteScroll = async () => {
      await controls.start({
        x: -width,
        transition: {
          duration: 30,
          ease: "linear"
        }
      })
      controls.set({ x: 0 })
      infiniteScroll()
    }

    infiniteScroll()
  }, [controls, width])

  useEffect(() => {
    setMovies(prevMovies => [...prevMovies, ...prevMovies])
  }, [])

  return (
    <section className=" overflow-hidden w-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold mb-2 text-center">Featured Movies</h2>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Discover our handpicked selection of cinematic gems
        </p>
        <div className="overflow-hidden">
          <motion.div
            ref={carousel}
            className="cursor-grab w-full" 
          >
            <motion.div
              animate={controls}
              className="flex"
            >
              {movies.map((movie, index) => (
                <motion.div
                  key={`${movie.id}-${index}`}
                  className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] lg:min-w-[400px] mr-4 sm:mr-6"
                >
                  <Card className="overflow-hidden h-full">
                    <img
                      src={`${BASE_IMAGE_URL}${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover"
                    />
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-bold text-lg sm:text-xl mb-1 line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 italic line-clamp-1">
                        {movie.subText}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                        {movie.overview}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(movie.release_date).getFullYear()}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-1" />
                          <span className="text-xs sm:text-sm font-semibold">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
