import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative py-24 px-4 overflow-hidden isolate sm:py-32"> {/* Removed bg-gray-900 */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Explore Your Next Favorite Movie
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dive into the world of cinema. Search for movies, view details, and discover your next favorite film in just a few clicks.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
          to="/get-started"
          className="px-6 py-3 bg-white text-black rounded-lg text-lg font-bold hover:bg-gray-200  transition"
        >Get Started</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
