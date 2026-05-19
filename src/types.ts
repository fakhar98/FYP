export interface Movie {
  id: string;
  title: string;
  genre: string;
  director: string;
  duration: number; // minutes
  releaseDate: string;
  price: number;
  poster: string;
  description: string;
  rating: string;
  showtimes?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export type TicketStatus = 'pending' | 'approved' | 'rejected';

export interface Ticket {
  id: string;
  userId: string;
  movieId: string;
  seats: number;
  seatNumbers?: string[];
  paymentProof?: string; // base64 data URL of uploaded payment screenshot
  totalPrice: number;
  status: TicketStatus;
  bookedAt: string;
  updatedAt: string;
  showtime?: string;
}
