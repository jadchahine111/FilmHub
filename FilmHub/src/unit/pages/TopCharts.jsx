"use client"

import {
  useQuery,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { TrendingUpIcon, StarIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const fetchMovies = async endpoint => {
  const response = await axios.get(
    `http://localhost:5000/api/topCharts/${endpoint}`,
    {
      headers: {},
      withCredentials: true,  // Important to include cookies
    }
  )
  return response.data
}

function TopCharts() {
  const navigate = useNavigate()

  const { data: topRatedMovies, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => fetchMovies("top-rated")
  })

  const { data: popularMovies, isLoading: isLoadingPopular } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => fetchMovies("popularity")
  })

  const handleMovieClick = movieId => {
    navigate(`/movies/${movieId}`)
  }

  const MovieTableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">Rank</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Skeleton className="h-4 w-4" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-12 w-8" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-6 w-12 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const MovieTable = ({ movies }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">Rank</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movies.slice(0, 5).map((movie, index) => (
          <TableRow
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleMovieClick(movie.id)
              }
            }}
            tabIndex={0}
            role="button"
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">{index + 1}</div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-8 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-semibold">{movie.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{movie.vote_average.toFixed(1)}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Top Charts</h1>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StarIcon className="h-5 w-5" />
              Top Rated
            </CardTitle>
            <CardDescription>Highest rated movies of all time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTopRated ? (
              <MovieTableSkeleton />
            ) : (
              topRatedMovies && <MovieTable movies={topRatedMovies} />
            )}
          </CardContent>
        </Card>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5" />
              Most Popular
            </CardTitle>
            <CardDescription>
              Movies with the highest popularity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPopular ? (
              <MovieTableSkeleton />
            ) : (
              popularMovies && <MovieTable movies={popularMovies} />
            )}
          </CardContent>
        </Card>
      </div>
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

export default function TopChartsWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <TopCharts />
    </QueryClientProvider>
  )
}
