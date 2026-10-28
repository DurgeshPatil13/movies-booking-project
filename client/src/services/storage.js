import { initialMovies, initialTheaters, initialUsers } from '../data/initialData.js';
export { initialUsers };

const STORAGE_KEYS = {
  MOVIES: 'imovies_movies_v1',
  THEATERS: 'imovies_theaters_v1',
  SHOWS: 'imovies_shows_v1',
  BOOKINGS: 'imovies_bookings_v1',
  USERS: 'imovies_users_v1',
  CURRENT_USER: 'imovies_current_user_v1'
};

// Safe JSON parser
const safeParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`[Storage] Failed to parse item for key "${key}":`, err);
    return fallback;
  }
};

// Safe JSON stringify and write
const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[Storage] Failed to save key "${key}":`, err);
    return false;
  }
};

/**
 * Generate 7 days of dynamic shows relative to current browser date
 */
export const generateClientShows = (theatersList, moviesList) => {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push({
      dateStr: `${yyyy}-${mm}-${dd}`,
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
    });
  }

  const timeslots = ["10:30 AM", "01:45 PM", "04:30 PM", "07:15 PM", "10:00 PM"];
  const moviePool = (moviesList && moviesList.length ? moviesList : initialMovies).filter(m => m.isNowShowing);
  const shows = [];
  let count = 1;

  dates.forEach((dateObj, dayIdx) => {
    (theatersList || initialTheaters).forEach((th, thIdx) => {
      th.screens.forEach((scr, scrIdx) => {
        const movieIndex = (dayIdx + thIdx + scrIdx) % moviePool.length;
        const movie = moviePool[movieIndex] || moviePool[0];

        // 2 slots on some days, 3 slots on others
        const slots = (dayIdx + scrIdx) % 2 === 0
          ? [timeslots[1], timeslots[3]]
          : [timeslots[0], timeslots[2], timeslots[4]];

        slots.forEach((time) => {
          shows.push({
            id: `show-${count++}`,
            movieId: movie.id,
            movieTitle: movie.title,
            moviePoster: movie.posterUrl,
            theaterId: th.id,
            theaterName: th.name,
            screenId: scr.id,
            screenName: scr.name,
            format: scr.type,
            date: dateObj.dateStr,
            dateLabel: dateObj.formattedLabel,
            time: time,
            basePrice: scr.type === 'IMAX' || scr.type === '4DX' ? 16.50 : 13.50
          });
        });
      });
    });
  });

  return shows;
};

/**
 * Standard visual seat layout (Rows A-G, 8 seats = 56 seats)
 */
export const getSeatLayout = (basePrice = 14) => {
  const rows = [
    { row: 'A', tier: 'VIP', priceMultiplier: 1.4, label: 'VIP Recliner' },
    { row: 'B', tier: 'VIP', priceMultiplier: 1.4, label: 'VIP Recliner' },
    { row: 'C', tier: 'Premium', priceMultiplier: 1.2, label: 'Premium Club' },
    { row: 'D', tier: 'Premium', priceMultiplier: 1.2, label: 'Premium Club' },
    { row: 'E', tier: 'Premium', priceMultiplier: 1.2, label: 'Premium Club' },
    { row: 'F', tier: 'Standard', priceMultiplier: 1.0, label: 'Standard Classic' },
    { row: 'G', tier: 'Standard', priceMultiplier: 1.0, label: 'Standard Classic' }
  ];

  const seats = [];
  rows.forEach(r => {
    for (let i = 1; i <= 8; i++) {
      seats.push({
        id: `${r.row}${i}`,
        row: r.row,
        number: i,
        tier: r.tier,
        tierLabel: r.label,
        price: Number((basePrice * r.priceMultiplier).toFixed(2))
      });
    }
  });
  return seats;
};

/**
 * Initialize all storage collections if not already present
 */
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.MOVIES)) {
    safeSet(STORAGE_KEYS.MOVIES, initialMovies);
  }
  if (!localStorage.getItem(STORAGE_KEYS.THEATERS)) {
    safeSet(STORAGE_KEYS.THEATERS, initialTheaters);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    safeSet(STORAGE_KEYS.USERS, initialUsers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHOWS)) {
    const movies = safeParse(STORAGE_KEYS.MOVIES, initialMovies);
    const theaters = safeParse(STORAGE_KEYS.THEATERS, initialTheaters);
    const shows = generateClientShows(theaters, movies);
    safeSet(STORAGE_KEYS.SHOWS, shows);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    // Seed 1 sample booking for Alex Mercer so My Bookings has realistic sample data initially
    const sampleBooking = {
      id: "IMV-DEMO-9821",
      bookingReference: "IMV-982104",
      userId: "user-1",
      userName: "Alex Mercer",
      userEmail: "alex@example.com",
      showId: "show-2",
      movieId: "mov-1",
      movieTitle: "Dune: Part Two",
      moviePoster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      theaterId: "th-1",
      theaterName: "IMovies Grand Cinema – Downtown Plaza",
      screenName: "Screen 1 - IMAX Laser",
      format: "IMAX",
      date: new Date().toISOString().split('T')[0],
      time: "07:15 PM",
      seats: [
        { id: "A4", tier: "VIP", price: 23.10 },
        { id: "A5", tier: "VIP", price: 23.10 }
      ],
      seatLabels: ["A4", "A5"],
      ticketCount: 2,
      subtotal: 46.20,
      convenienceFee: 3.70,
      tax: 2.31,
      totalAmount: 52.21,
      paymentMethod: "Demo Card Payment",
      status: "confirmed",
      bookedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    };
    safeSet(STORAGE_KEYS.BOOKINGS, [sampleBooking]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to Alex Mercer for seamless demo experience
    safeSet(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
  }
};

/**
 * Reset all demo data to pristine state
 */
export const resetDemoData = () => {
  localStorage.removeItem(STORAGE_KEYS.MOVIES);
  localStorage.removeItem(STORAGE_KEYS.THEATERS);
  localStorage.removeItem(STORAGE_KEYS.SHOWS);
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  initStorage();
  return true;
};

// ======================== MOVIES CRUD ========================
export const getStoredMovies = () => {
  initStorage();
  return safeParse(STORAGE_KEYS.MOVIES, initialMovies);
};

export const getStoredMovieById = (id) => {
  const movies = getStoredMovies();
  return movies.find(m => m.id === id) || null;
};

export const saveStoredMovie = (newMovie) => {
  const movies = getStoredMovies();
  const movieToSave = {
    ...newMovie,
    id: newMovie.id || `mov-${Date.now()}`,
    votes: newMovie.votes || 1,
    basePrice: Number(newMovie.basePrice) || 13.00,
    duration: Number(newMovie.duration) || 120,
    rating: Number(newMovie.rating) || 8.0,
    genres: Array.isArray(newMovie.genres) ? newMovie.genres : (newMovie.genres ? newMovie.genres.split(',').map(s => s.trim()) : ["Action"]),
    cast: Array.isArray(newMovie.cast) ? newMovie.cast : (newMovie.cast ? newMovie.cast.split(',').map(s => s.trim()) : ["Cast Member"]),
    isNowShowing: newMovie.isNowShowing ?? true,
    isUpcoming: newMovie.isUpcoming ?? false,
    featured: newMovie.featured ?? false
  };

  movies.unshift(movieToSave);
  safeSet(STORAGE_KEYS.MOVIES, movies);
  return movieToSave;
};

export const updateStoredMovie = (id, updatedFields) => {
  const movies = getStoredMovies();
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return null;

  movies[index] = { ...movies[index], ...updatedFields };
  safeSet(STORAGE_KEYS.MOVIES, movies);
  return movies[index];
};

export const deleteStoredMovie = (id) => {
  const movies = getStoredMovies();
  const filtered = movies.filter(m => m.id !== id);
  safeSet(STORAGE_KEYS.MOVIES, filtered);
  return true;
};

// ======================== THEATERS & SHOWS ========================
export const getStoredTheaters = () => {
  initStorage();
  return safeParse(STORAGE_KEYS.THEATERS, initialTheaters);
};

export const getStoredShows = (filters = {}) => {
  initStorage();
  let shows = safeParse(STORAGE_KEYS.SHOWS, []);
  if (shows.length === 0) {
    const movies = getStoredMovies();
    const theaters = getStoredTheaters();
    shows = generateClientShows(theaters, movies);
    safeSet(STORAGE_KEYS.SHOWS, shows);
  }

  if (filters.movieId) {
    shows = shows.filter(s => s.movieId === filters.movieId);
  }
  if (filters.theaterId) {
    shows = shows.filter(s => s.theaterId === filters.theaterId);
  }
  if (filters.date) {
    shows = shows.filter(s => s.date === filters.date);
  }
  return shows;
};

export const getStoredShowById = (id) => {
  const shows = getStoredShows();
  return shows.find(s => s.id === id) || null;
};

// ======================== BOOKINGS MANAGEMENT ========================
export const getStoredBookings = () => {
  initStorage();
  return safeParse(STORAGE_KEYS.BOOKINGS, []);
};

export const getUserBookings = (userId) => {
  const bookings = getStoredBookings();
  if (!userId) return [];
  return bookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
};

export const getBookedSeatsForShow = (showId) => {
  const bookings = getStoredBookings();
  // Filter for confirmed bookings for this specific show
  const activeBookings = bookings.filter(b => b.showId === showId && b.status === 'confirmed');
  const bookedSeatIds = new Set();
  activeBookings.forEach(b => {
    (b.seats || []).forEach(s => bookedSeatIds.add(s.id));
  });
  return Array.from(bookedSeatIds);
};

/**
 * Creates and saves a new booking in localStorage.
 * Checks for seat conflicts within this browser storage.
 */
export const createBooking = (bookingData) => {
  const { showId, seats, user } = bookingData;
  if (!showId || !seats || seats.length === 0) {
    throw new Error('Show and at least one seat must be selected.');
  }

  // Conflict check
  const alreadyBooked = getBookedSeatsForShow(showId);
  const conflicting = seats.filter(s => alreadyBooked.includes(s.id));
  if (conflicting.length > 0) {
    throw new Error(`The following seats were just booked by another session: ${conflicting.map(s => s.id).join(', ')}. Please pick different seats.`);
  }

  const allBookings = getStoredBookings();
  const refCode = `IMV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const newBooking = {
    ...bookingData,
    id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingReference: refCode,
    userId: user?.id || 'guest',
    userName: user?.name || 'Guest User',
    userEmail: user?.email || 'guest@imovies.demo',
    status: 'confirmed',
    bookedAt: new Date().toISOString()
  };

  allBookings.unshift(newBooking);
  safeSet(STORAGE_KEYS.BOOKINGS, allBookings);
  return newBooking;
};

/**
 * Cancel an eligible booking: marks status as cancelled and frees up seats
 */
export const cancelBooking = (bookingId) => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex(b => b.id === bookingId || b.bookingReference === bookingId);
  if (index === -1) {
    throw new Error('Booking not found.');
  }

  if (bookings[index].status === 'cancelled') {
    throw new Error('This booking has already been cancelled.');
  }

  bookings[index].status = 'cancelled';
  bookings[index].cancelledAt = new Date().toISOString();
  safeSet(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings[index];
};

// ======================== DEMO AUTH & USERS ========================
export const getStoredUsers = () => {
  initStorage();
  return safeParse(STORAGE_KEYS.USERS, initialUsers);
};

export const getCurrentUser = () => {
  initStorage();
  return safeParse(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
};

export const setCurrentUser = (user) => {
  safeSet(STORAGE_KEYS.CURRENT_USER, user);
  return user;
};

export const loginUser = (email, password) => {
  const users = getStoredUsers();
  const trimmedEmail = (email || '').trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === trimmedEmail);

  if (!user) {
    throw new Error('No demo account registered with this email.');
  }

  // Demo password validation: must not be empty and must be at least 4 characters
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters for this demo.');
  }

  setCurrentUser(user);
  return user;
};

export const registerUser = ({ name, email, password }) => {
  const users = getStoredUsers();
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: trimmedEmail,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  safeSet(STORAGE_KEYS.USERS, users);
  setCurrentUser(newUser);
  return newUser;
};

export const updateUserProfile = (userId, updates) => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found.');

  users[index] = { ...users[index], ...updates };
  safeSet(STORAGE_KEYS.USERS, users);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(users[index]);
  }

  return users[index];
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  return true;
};
