import type { Movie, User, Ticket } from '../types';
import movie1Poster from '../assets/movie1.jpg';
import movie2Poster from '../assets/movie2.jpg';
import movie3Poster from '../assets/movie3.jpg';
import movie4Poster from '../assets/movie4.jpg';
import movie5Poster from '../assets/movie5.jpg';
import movie6Poster from '../assets/movie6.jpg';

const KEYS = {
  movies: 'cinevista_movies',
  users: 'cinevista_users',
  tickets: 'cinevista_tickets',
};

const SEED_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Top Gun: Maverick',
    genre: 'Action / Drama',
    director: 'Sofia Reyes',
    duration: 218,
    releaseDate: '2022',
    price: 1000,
    poster: movie1Poster,
    description: 'In a rain-soaked dystopian city, a rogue AI detective hunts down the architect of a city-wide blackout before dawn erases all evidence.',
    rating: 'PG-13',
  },
  {
    id: 'm2',
    title: 'Project Hail Mary',
    genre: 'Adventure / Comedy',
    director: 'James Okafor',
    duration: 210,
    releaseDate: '2026',
    price: 1000,
    poster: movie2Poster,
    description: 'An aging mapmaker embarks on one final expedition to chart an uncharted island, only to discover it holds the secret to humanity\'s forgotten past.',
    rating: 'PG',
  },
  {
    id: 'm3',
    title: 'Ready or Not 2',
    genre: 'Comedy / Thriller',
    director: 'Marcus Vance',
    duration: 148,
    releaseDate: '2026',
    price: 1000,
    poster: movie3Poster,
    description: 'A Navy captain must race against time when a rogue submarine threatens to trigger World War III from beneath the Arctic Ocean.',
    rating: 'R',
  },
  {
    id: 'm4',
    title: 'Kidnapped: Elizabeth Smart',
    genre: 'Documentary / Crime',
    director: 'Elena Marchetti',
    duration: 131,
    releaseDate: '2026',
    price: 1000,
    poster: movie4Poster,
    description: 'Two strangers trapped in a mysterious estate uncover decades of buried secrets — and an unexpected love that transcends time.',
    rating: 'PG-13',
  },
  {
    id: 'm5',
    title: 'Do Not Enter',
    genre: 'United States / Crime',
    director: 'Chen Wei',
    duration: 131,
    releaseDate: '2026',
    price: 1000,
    poster: movie5Poster,
    description: 'When the international space station begins drifting off course, one astronaut must perform a solo EVA mission to save six billion lives.',
    rating: 'PG-13',
  },
  {
    id: 'm6',
    title: "Another Man's Wife",
    genre: 'Drama / Romance',
    director: 'Priya Nair',
    duration: 131,
    releaseDate: '2026',
    price: 1000,
    poster: movie6Poster,
    description: 'A forgotten queen reclaims her throne in a tale of betrayal, power, and sacrifice set in a crumbling medieval empire.',
    rating: 'R',
  },
  {
    id: 'm7',
    title: 'Inception',
    genre: 'Sci-Fi / Thriller',
    director: 'Christopher Nolan',
    duration: 148,
    releaseDate: '2010-07-16',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
    description: 'A mind-bending sci-fi thriller where thieves enter people\'s dreams to steal secrets from their subconscious.',
    rating: 'PG-13',
  },
  {
    id: 'm8',
    title: 'The Dark Knight',
    genre: 'Action / Crime',
    director: 'Christopher Nolan',
    duration: 152,
    releaseDate: '2008-07-18',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
    description: "Arguably the greatest superhero film ever made, featuring an unforgettable performance by Heath Ledger as the Joker.",
    rating: 'PG-13',
  },
  {
    id: 'm9',
    title: 'Interstellar',
    genre: 'Sci-Fi / Drama',
    director: 'Christopher Nolan',
    duration: 169,
    releaseDate: '2014-11-07',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
    description: 'A visually stunning and emotionally powerful space odyssey about a team of travelers searching for a new home for humanity.',
    rating: 'PG-13',
  },
  {
    id: 'm10',
    title: 'Parasite',
    genre: 'Thriller / Drama',
    director: 'Bong Joon-ho',
    duration: 132,
    releaseDate: '2019-05-30',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
    description: 'A brilliant, genre-blending South Korean thriller about class dynamics that made history by winning the Oscar for Best Picture.',
    rating: 'R',
  },
  {
    id: 'm11',
    title: 'Whiplash',
    genre: 'Drama',
    director: 'Damien Chazelle',
    duration: 106,
    releaseDate: '2014-10-10',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/0/01/Whiplash_poster.jpg',
    description: 'An intense, high-energy drama about a young jazz drummer pushed to his absolute limits by a ruthless instructor.',
    rating: 'R',
  },
  {
    id: 'm12',
    title: 'Spider-Man: Into the Spider-Verse',
    genre: 'Animation / Action',
    director: 'Bob Persichetti',
    duration: 117,
    releaseDate: '2018-12-14',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png',
    description: 'A masterclass in animation and storytelling that completely redefined what a comic book movie can look like.',
    rating: 'PG',
  },
  {
    id: 'm13',
    title: 'Shutter Island',
    genre: 'Psychological Thriller',
    director: 'Martin Scorsese',
    duration: 138,
    releaseDate: '2010-02-19',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/7/76/Shutterislandposter.jpg',
    description: 'A psychological thriller that keeps you guessing until the very last frame as a U.S. Marshal investigates a disappearance at a psychiatric facility.',
    rating: 'R',
  },
  {
    id: 'm14',
    title: 'Gladiator',
    genre: 'Historical / Action',
    director: 'Ridley Scott',
    duration: 155,
    releaseDate: '2000-05-05',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png',
    description: 'An epic historical drama filled with incredible action, focusing on a betrayed Roman general seeking vengeance.',
    rating: 'R',
  },
  {
    id: 'm15',
    title: 'The Matrix',
    genre: 'Sci-Fi / Action',
    director: 'The Wachowskis',
    duration: 136,
    releaseDate: '1999-03-31',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png',
    description: 'The iconic sci-fi action film that questioned reality and revolutionized visual effects forever.',
    rating: 'R',
  },
  {
    id: 'm16',
    title: 'Knives Out',
    genre: 'Mystery / Comedy',
    director: 'Rian Johnson',
    duration: 130,
    releaseDate: '2019-11-27',
    price: 1000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Knives_Out_poster.jpeg',
    description: 'A modern, witty, and incredibly fun "whodunit" murder mystery with a fantastic ensemble cast.',
    rating: 'PG-13',
  },
];

const DEFAULT_SHOWTIMES = ['1:00 PM', '4:00 PM', '7:30 PM'];

const SEED_ADMIN: User = {
  id: 'admin_001',
  name: 'Admin',
  email: 'admin@cinevista.com',
  password: 'admin123',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

function seed() {
  // Ensure movies seed reflects the current SEED_MOVIES. If movies are missing
  // or any seeded movie differs (title/poster), overwrite stored movies so
  // changes (like updated posters in `src/assets`) appear in the UI.
  try {
    const raw = localStorage.getItem(KEYS.movies);
    let shouldWrite = false;
    if (!raw) {
      shouldWrite = true;
    } else {
      const existing = JSON.parse(raw || '[]');
      // if counts differ, update
      if (!Array.isArray(existing) || existing.length !== SEED_MOVIES.length) {
        shouldWrite = true;
      } else {
        for (const seed of SEED_MOVIES) {
          const found = existing.find((m: any) => m.id === seed.id);
          const keysToCheck = [
            'title',
            'poster',
            'genre',
            'director',
            'duration',
            'releaseDate',
            'price',
            'description',
            'rating',
          ];
          if (!found) {
            shouldWrite = true;
            break;
          }
          for (const k of keysToCheck) {
            if ((found as any)[k] !== (seed as any)[k]) {
              shouldWrite = true;
              break;
            }
          }
          if (shouldWrite) break;
        }
      }
    }
    if (shouldWrite) localStorage.setItem(KEYS.movies, JSON.stringify(SEED_MOVIES.map(m => ({ ...m, showtimes: m.showtimes ?? DEFAULT_SHOWTIMES }))));
  } catch (e) {
    localStorage.setItem(KEYS.movies, JSON.stringify(SEED_MOVIES.map(m => ({ ...m, showtimes: m.showtimes ?? DEFAULT_SHOWTIMES }))));
  }
  const users = getUsers();
  if (!users.find((u) => u.email === SEED_ADMIN.email)) {
    localStorage.setItem(KEYS.users, JSON.stringify([...users, SEED_ADMIN]));
  }
  if (!localStorage.getItem(KEYS.tickets)) {
    localStorage.setItem(KEYS.tickets, JSON.stringify([]));
  }

  // Ensure stored movies have showtimes (do not overwrite existing showtimes)
  try {
    const rawMovies = JSON.parse(localStorage.getItem(KEYS.movies) || '[]');
    if (Array.isArray(rawMovies)) {
      const normalized = rawMovies.map((m: any) => ({
        ...m,
        showtimes: Array.isArray(m.showtimes) && m.showtimes.length ? m.showtimes : DEFAULT_SHOWTIMES,
      }));
      localStorage.setItem(KEYS.movies, JSON.stringify(normalized));
    }
  } catch (e) {
    // ignore
  }
}

export function getMovies(): Movie[] {
  seed();
  return JSON.parse(localStorage.getItem(KEYS.movies) || '[]');
}

export function getUsers(): User[] {
  const raw = localStorage.getItem(KEYS.users);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]) {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function saveMovies(movies: Movie[]) {
  localStorage.setItem(KEYS.movies, JSON.stringify(movies));
}

export function getTickets(): Ticket[] {
  seed();
  return JSON.parse(localStorage.getItem(KEYS.tickets) || '[]');
}

export function saveTickets(tickets: Ticket[]) {
  localStorage.setItem(KEYS.tickets, JSON.stringify(tickets));
}

export function updateMovie(movie: Movie) {
  const movies = getMovies();
  const updated = movies.map((m) => (m.id === movie.id ? movie : m));
  saveMovies(updated);
}

export function deleteMovie(movieId: string) {
  const movies = getMovies().filter((m) => m.id !== movieId);
  saveMovies(movies);
  // remove any tickets associated with the deleted movie
  const tickets = getTickets().filter((t) => t.movieId !== movieId);
  saveTickets(tickets);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function createUser(data: Omit<User, 'id' | 'createdAt' | 'role'>): User {
  const users = getUsers();
  const newUser: User = {
    ...data,
    id: `u_${Date.now()}`,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, newUser]);
  return newUser;
}

export function createTicket(
  userId: string,
  movieId: string,
  seats: number,
  price: number,
  seatNumbers?: string[],
  paymentProof?: string,
  showtime?: string
): Ticket {
  const tickets = getTickets();
  const ticket: Ticket = {
    id: `t_${Date.now()}`,
    userId,
    movieId,
    seats,
    seatNumbers: seatNumbers && seatNumbers.length ? seatNumbers : undefined,
    paymentProof: paymentProof && paymentProof.length ? paymentProof : undefined,
    totalPrice: seats * price,
    status: 'pending',
    bookedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    showtime: showtime,
  };
  saveTickets([...tickets, ticket]);
  return ticket;
}

export function getBookedSeats(movieId: string, showtime?: string): string[] {
  const tickets = getTickets();
  return tickets
    .filter((t) => t.movieId === movieId && (typeof showtime === 'undefined' ? true : (t as any).showtime === showtime))
    .flatMap((t) => (Array.isArray((t as any).seatNumbers) ? (t as any).seatNumbers : []));
}

export function updateTicketStatus(ticketId: string, status: 'approved' | 'rejected') {
  const tickets = getTickets();
  const updated = tickets.map((t) =>
    t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
  );
  saveTickets(updated);
}
