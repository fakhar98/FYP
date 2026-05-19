import { Clock, CheckCircle, XCircle, Ticket, Film, CalendarDays } from 'lucide-react';
import { getTickets, getMovies } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import type { Ticket as TicketType, Movie } from '../types';

interface UserDashboardProps {
  onNavigate: (view: 'home' | 'auth' | 'dashboard' | 'admin') => void;
}

export default function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user } = useAuth();
  const allTickets = getTickets();
  const movies = getMovies();
  const movieMap = Object.fromEntries(movies.map((m) => [m.id, m]));

  const myTickets = allTickets.filter((t) => t.userId === user?.id);
  const pending = myTickets.filter((t) => t.status === 'pending');
  const approved = myTickets.filter((t) => t.status === 'approved');
  const rejected = myTickets.filter((t) => t.status === 'rejected');

  const totalSpent = approved.reduce((sum, t) => sum + t.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-1">My Account</p>
          <h1 className="text-white text-3xl font-black mb-1">Welcome, {user?.name}</h1>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Bookings" value={myTickets.length} icon={<Ticket size={18} />} />
          <StatCard label="Pending" value={pending.length} icon={<Clock size={18} />} color="amber" />
          <StatCard label="Approved" value={approved.length} icon={<CheckCircle size={18} />} color="green" />
          <StatCard label="Total Spent" value={`PKR ${totalSpent.toFixed(2)}`} icon={<Film size={18} />} color="blue" />
        </div>

        {/* Pending Tickets */}
        <Section title="Pending Tickets" count={pending.length} icon={<Clock size={16} className="text-amber-400" />}>
          {pending.length === 0 ? (
            <EmptyState text="No pending tickets" />
          ) : (
            <div className="space-y-3">
              {pending.map((t) => (
                <TicketRow key={t.id} ticket={t} movie={movieMap[t.movieId]} />
              ))}
            </div>
          )}
        </Section>

        {/* Booking History */}
        <Section
          title="Booking History"
          count={approved.length + rejected.length}
          icon={<CalendarDays size={16} className="text-gray-400" />}
          className="mt-8"
        >
          {approved.length === 0 && rejected.length === 0 ? (
            <EmptyState
              text="No booking history yet"
              sub={
                <button
                  onClick={() => onNavigate('home')}
                  className="mt-3 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                >
                  Browse movies &rarr;
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {[...approved, ...rejected]
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((t) => (
                  <TicketRow key={t.id} ticket={t} movie={movieMap[t.movieId]} />
                ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color = 'gray',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'gray' | 'amber' | 'green' | 'blue';
}) {
  const colorMap = {
    gray: 'bg-gray-800 text-gray-400',
    amber: 'bg-amber-500/10 text-amber-400',
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
  };
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-white font-bold text-2xl">{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function Section({
  title,
  count,
  icon,
  children,
  className = '',
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-white font-bold text-lg">{title}</h2>
        <span className="bg-gray-800 text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full ml-1">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function TicketRow({ ticket, movie }: { ticket: TicketType; movie: Movie | undefined }) {
  const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: <Clock size={12} /> },
    approved: { label: 'Approved', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: <CheckCircle size={12} /> },
    rejected: { label: 'Rejected', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: <XCircle size={12} /> },
  };
  const cfg = statusConfig[ticket.status];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
      {movie && (
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold truncate">{movie?.title ?? 'Unknown Movie'}</p>
        <p className="text-gray-500 text-xs mt-0.5">
          {ticket.seats} seat{ticket.seats > 1 ? 's' : ''} &bull;{' '}
          {new Date(ticket.bookedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-white font-bold">${ticket.totalPrice.toFixed(2)}</p>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border mt-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}
        >
          {cfg.icon}
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ text, sub }: { text: string; sub?: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl py-12 text-center">
      <p className="text-gray-500 text-sm">{text}</p>
      {sub}
    </div>
  );
}
