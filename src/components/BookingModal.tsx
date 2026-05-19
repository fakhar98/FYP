import { X, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Movie } from '../types';
import { createTicket, getBookedSeats } from '../lib/storage';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  movie: Movie;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ movie, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<string>(movie.showtimes?.[0] ?? '1:00 PM');
  const [error, setError] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState<{ bank: string; account: string; sort: string; ref: string } | null>(null);

  useEffect(() => {
    setBookedSeats(getBookedSeats(movie.id, selectedShowtime));
  }, [movie.id, selectedShowtime]);

  function toggleSeat(id: string) {
    setError(null);
    if (bookedSeats.includes(id)) return;
    setSelectedSeats((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function handleBook() {
    if (!user) return;
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }
    // Re-check booked seats to avoid conflicts
    const fresh = getBookedSeats(movie.id, selectedShowtime);
    const conflict = selectedSeats.find((s) => fresh.includes(s));
    if (conflict) {
      setError(`Seat ${conflict} was just booked. Please pick another seat.`);
      setBookedSeats(fresh);
      setSelectedSeats((prev) => prev.filter((s) => !fresh.includes(s)));
      return;
    }

    // proceed to payment upload step
    setError(null);
    setShowPayment(true);
    // generate random bank details for the payment step
    const banks = ['First National Bank', 'Metro Trust', 'Community Bank', 'Global Savings'];
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const account = String(Math.floor(10000000 + Math.random() * 90000000));
    const sort = `${Math.floor(10 + Math.random() * 89)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(10 + Math.random() * 89)}`;
    const ref = `CV${Math.floor(1000 + Math.random() * 9000)}`;
    setBankDetails({ bank, account, sort, ref });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setPaymentFile(f);
    const reader = new FileReader();
    reader.onload = () => setPaymentPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  async function submitPayment() {
    if (!user) return;
    if (selectedSeats.length === 0) {
      setError('No seats selected.');
      setShowPayment(false);
      return;
    }
    if (!paymentFile && !paymentPreview) {
      setError('Please upload a payment screenshot.');
      return;
    }

    // final conflict check
    const fresh = getBookedSeats(movie.id, selectedShowtime);
    const conflict = selectedSeats.find((s) => fresh.includes(s));
    if (conflict) {
      setError(`Seat ${conflict} was just booked. Please pick another seat.`);
      setBookedSeats(fresh);
      setSelectedSeats((prev) => prev.filter((s) => !fresh.includes(s)));
      setShowPayment(false);
      return;
    }

    let proofData: string | undefined = undefined;
    if (paymentPreview) {
      proofData = paymentPreview;
    } else if (paymentFile) {
      proofData = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(new Error('Failed to read file'));
        r.readAsDataURL(paymentFile);
      });
    }

    createTicket(user.id, movie.id, selectedSeats.length, movie.price, selectedSeats, proofData, selectedShowtime);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket size={30} className="text-green-400" />
          </div>
          <h3 className="text-white text-xl font-bold mb-2">Booking Submitted!</h3>
          <p className="text-gray-400 text-sm mb-1">
            Your ticket for <span className="text-white font-medium">{movie.title}</span>{selectedShowtime ? <> at <span className="text-white font-medium">{selectedShowtime}</span></> : ''} is pending approval.
          </p>
          <p className="text-gray-500 text-xs mb-6">You can track it in your dashboard.</p>
          <button
            onClick={onSuccess}
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div className="flex flex-col md:flex-row gap-6 mb-5">
        <div className="flex-shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-44 h-60 object-cover rounded-xl shadow-2xl"
          />
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-white font-bold text-2xl leading-tight">{movie.title}</h3>
            <p className="text-amber-400 text-sm mt-1">{movie.genre}</p>
            <p className="text-gray-500 text-xs mt-2">PKR{movie.price.toFixed(2)} per seat</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Select Showtime</p>
            <div className="flex gap-2">
              {(movie.showtimes ?? ['1:00 PM', '4:00 PM', '7:30 PM']).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => { setSelectedShowtime(st); setSelectedSeats([]); setError(null); }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedShowtime === st ? 'bg-amber-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {!showPayment ? (
            <div className="bg-gray-800/60 rounded-xl p-4 mb-4">
              <p className="text-white font-semibold mb-3">Select Seats</p>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-sm border border-gray-600" />
                  <span className="text-gray-400 text-xs">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-sm" />
                  <span className="text-gray-400 text-xs">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded-sm" />
                  <span className="text-gray-400 text-xs">Booked/Pending</span>
                </div>
              </div>

              <div className="w-full">
                <div className="mx-auto max-w-full">
                  <div className="bg-gradient-to-r from-amber-600 to-amber-400 text-gray-900 rounded-t-full text-center py-2 font-bold">SCREEN</div>

                  <div className="mt-4 space-y-3">
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((row) => (
                      <div key={row} className="flex items-center gap-3">
                        <div className="w-6 text-gray-400 text-sm">{row}</div>
                        <div className="grid grid-cols-10 gap-3 flex-1">
                          {Array.from({ length: 10 }).map((_, i) => {
                            const id = `${row}${i + 1}`;
                            const isBooked = bookedSeats.includes(id);
                            const isSelected = selectedSeats.includes(id);
                            const base = 'w-11 h-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors';
                            const className = isBooked
                              ? `${base} bg-red-600 text-white cursor-not-allowed`
                              : isSelected
                              ? `${base} bg-amber-500 text-gray-950`
                              : `${base} bg-gray-800 border border-gray-700 text-gray-300 hover:border-amber-500 cursor-pointer`;
                            return (
                              <button
                                key={id}
                                type="button"
                                title={id}
                                onClick={() => toggleSeat(id)}
                                disabled={isBooked}
                                className={className}
                              >
                                {i + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/60 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm mb-3">Upload payment screenshot</p>

              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-300"
                />

                {paymentPreview && (
                  <img src={paymentPreview} alt="preview" className="w-full max-h-40 object-contain rounded-md" />
                )}

                <div className="mt-2">
                  <p className="text-gray-400 text-xs">Transfer details</p>
                  <div className="bg-gray-900 border border-gray-700 rounded-md p-3 mt-2 text-sm">
                    <p className="text-white font-bold">CineVista</p>
                    <p className="text-gray-400">Bank: {bankDetails?.bank}</p>
                    <p className="text-gray-400">Account: {bankDetails?.account}</p>
                    <p className="text-gray-400">Sort code: {bankDetails?.sort}</p>
                    <p className="text-gray-400">Ref: {bankDetails?.ref}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowPayment(false); setPaymentFile(null); setPaymentPreview(null); setError(null); }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={submitPayment}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-2 rounded-lg"
                  >
                    Submit Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm mb-5">
            <div>
              <p className="text-gray-400">Selected</p>
              <p className="text-white font-bold text-xl">{selectedSeats.length} seats</p>
              {selectedSeats.length > 0 && (
                <p className="text-gray-400 text-xs mt-1">Seats: <span className="text-white">{selectedSeats.join(', ')}</span></p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-400">Total</p>
              <p className="text-white font-bold text-xl">PKR {(selectedSeats.length * movie.price).toFixed(2)}</p>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <button
            onClick={handleBook}
            className="w-full bg-gradient-to-r from-red-500 to-amber-400 text-gray-950 font-bold py-3 rounded-xl transition-all"
          >
            Reserve Ticket
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-white font-bold text-lg mb-5">Book Ticket</h2>
        {children}
      </div>
    </div>
  );
}
