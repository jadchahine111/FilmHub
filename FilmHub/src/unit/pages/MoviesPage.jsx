"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  useQuery,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from "../hooks/AuthContext"

const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <Skeleton className="w-full h-64" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
)

function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [genre, setGenre] = useState("all")
  const [year, setYear] = useState([1900, 2023])
  const [rating, setRating] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const navigate = useNavigate()
  const { isAuthenticated, isLoading, authAxios } = useAuth()

  const fetchMovies = async ({ queryKey }) => {
    const [_, page, search, genreFilter, yearRange, minRating] = queryKey
    if (!isAuthenticated) {
      throw new Error("User is not authenticated")
    }

    const response = await authAxios.get(
      "http://localhost:5000/api/movies/all",
      {
        params: {
          page,
          limit: 10,
          search,
          genre: genreFilter === "all" ? "" : genreFilter,
          yearFrom: yearRange[0],
          yearTo: yearRange[1],
          minRating
        },
        headers: {
          Accept: "application/json"
        },
        withCredentials: true
      }
    )

    if (!response.data || !response.data.movies) {
      throw new Error("Invalid response format")
    }

    return {
      movies: response.data.movies,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
      totalMovies: response.data.totalMovies,
      moviesPerPage: response.data.moviesPerPage
    }
  }

  const { data, isLoading: isLoadingMovies, isError, error, refetch } = useQuery({
    queryKey: ["movies", currentPage, searchTerm, genre, year, rating],
    queryFn: fetchMovies,
    enabled: isAuthenticated,
    keepPreviousData: true
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/get-started")
    }
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      refetch()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, genre, year, rating, refetch])

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setCurrentPage(newPage)
    }
  }

  if (isLoading) {
    return <div className="text-center text-white mt-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Movie Search Engine
      </h1>

      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xl py-6"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger id="genre">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="scifi">Sci-Fi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Release Year</Label>
          <Slider
            min={1900}
            max={2023}
            step={1}
            value={year}
            onValueChange={setYear}
            className="mt-2"
          />
          <div className="flex justify-between mt-1">
            <span>{year[0]}</span>
            <span>{year[1]}</span>
          </div>
        </div>
        <div>
          <Label htmlFor="rating">Minimum Rating</Label>
          <Select
            value={rating.toString()}
            onValueChange={value => setRating(Number(value))}
          >
            <SelectTrigger id="rating">
              <SelectValue placeholder="Select minimum rating" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
                <SelectItem key={value} value={value.toString()}>
                  {value}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError && (
        <div className="text-red-500 text-center mb-4">{error.message}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoadingMovies ? (
          Array(10)
            .fill(0)
            .map((_, index) => <SkeletonCard key={index} />)
        ) : data?.movies && data.movies.length > 0 ? (
          data.movies.map(movie => (
            <Card key={movie.tmdbId} className="overflow-hidden">
              <img
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
                className="w-full h-64 object-cover"
              />
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Year: {movie.year}</p>
                <div className="flex items-center mt-2">
                  <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  to={`/movies/${movie.tmdbId}`}
                  className="w-full bg-black text-white text-center p-2 border font-bold rounded-lg"
                >
                  View Details
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-white">
            No movies found
          </div>
        )}
      </div>

      {data?.movies && data.movies.length > 0 && (
        <div className="flex flex-col items-center space-y-4 mt-8">
          <div className="flex justify-center items-center space-x-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-white">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="text-white text-sm">
            Showing {(data.currentPage - 1) * data.moviesPerPage + 1} - {Math.min(data.currentPage * data.moviesPerPage, data.totalMovies)} of {data.totalMovies} movies
          </div>
        </div>
      )}
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000
    }
  }
})

export default function MoviesPageWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <MoviesPage />
    </QueryClientProvider>
  )
}