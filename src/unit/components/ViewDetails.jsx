"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon, BookmarkIcon, ClockIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Placeholder data mimicking TMDB API structure
const movieData = {
  id: 550,
  title: "Fight Club",
  tagline:
    "How much can you know about yourself if you've never been in a fight?",
  overview:
    'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
  release_date: "1999-10-15",
  runtime: 139,
  vote_average: 8.4,
  vote_count: 23833,
  genres: ["Drama", "Thriller"],
  poster_path: "/placeholder.svg",
  backdrop_path: "/placeholder.svg",
  production_companies: ["20th Century Fox", "Regency Enterprises"],
  credits: {
    cast: [
      {
        id: 819,
        name: "Edward Norton",
        character: "The Narrator",
        profile_path: "/placeholder.svg"
      },
      {
        id: 287,
        name: "Brad Pitt",
        character: "Tyler Durden",
        profile_path: "/placeholder.svg"
      },
      {
        id: 1283,
        name: "Helena Bonham Carter",
        character: "Marla Singer",
        profile_path: "/placeholder.svg"
      }
    ],
    crew: [
      {
        id: 7467,
        name: "David Fincher",
        job: "Director",
        profile_path: "/placeholder.svg"
      },
      {
        id: 7469,
        name: "Jim Uhls",
        job: "Screenplay",
        profile_path: "/placeholder.svg"
      }
    ]
  }
}

export default function MovieDetails() {
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState("")

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    // In a real application, you would send this update to your backend
  }

  const handleRating = rating => {
    setUserRating(rating)
    // In a real application, you would send this rating to your backend
  }

  const handleReviewSubmit = () => {
    // In a real application, you would send this review to your backend
    console.log("Review submitted:", userReview)
    setUserReview("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src={movieData.poster_path}
            alt={`${movieData.title} poster`}
            className="w-full rounded-lg shadow-lg"
          />
          <Button
            className="w-full mt-4"
            variant={isInWatchlist ? "secondary" : "default"}
            onClick={handleAddToWatchlist}
          >
            {isInWatchlist ? (
              <>
                <ClockIcon className="mr-2 h-4 w-4" /> In Watchlist
              </>
            ) : (
              <>
                <BookmarkIcon className="mr-2 h-4 w-4" /> Add to Watchlist
              </>
            )}
          </Button>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{movieData.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">
            {movieData.tagline}
          </p>
          <div className="flex items-center mb-4">
            <StarIcon className="text-yellow-400 mr-1" />
            <span className="text-lg font-semibold">
              {movieData.vote_average.toFixed(1)}
            </span>
            <span className="text-muted-foreground ml-2">
              ({movieData.vote_count} votes)
            </span>
          </div>
          <p className="mb-4">{movieData.overview}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold">Release Date</h2>
              <p>{movieData.release_date}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Runtime</h2>
              <p>{movieData.runtime} minutes</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Genres</h2>
              <p>{movieData.genres.join(", ")}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Production</h2>
              <p>{movieData.production_companies.join(", ")}</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {movieData.credits.cast.slice(0, 6).map(actor => (
              <div key={actor.id} className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={actor.profile_path} alt={actor.name} />
                  <AvatarFallback>
                    {actor.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{actor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">Crew</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {movieData.credits.crew.map(crewMember => (
              <div key={crewMember.id} className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={crewMember.profile_path}
                    alt={crewMember.name}
                  />
                  <AvatarFallback>
                    {crewMember.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{crewMember.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {crewMember.job}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Review</CardTitle>
          <CardDescription>Share your thoughts about the movie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                className={
                  star <= userRating ? "text-yellow-400" : "text-gray-300"
                }
                onClick={() => handleRating(star)}
              >
                <StarIcon className="h-6 w-6 fill-current" />
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Write your review here..."
            value={userReview}
            onChange={e => setUserReview(e.target.value)}
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleReviewSubmit}>Submit Review</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
