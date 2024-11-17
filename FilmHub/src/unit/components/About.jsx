import { Badge } from "@/components/ui/badge"

export default function About() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16 lg:py-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8 md:mb-12 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          Discover the World of Cinema
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12 lg:space-y-16">
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              At <span className="font-semibold text-white">FilmHub</span>, we're passionate about connecting movie enthusiasts with their next favorite film. Our advanced search engine and comprehensive database are designed to make your movie discovery journey seamless and exciting.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">What We Offer</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 text-white">Search</Badge>
                  <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">Advanced movie search capabilities</span>
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 text-white">Database</Badge>
                  <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">Extensive film information</span>
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 text-white">Reviews</Badge>
                  <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">User ratings and reviews</span>
                </li>
                <li className="flex items-center text-muted-foreground leading-relaxed">
                  <Badge variant="outline" className="mr-2 text-white">Watchlist</Badge>
                  <span className="text-sm sm:text-base">Personalized movie tracking</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Our Commitment</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We're dedicated to providing the most up-to-date and accurate movie information. Our platform is constantly evolving to meet the needs of film lovers worldwide.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Powered by TMDB</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Our comprehensive movie data is powered by The Movie Database (TMDB), ensuring you have access to the latest and most accurate information about your favorite films and hidden gems.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}