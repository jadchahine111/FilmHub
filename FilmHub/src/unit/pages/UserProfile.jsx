"use client"
import { useState } from "react"
import axios from "axios"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  StarIcon,
  ArrowLeftIcon,
  Loader2,
  CheckCircleIcon,
  XCircleIcon,
  Film,
  Clapperboard,
  Calendar,
  Clock,
  Trash2,
  PlusCircle,
  MinusCircle
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

const API_BASE_URL = "http://localhost:5000/api"

const fetchUserProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/profile`, {
    headers: { },
     withCredentials: true,  // Important to include cookies
  })
  return response.data
}

const fetchPredictedGenres = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/user/predict-favorite-genre`,
    {
      headers: { }, 
      withCredentials: true,  // Important to include cookies
    }
  )
  return response.data.predictedFavoriteGenres || []
}

const fetchRecentActivity = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/activity`, {
    headers: { },
    withCredentials: true,  // Important to include cookies
  })
  return response.data.recentActivity || []
}

const fetchUserReviews = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/reviews`, {
    headers: { },
    withCredentials: true,  // Important to include cookies
  })
  return response.data.reviews || []
}

const fetchUserWatchlist = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/watchlist`, {
    headers: { },
    withCredentials: true,  // Important to include cookies
  })
  return response.data.watchlist || []
}

function UserProfile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,

  })

  const { data: predictedGenres, isLoading: genresLoading } = useQuery({
    queryKey: ["predictedGenres"],
    queryFn: fetchPredictedGenres,
  })

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: fetchRecentActivity,

  })

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["userReviews"],
    queryFn: fetchUserReviews,

  })

  const { data: watchlist, isLoading: watchlistLoading } = useQuery({
    queryKey: ["userWatchlist"],
    queryFn: fetchUserWatchlist,

  })

  const updateProfileMutation = useMutation({
    mutationFn: async updatedData => {
          await axios.put(`${API_BASE_URL}/user/profile`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,  // Important to include cookies
      })
    },
    onSuccess: () => {
      setShowSuccessModal(true)
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
    onError: () => {
      setShowErrorModal(true)
    }
  })

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async movieId => {
          await axios.delete(`${API_BASE_URL}/user/${movieId}/watchlist`, {
        headers: { },
        withCredentials: true,  // Important to include cookies
      })
    },
    onMutate: async movieId => {
      await queryClient.cancelQueries({ queryKey: ["userWatchlist"] })
      const previousWatchlist = queryClient.getQueryData(["userWatchlist"])
      queryClient.setQueryData(["userWatchlist"], old =>
        old ? old.filter(movie => movie.tmdbId !== movieId) : []
      )
      return { previousWatchlist }
    },
    onError: (err, movieId, context) => {
      queryClient.setQueryData(["userWatchlist"], context?.previousWatchlist)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userWatchlist"] })
      queryClient.invalidateQueries({ queryKey: ["recentActivity"] })
    }
  })

  const handleProfileUpdate = updatedData => {
    updateProfileMutation.mutate(updatedData)
  }

  const handleRemoveFromWatchlist = movieId => {
    removeFromWatchlistMutation.mutate(movieId)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleGoBack}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Go Back
      </Button>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback>
                    {userData?.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{userData?.name}</CardTitle>
                  <CardDescription>{userData?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleProfileUpdate(userData)
                }}
              >
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userData?.name}
                      onChange={e =>
                        queryClient.setQueryData(["userProfile"], old =>
                          old ? { ...old, name: e.target.value } : undefined
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData?.email}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={userData?.phoneNumber || ""}
                      onChange={e =>
                        queryClient.setQueryData(["userProfile"], old =>
                          old
                            ? { ...old, phoneNumber: e.target.value }
                            : undefined
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userData?.bio || ""}
                      onChange={e =>
                        queryClient.setQueryData(["userProfile"], old =>
                          old ? { ...old, bio: e.target.value } : undefined
                        )
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleProfileUpdate(userData)}
                className="w-full"
              >
                Update Profile
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Predicted Favorite Genres</CardTitle>
            </CardHeader>
            <CardContent>
              {genresLoading ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {predictedGenres && predictedGenres.length > 0 ? (
                    predictedGenres.map((genre, index) => (
                      <div
                        key={index}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No genres predicted yet.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-2/3 bg-gray-50 p-6 rounded-xl shadow-lg">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest interactions with movies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    recentActivity?.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 mb-4"
                      >
                        {activity.type === "watchlist" && (
                          <PlusCircle className="w-6 h-6 text-green-500" />
                        )}
                        {activity.type === "removeWatchlist" && (
                          <MinusCircle className="w-6 h-6 text-red-500" />
                        )}
                        {activity.type === "review" && (
                          <StarIcon className="w-6 h-6 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-semibold">{activity.movieTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === "watchlist" &&
                              "Added to watchlist"}
                            {activity.type === "removeWatchlist" &&
                              "Removed from watchlist"}
                            {activity.type === "review" &&
                              "You rated this movie"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Your Reviews</CardTitle>
                  <CardDescription>Movies you've reviewed</CardDescription>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    reviews.map(review => (
                      <div
                        key={review.id}
                        className="mb-6 p-4 border rounded-lg bg-white"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {review.movieTitle}
                          </h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                              <StarIcon
                                key={index}
                                className={`h-5 w-5 ${
                                  index < review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          Review ID: {review.id}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      You haven't reviewed any movies yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="watchlist">
              <Card>
                <CardHeader>
                  <CardTitle>Your Watchlist</CardTitle>
                  <CardDescription>
                    Your personal movie collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {watchlistLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : watchlist && watchlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {watchlist.map(movie => (
                        <div
                          key={movie.tmdbId}
                          className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col"
                        >
                          <div className="relative h-48">
                            {movie.posterImage ? (
                              <img
                                src={movie.posterImage}
                                alt={movie.movieTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Film className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              {movie.releaseYear}
                            </div>
                          </div>
                          <div className="p-4 flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                                {movie.movieTitle}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {movie.overview}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {movie.releaseDate}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {movie.runtime} min
                              </span>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 border-t">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() =>
                                handleRemoveFromWatchlist(movie.tmdbId)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove from Watchlist
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clapperboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg font-semibold">
                        Your watchlist is empty
                      </p>
                      <p className="text-gray-500 mt-2">
                        Start adding movies to create your collection!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
              Profile Updated Successfully
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Your profile has been updated with the new information.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <XCircleIcon className="w-6 h-6 text-red-500 mr-2" />
              Error Updating Profile
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            There was an error updating your profile. Please try again later.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Create a new QueryClient instance
const queryClient = new QueryClient(
)

// Wrap the UserProfile component with QueryClientProvider
export default function UserProfileWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProfile />
    </QueryClientProvider>
  )
}
