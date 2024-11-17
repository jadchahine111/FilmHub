"use client"
import {
  useQuery,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import axios from "axios"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StarIcon } from "lucide-react"

const API_BASE_URL = "http://localhost:5000/api"

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

function NowPlaying() {
  const fetchMovies = async () => {
    const response = await axios.get(`${API_BASE_URL}/movies/now-playing`, {
      headers: {

      },
      withCredentials: true,  // Important to include cookies
    })
    return response.data
  }

  const { data: movies, isLoading, isError, error } = useQuery({
    queryKey: ["nowPlayingMovies"],
    queryFn: fetchMovies,
    staleTime: 60000, // 1 minute
    cacheTime: 300000 // 5 minutes
  })

  if (isError) {
    return (
      <div className="text-red-500 text-center">Error: {error.message}</div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Now Playing
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <SkeletonCard key={index} />)
        ) : movies && movies.length > 0 ? (
          movies.map(movie => (
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

export default function NowPlayingWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <NowPlaying />
    </QueryClientProvider>
  )
}
