import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function FAQ() {

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I search for movies?</AccordionTrigger>
            <AccordionContent>
              To search for movies, simply use the search bar at the top of the page. Enter the movie title, actor, or director you're looking for, and press enter or click the search icon. You'll then see a list of relevant results.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I filter movies by genre?</AccordionTrigger>
            <AccordionContent>
              Yes, you can filter movies by genre. On the search results page, you'll find a "Filter" option. Click on it to reveal various filtering options, including genres. Select the genres you're interested in to refine your search results.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How often is the movie database updated?</AccordionTrigger>
            <AccordionContent>
              Our movie database is updated daily with new releases, changes in ratings, and other movie-related information. We strive to provide the most up-to-date and accurate information possible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I create a watchlist?</AccordionTrigger>
            <AccordionContent>
              Yes, you can create a watchlist by creating an account on our platform. Once logged in, you'll be able to add movies to your watchlist by clicking the "Add to Watchlist" button on any movie page.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Are there movie recommendations?</AccordionTrigger>
            <AccordionContent>
              We provide personalized movie recommendations based on your viewing history and ratings. To get the best recommendations, make sure to rate movies you've watched and add films to your watchlist.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  )
}