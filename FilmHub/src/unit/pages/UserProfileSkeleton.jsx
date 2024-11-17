import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon } from "lucide-react"

export function UserProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        disabled
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Go Back
      </Button>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton key={index} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-2/3 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-200">
              <TabsTrigger value="activity" disabled>Activity</TabsTrigger>
              <TabsTrigger value="reviews" disabled>Reviews</TabsTrigger>
              <TabsTrigger value="watchlist" disabled>Watchlist</TabsTrigger>
              <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}