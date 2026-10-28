# IMovies – Movie Ticket Booking Made Simple (No Database)

> A polished, responsive, full-stack demonstration platform for booking cinema movie tickets, built with **React**, **Node.js**, and **Express**, engineered with a database-free architecture utilizing browser **`localStorage`** for client state and ticket persistence.

---

## 📌 Project Overview

**IMovies** is an online cinema ticket reservation platform designed for academic and demonstration purposes. It replicates the end-to-end user experience of major cinema ticketing apps:
- Browsing trending now-showing and upcoming movies.
- Real-time searching and filtering by genre, title, actor, and language.
- Exploring multi-screen theater auditoriums (IMAX Laser, Dolby Atmos, 4DX Motion).
- Selecting showtimes across a rolling 7-day schedule.
- Interactive seat map with realistic tiered seating (VIP Recliner, Premium Club, Standard Classic).
- Real-time seat reservation enforcement (max 8 seats per booking, instant conflict prevention).
- Simulated checkout with order summary and instant printable ticket vouchers.
- Managing user bookings with full cancellation and seat inventory release.
- Administrative console for catalog additions, edits, and live booking monitoring.

**Key Architectural Note**: Unlike typical ticketing systems that rely on PostgreSQL, MySQL, or MongoDB, **IMovies does not use any database**. Application state, customer reservations, and demo profiles persist inside the client's browser `localStorage`. A lightweight Express backend provides catalog endpoints, security headers, and health checks.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 with Vite | Fast rendering, modular component hierarchy, HMR |
| **Routing** | React Router DOM v7 | Client-side declarative routing and protected routes |
| **Styling** | Bootstrap 5 + React Bootstrap + Custom CSS | Responsive layout, dark cinema theme, custom curved screen & seat matrix |
| **Icons** | Lucide React | Modern visual icons throughout the UI |
| **HTTP Client** | Axios | REST API consumption with automatic offline/fallback recovery |
| **Backend Framework** | Node.js + Express.js | Modular REST catalog API, Helmet security, Morgan logging, CORS |
| **Data Persistence** | Browser `localStorage` | Zero-database local persistence for tickets, users, and catalog updates |
| **API Testing** | Postman Collection | Comprehensive API test suite in `docs/imovies_postman_collection.json` |

---

## 📂 Monorepo Structure

```text
collegeproject/
├── client/                     # React + Vite Frontend Application
│   ├── public/
│   │   └── favicon.svg         # Cinema SVG favicon
│   ├── src/
│   │   ├── assets/             # Brand logos & static assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Navigation bar with demo account switcher
│   │   │   ├── Footer.jsx      # Footer with quick links & location info
│   │   │   ├── MovieCard.jsx   # Movie poster card with fallback support
│   │   │   ├── MovieGrid.jsx   # Responsive grid with empty/loading states
│   │   │   ├── SearchBar.jsx   # Keyword search input
│   │   │   ├── GenreFilter.jsx # Genre category pill strip
│   │   │   ├── SeatGrid.jsx    # Visual curved cinema screen and seat matrix
│   │   │   ├── BookingCard.jsx # Ticket voucher card with cancel modal
│   │   │   ├── DemoBanner.jsx  # Informative demonstration badge
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── LoadingIndicator.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Demo user sessions & switching
│   │   │   └── BookingContext.jsx # Real-time booking flow & pricing math
│   │   ├── data/
│   │   │   └── initialData.js  # 10+ movies, 3 theaters, demo accounts
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Hero spotlight, now-showing & upcoming
│   │   │   ├── Movies.jsx      # Filterable & searchable movie directory
│   │   │   ├── MovieDetails.jsx# Synopsis, cast, theater & showtime picker
│   │   │   ├── SeatSelection.jsx# Visual auditorium seating layout
│   │   │   ├── Checkout.jsx    # Review order & demo payment selection
│   │   │   ├── BookingConfirmation.jsx # Digital ticket voucher receipt
│   │   │   ├── MyBookings.jsx  # Reservation history & seat cancellation
│   │   │   ├── Login.jsx       # Demo sign-in with quick credentials
│   │   │   ├── Register.jsx    # Local account registration
│   │   │   ├── Profile.jsx     # User details & editable display name
│   │   │   ├── AdminDashboard.jsx # Catalog manager & metrics console
│   │   │   └── NotFound.jsx    # 404 error page
│   │   ├── services/
│   │   │   ├── api.js          # Axios API layer with local fallback
│   │   │   └── storage.js      # Robust localStorage storage abstraction
│   │   ├── styles/
│   │   │   └── custom.css      # Dark cinema theme, seat states & ticket stubs
│   │   ├── App.jsx             # Router layout & providers
│   │   ├── main.jsx            # React root mount
│   │   └── vite.config.js      # Vite build configuration
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── server/                     # Lightweight Express Backend
│   ├── src/
│   │   ├── data/
│   │   │   ├── moviesData.js   # Read-only catalog movies
│   │   │   ├── theatersData.js # Theaters & screen layouts
│   │   │   └── showsData.js    # Dynamic 7-day schedule generator
│   │   ├── middleware/
│   │   │   ├── errorHandler.js # Centralized error & 404 handler
│   │   │   └── requestValidator.js # Param validation helper
│   │   ├── routes/
│   │   │   ├── configRoutes.js # /api/health and /api/config
│   │   │   ├── movieRoutes.js  # /api/movies and /api/movies/:id
│   │   │   ├── theaterRoutes.js# /api/theaters and /api/theaters/:id
│   │   │   └── showRoutes.js   # /api/shows with query filtering
│   │   ├── app.js              # Express app setup, CORS, Helmet, Morgan
│   │   └── server.js           # Express listener
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── docs/
│   └── imovies_postman_collection.json # Postman API test collection
├── PROJECT_PLAN.md             # Six epics, task checklist, status
├── README.md                   # Complete documentation
└── package.json                # Root package orchestrator
```

---

## ⚡ Installation & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.14.1)
- **npm**: v9.0.0 or later (Tested on npm 11.11.0)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 1. Install Dependencies

You can install all dependencies from the root directory or inside each folder:

```bash
# Option A: From project root
npm run install:all

# Option B: Individually
cd server && npm install
cd ../client && npm install
```

### 2. Run the Applications

Open two terminal windows:

#### Terminal 1: Start Express Backend Server
```bash
cd server
npm start
# Server starts on http://localhost:5000
```

#### Terminal 2: Start React Frontend Dev Server
```bash
cd client
npm run dev
# Vite server starts on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 💾 How LocalStorage is Used (No Database)

All transactional and personal state is stored in the browser's `window.localStorage` under dedicated, namespaced keys:

| Storage Key | Content Description | Initialized From |
|---|---|---|
| `imovies_movies_v1` | Array of movies (titles, durations, cast, prices) | `initialMovies` (or Express API) |
| `imovies_theaters_v1`| Array of 3 theaters and their auditorium screens | `initialTheaters` |
| `imovies_shows_v1` | 7-day rolling scheduled showtimes | `generateClientShows()` |
| `imovies_bookings_v1`| Confirmed customer ticket reservations | Initial seed + user bookings |
| `imovies_users_v1` | Registered demo account profiles | `initialUsers` + registered users |
| `imovies_current_user_v1` | Active user session record | Alex Mercer (default) |

### Key Storage Behaviors:
- **Zero Server Database**: The backend does not connect to MongoDB, MySQL, or Firebase. It acts as a catalog service.
- **Persistence Across Refreshes**: Closing the tab, refreshing the page, or opening a new tab in the same browser keeps your bookings, active seat selections, and admin edits completely intact.
- **Seat Conflict Prevention**: When confirming a booking, the client verifies that the requested seats are not already recorded under another active booking in `imovies_bookings_v1`.
- **Cancellation & Re-availability**: Cancelling an active booking immediately changes its status to `cancelled` and frees up its seats for booking again.
- **Reset Demo Data**: Click **"Reset Data"** in the top navigation bar or the footer anytime to restore default movies, cinema venues, and pristine seed data.

---

## 👤 Demo Accounts

The application includes two pre-configured demonstration accounts accessible via the top navigation dropdown or login page:

### 1. Standard Customer Account
- **Name**: Alex Mercer
- **Email**: `alex@example.com`
- **Password**: `demo123` (or any 4+ character password in demo mode)
- **Role**: `user`
- **Capabilities**: Browse movies, pick showtimes, select seats, checkout, view personal tickets in "My Bookings", cancel bookings.

### 2. Cinema Administrator Account
- **Name**: Sarah Jenkins (Admin)
- **Email**: `admin@imovies.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Capabilities**: Access the **Admin Dashboard** (`/admin`), view financial metrics (gross revenue, confirmed vs cancelled), add new movies, edit existing movie metadata, delete movies, view all browser bookings.

> ⚠️ **Demo Auth Notice**: Authentication is strictly client-side for demonstration and project evaluation. No plaintext passwords or sensitive financial credentials are transmitted or stored insecurely.

---

## 📡 API Endpoint Reference (Express Backend)

The Express backend runs on `http://localhost:5000` and offers the following read-only RESTful endpoints:

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Returns backend status, mode, and uptime timestamp. |
| `GET` | `/api/config` | None | Returns cinema rules, seat limits (8), fees, and tier pricing. |
| `GET` | `/api/movies` | `search`, `genre`, `language`, `status` | List movies with optional query filtering. |
| `GET` | `/api/movies/:id` | `:id` (e.g. `mov-1`) | Fetch detailed movie profile. |
| `GET` | `/api/theaters` | None | List 3 cinema locations with screens & amenities. |
| `GET` | `/api/theaters/:id` | `:id` (e.g. `th-1`) | Get single theater details. |
| `GET` | `/api/shows` | `movieId`, `theaterId`, `date` | List showtimes filtered by movie, theater, or date. |
| `GET` | `/api/shows/:id` | `:id` (e.g. `show-1`) | Fetch show details with seat matrix layout. |

*A complete Postman collection is included in [`docs/imovies_postman_collection.json`](file:///c:/Users/hp/Desktop/collegeproject/docs/imovies_postman_collection.json).*

---

## 🧪 Testing Checklist & Verification

| # | Test Scenario | Expected Result | Status |
|---|---|---|---|
| 1 | **Home Page Load** | Spotlight hero banner, Now Showing grid, and upcoming releases render smoothly. | ✅ PASS |
| 2 | **Keyword Search** | Typing "Oppenheimer" or "Denis" filters the movie catalog in real-time. | ✅ PASS |
| 3 | **Genre Filtering** | Clicking "Sci-Fi" or "Action" filters grid to corresponding movies. | ✅ PASS |
| 4 | **Movie Details View** | Navigating to `/movies/mov-1` renders full synopsis, cast, director, and date tabs. | ✅ PASS |
| 5 | **Showtime Selection** | Switching dates displays corresponding auditorium screens and timeslots. | ✅ PASS |
| 6 | **Seat Selection Map** | Screen curvature glow, row letters (A-G), seat numbers (1-8), and tiered pricing render properly. | ✅ PASS |
| 7 | **Max Seat Limit** | Selecting more than 8 seats displays a non-intrusive warning alert. | ✅ PASS |
| 8 | **Checkout Flow** | Order summary computes subtotal, convenience fee, tax, and grand total correctly. | ✅ PASS |
| 9 | **Booking Confirmation** | Generates unique reference code (`IMV-XXXXXX`) and displays printable ticket voucher. | ✅ PASS |
| 10 | **Data Persistence** | Refreshing the page keeps confirmed bookings intact in `localStorage`. | ✅ PASS |
| 11 | **My Bookings Cancellation** | Cancelling a booking updates status to `cancelled` and immediately releases seats back to the show. | ✅ PASS |
| 12 | **Admin Catalog Management** | Adding or editing a movie from the Admin Dashboard reflects immediately in the catalog. | ✅ PASS |
| 13 | **Role-Based Protection** | Non-admins attempting to view `/admin` receive a permission warning with a 1-click switch button. | ✅ PASS |
| 14 | **Responsive Design** | Navigation bar, hero banner, seat map, and ticket cards adapt gracefully to mobile, tablet, and desktop viewports. | ✅ PASS |

---

## ⚠️ Limitations of Database-Free Architecture

1. **Local Browser Isolation**: Data saved in `localStorage` is scoped to the specific browser and machine where it was entered. Two different devices or two private/incognito windows will not share reservations.
2. **Client-Side Admin Security**: Administrative authorization is evaluated on the client. In a real-world production deployment, role checks and mutations must be enforced securely via backend JWT/session tokens with database verification.
3. **No Distributed Transactions**: Double-booking prevention works reliably within the current browser instance; simultaneous bookings across different computers cannot be synchronized without a centralized database or WebSocket server.

---

## 🔮 Future Improvements

If upgrading to a production system:
1. Integrate PostgreSQL with Prisma ORM for relational ACID transaction handling and row-level seat locking.
2. Implement WebSocket (Socket.io) for real-time seat lock broadcasting across concurrent users.
3. Integrate Stripe / Razorpay for live digital card payments and webhooks.
4. Add automated email confirmation with PDF ticket generation using Nodemailer.
