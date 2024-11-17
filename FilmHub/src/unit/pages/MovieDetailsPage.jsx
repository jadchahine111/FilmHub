"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
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
import {
  StarIcon,
  BookmarkIcon,
  ClockIcon,
  DollarSignIcon,
  LanguagesIcon,
  CalendarIcon,
  FilmIcon,
  GlobeIcon,
  ArrowLeftIcon,
  ThumbsUpIcon,
  Loader2,
  CheckIcon
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "../hooks/AuthContext"

const API_BASE_URL = "http://localhost:5000/api"

function MovieDetails() {
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState("")
  const { tmdbId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading: authLoading, authAxios } = useAuth()

  const fetchMovieData = async () => {
    const response = await authAxios.get(`${API_BASE_URL}/movies/${tmdbId}`, { withCredentials: true })
    return response.data
  }

  const fetchUserProfile = async () => {
    const response = await authAxios.get(`${API_BASE_URL}/user/profile` , { withCredentials: true })
    return response.data
  }

  const fetchMovieReviews = async () => {
    const response = await authAxios.get(`${API_BASE_URL}/movies/${tmdbId}/reviews` , { withCredentials: true })
    return response.data
  }

  const { data: movieData, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", tmdbId],
    queryFn: fetchMovieData,
    enabled: !!tmdbId && isAuthenticated
  })

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    enabled: isAuthenticated
  })

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", tmdbId],
    queryFn: fetchMovieReviews,
    enabled: !!tmdbId && isAuthenticated
  })

  const isInWatchlist = userProfile?.watchlist?.includes(Number(tmdbId))

  const addToWatchlistMutation = useMutation({
    mutationFn: async () => {
      await authAxios.post(`${API_BASE_URL}/user/${tmdbId}/watchlist`, { } , {withCredentials: true})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
      toast({
        title: "Success",
        description: "Movie added to watchlist",
        variant: "default"
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add movie to watchlist",
        variant: "destructive"
      })
    }
  })

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await authAxios.post(
        `${API_BASE_URL}/user/${tmdbId}/review`,
        { rating: userRating, comment: userReview }, {
          withCredentials: true,
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", tmdbId] })
      setUserRating(0)
      setUserReview("")
      toast({
        title: "Success",
        description: "Review submitted successfully",
        variant: "default"
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      })
    }
  })

  const likeReviewMutation = useMutation({
    mutationFn: async reviewId => {
      await authAxios.post(`${API_BASE_URL}/reviews/${reviewId}/like`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", tmdbId] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like review",
        variant: "destructive"
      })
    }
  })

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleAddToWatchlist = () => {
    if (!isInWatchlist) {
      addToWatchlistMutation.mutate()
    }
  }

  const handleRating = rating => {
    setUserRating(rating)
  }

  const handleReviewSubmit = () => {
    submitReviewMutation.mutate()
  }

  const handleLikeReview = reviewId => {
    likeReviewMutation.mutate(reviewId)
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount)
  }

  const MovieDetailsSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
      <Button
        disabled
        className="mb-4 text-white bg-transparent hover:bg-transparent"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
      </Button>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          <Skeleton className="w-full h-10 mt-4" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <div className="flex items-center mb-4">
            <Skeleton className="h-6 w-6 mr-2" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
          <Skeleton className="h-20 w-full mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i}>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <Skeleton className="h-8 w-48 mt-4" />
        </div>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (authLoading || movieLoading) {
    return <MovieDetailsSkeleton />
  }

  if (!isAuthenticated) {
    navigate("/get-started")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={handleGoBack}
        className="mb-4 text-white bg-transparent hover:bg-transparent"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
      </Button>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
            alt={`${movieData.title} poster`}
            className="w-full rounded-lg shadow-lg"
          />
          <Button
            className={`w-full mt-4 ${
              isInWatchlist ? "bg-green-500 hover:bg-green-600" : ""
            }`}
            variant={isInWatchlist ? "secondary" : "default"}
            onClick={handleAddToWatchlist}
            disabled={isInWatchlist}
          >
            {isInWatchlist ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" /> Added to Watchlist
              </>
            ) : (
              <>
                <BookmarkIcon className="mr-2 h-4 w-4" /> Add to Watchlist
              </>
            )}
          </Button>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2 text-white">
            {movieData.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-4 text-gray-400">
            {movieData.tagline}
          </p>
          <div className="flex items-center mb-4">
            <StarIcon className="text-yellow-400 mr-1" />
            <span className="text-lg font-semibold text-white">
              {movieData.vote_average.toFixed(1)}
            </span>
            <span className="text-muted-foreground ml-2 text-gray-400">
              ({movieData.vote_count} votes)
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {movieData.genres.map(genre => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>
          <p className="mb-4 text-gray-400">{movieData.overview}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold flex items-center text-white">
                <CalendarIcon className="mr-2" /> Release Date
              </h2>
              <p className="text-gray-400">{movieData.release_date}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center text-white">
                <ClockIcon className="mr-2" /> Runtime
              </h2>
              <p className="text-gray-400">{movieData.runtime} minutes</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center text-white">
                <DollarSignIcon className="mr-2" /> Budget
              </h2>
              <p className="text-gray-400">
                {formatCurrency(movieData.budget)}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center text-white">
                <DollarSignIcon className="mr-2" /> Revenue
              </h2>
              <p className="text-gray-400">
                {formatCurrency(movieData.revenue)}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center text-white">
                <LanguagesIcon className="mr-2" /> Original Language
              </h2>
              <p className="text-gray-400">
                {movieData.spoken_languages[0].english_name}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center text-white">
                <GlobeIcon className="mr-2" /> Production Countries
              </h2>
              <p className="text-gray-400">
                {movieData.production_companies
                  .map(country => country.name)
                  .join(", ")}
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Production Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {movieData.production_companies.map(company => (
              <div
                key={company.id}
                className="flex items-center space-x-4 text-gray-300"
              >
                <Avatar className="w-12 h-12">
                  {company.logo_path ? (
                    <AvatarImage
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {company.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold">{company.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {company.origin_country}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4" asChild>
            <a
              href={movieData.homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FilmIcon className="mr-2" /> Visit Official Website
            </a>
          </Button>
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>User Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            reviews.map(review => (
              <div
                key={review.id}
                className="mb-4 p-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.user.name}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-4 w-4 ${
                            index < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeReview(review.id)}
                    disabled={review.userHasLiked}
                  >
                    <ThumbsUpIcon
                      className={`h-4 w-4 mr-2 ${
                        review.userHasLiked ? "text-blue-500" : "text-gray-500"
                      }`}
                    />
                    {review.likes}
                  </Button>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const queryClient = new QueryClient()

export default function MovieDetailsWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <MovieDetails />
    </QueryClientProvider>
  )
}
