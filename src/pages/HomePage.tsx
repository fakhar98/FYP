import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import BookingModal from '../components/BookingModal';
import { getMovies } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import type { Movie } from '../types';

interface HomePageProps {
  onNavigate: (view: 'home' | 'auth' | 'dashboard' | 'admin') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();
  const movies = getMovies();
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const genres = ['All', ...Array.from(new Set(movies.map((m) => m.genre.split(' / ')[0])))];

  const filtered = movies.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.director.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genreFilter === 'All' || m.genre.includes(genreFilter);
    return matchSearch && matchGenre;
  });

  function handleBook(movie: Movie) {
    if (!user) {
      onNavigate('auth');
      return;
    }
    setSelectedMovie(movie);
  }

  function handleBookingSuccess() {
    setSelectedMovie(null);
    onNavigate('dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12)_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Now Showing</p>
          <h1 className="text-white text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Your Premium<br />Cinema Experience
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Discover the latest blockbusters, book your seats instantly, and enjoy world-class cinema at CineVista.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search movies or directors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-gray-500 flex-shrink-0" />
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenreFilter(g)}
                  className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    genreFilter === g
                      ? 'bg-amber-500 border-amber-500 text-gray-950'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg font-medium">No movies found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBook={handleBook}
                isLoggedIn={!!user}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <BookingModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
