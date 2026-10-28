import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Nav, Tab, Card } from 'react-bootstrap';
import {
  Star, Clock, Calendar, Globe, Film, MapPin, Play, Armchair,
  Check, ArrowRight, ArrowLeft, AlertCircle, Sparkles
} from 'lucide-react';
import { movieApi, theaterApi, showApi } from '../services/api.js';
import { useBooking } from '../context/BookingContext.jsx';
import { getFallbackPoster } from '../data/initialData.js';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectMovie, selectShow } = useBooking();

  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState('');

  // Selection states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheaterId, setSelectedTheaterId] = useState('');
  const [selectedShowObj, setSelectedShowObj] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const movieData = await movieApi.getMovieById(id);
        if (!movieData) throw new Error('Movie not found');
        setMovie(movieData);
        setImgSrc(movieData.posterUrl);
        selectMovie(movieData);

        const [theatersData, showsData] = await Promise.all([
          theaterApi.getTheaters(),
          showApi.getShows({ movieId: id })
        ]);

        setTheaters(theatersData);
        setShows(showsData);

        // Pre-select first available date if shows exist
        if (showsData && showsData.length > 0) {
          const distinctDates = [...new Set(showsData.map(s => s.date))].sort();
          if (distinctDates.length > 0) {
            setSelectedDate(distinctDates[0]);
          }
        }
      } catch (err) {
        setError(err.message || 'Could not load movie details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <LoadingIndicator message="Loading movie details and showtimes..." fullPage />;
  }

  if (error || !movie) {
    return (
      <Container className="py-5" style={{ maxWidth: 650 }}>
        <ErrorMessage message={error || "Movie not found"} onRetry={() => window.location.reload()} />
        <div className="text-center mt-3">
          <Button as={Link} to="/movies" variant="outline-light" size="sm">
            <ArrowLeft size={16} className="me-1 inline" />
            Back to Movies
          </Button>
        </div>
      </Container>
    );
  }

  // Get unique dates available for this movie
  const availableDates = [...new Set(shows.map(s => s.date))].sort();

  // Shows filtered by selected date
  const showsForDate = shows.filter(s => s.date === selectedDate);

  // Group shows by theater
  const showsByTheater = theaters.map(th => {
    const theaterShows = showsForDate.filter(s => s.theaterId === th.id);
    return {
      theater: th,
      shows: theaterShows
    };
  }).filter(group => group.shows.length > 0);

  const handleShowSelection = (show) => {
    setSelectedShowObj(show);
    setSelectedTheaterId(show.theaterId);
  };

  const handleProceedToSeats = () => {
    if (!selectedShowObj) return;
    selectShow(selectedShowObj, movie);
    navigate(`/seat-selection/${selectedShowObj.id}`);
  };

  return (
    <div className="pb-5">
      {/* Movie Backdrop Header */}
      <div
        className="position-relative text-light py-5"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(11, 12, 16, 0.75) 0%, rgba(11, 12, 16, 0.98) 100%), url(${movie.backdropUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%'
        }}
      >
        <Container fluid="xl" className="py-4">
          <Row className="g-4 align-items-center">
            {/* Poster column */}
            <Col md={4} lg={3} className="text-center text-md-start">
              <img
                src={imgSrc}
                alt={movie.title}
                className="rounded-4 shadow-lg w-100 border border-secondary"
                style={{ maxHeight: 420, objectFit: 'cover', maxWidth: 300 }}
                onError={() => setImgSrc(getFallbackPoster(movie.title))}
              />
            </Col>

            {/* Movie Info column */}
            <Col md={8} lg={9}>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="rating-badge d-inline-flex align-items-center gap-1">
                  <Star size={14} className="fill-warning text-warning" />
                  <strong className="text-light">{movie.rating.toFixed(1)}</strong>
                  <span className="text-secondary small">/ 10 ({movie.votes ? movie.votes.toLocaleString() : '100+'} votes)</span>
                </span>
                <Badge bg="dark" className="border border-secondary text-light px-2 py-1">
                  {movie.certificate}
                </Badge>
                <Badge bg={movie.isUpcoming ? "warning" : "danger"} text={movie.isUpcoming ? "dark" : "white"}>
                  {movie.isUpcoming ? "Coming Soon" : "Now Showing"}
                </Badge>
              </div>

              <h1 className="display-5 fw-bold text-light mb-1">{movie.title}</h1>

              {movie.tagline && (
                <p className="text-warning fst-italic lead fs-6 mb-3">"{movie.tagline}"</p>
              )}

              {/* Badges strip */}
              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-3">
                <span className="d-flex align-items-center gap-1 text-light">
                  <Clock size={15} className="text-danger" />
                  {movie.duration} minutes ({Math.floor(movie.duration / 60)}h {movie.duration % 60}m)
                </span>
                <span className="d-flex align-items-center gap-1 text-light">
                  <Globe size={15} className="text-danger" />
                  {movie.language}
                </span>
                <span className="d-flex align-items-center gap-1 text-light">
                  <Calendar size={15} className="text-danger" />
                  Released: {movie.releaseDate}
                </span>
              </div>

              {/* Genre Pills */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {(movie.genres || []).map((g, i) => (
                  <Badge key={i} bg="secondary" className="px-3 py-2 text-light border border-secondary" style={{ fontSize: '0.8rem' }}>
                    {g}
                  </Badge>
                ))}
              </div>

              <p className="text-light-subtle mb-4" style={{ lineHeight: 1.7, maxWidth: 800 }}>
                {movie.synopsis}
              </p>

              {/* Cast & Director */}
              <div className="border-top border-secondary-subtle pt-3 text-secondary small">
                <div className="mb-1">
                  <strong className="text-light">Director:</strong> {movie.director}
                </div>
                <div>
                  <strong className="text-light">Starring Cast:</strong> {(movie.cast || []).join(', ')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 mt-4">
                {movie.trailerUrl && (
                  <Button
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-light"
                    size="sm"
                    className="d-flex align-items-center gap-2 px-3 py-2"
                  >
                    <Play size={16} className="text-danger fill-danger" />
                    Watch Official Trailer
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Showtime Selection Section */}
      <Container fluid="xl" className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary-subtle pb-3">
          <div>
            <h3 className="text-light fw-bold mb-1 d-flex align-items-center gap-2">
              <Calendar size={24} className="text-danger" />
              Select Date & Showtime
            </h3>
            <p className="text-secondary small mb-0">
              Select your preferred cinema venue and showtime to proceed to the seat reservation map.
            </p>
          </div>
        </div>

        {/* Date Selector Tabs */}
        {availableDates.length > 0 ? (
          <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4 custom-date-tabs">
            {availableDates.map(dateStr => {
              const d = new Date(dateStr + 'T00:00:00');
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setSelectedShowObj(null);
                  }}
                  className={`btn text-center px-4 py-2 rounded-3 border ${
                    isSelected ? 'btn-danger text-white shadow-sm' : 'btn-dark text-light border-secondary'
                  }`}
                  style={{ minWidth: 105 }}
                >
                  <div className="small text-uppercase opacity-75" style={{ fontSize: '0.75rem' }}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="fw-bold fs-5">
                    {d.getDate()}
                  </div>
                  <div className="small opacity-75" style={{ fontSize: '0.75rem' }}>
                    {d.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="alert alert-secondary py-3 text-center">
            No shows currently scheduled for this title. Please check back soon or browse other movies.
          </div>
        )}

        {/* Theaters & Showtime Badges */}
        {showsByTheater.length > 0 ? (
          <div className="d-flex flex-column gap-4">
            {showsByTheater.map(({ theater, shows }) => (
              <div key={theater.id} className="bg-dark border border-secondary-subtle rounded-4 p-4 shadow-sm">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom border-secondary">
                  <div>
                    <h5 className="text-light fw-bold mb-1 d-flex align-items-center gap-2">
                      <MapPin size={18} className="text-danger" />
                      {theater.name}
                    </h5>
                    <div className="text-secondary small">{theater.address} • {theater.phone}</div>
                  </div>

                  {/* Amenities */}
                  <div className="d-flex flex-wrap gap-1">
                    {(theater.facilities || []).slice(0, 3).map((f, i) => (
                      <span key={i} className="badge bg-secondary-subtle text-info border border-secondary" style={{ fontSize: '0.7rem' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes for this Theater */}
                <div className="d-flex flex-wrap align-items-center gap-3">
                  {shows.map(show => {
                    const isSelected = selectedShowObj?.id === show.id;
                    return (
                      <button
                        key={show.id}
                        type="button"
                        onClick={() => handleShowSelection(show)}
                        className={`btn p-3 text-start rounded-3 border transition-all ${
                          isSelected
                            ? 'btn-danger text-white shadow-lg'
                            : 'btn-dark text-light border-secondary hover-border-danger'
                        }`}
                        style={{ minWidth: 150 }}
                      >
                        <div className="fw-bold fs-6 d-flex align-items-center justify-content-between gap-2">
                          <span>{show.time}</span>
                          {isSelected && <Check size={16} />}
                        </div>
                        <div className="small opacity-75" style={{ fontSize: '0.75rem' }}>
                          {show.format || 'Standard'} • {show.screenName}
                        </div>
                        <div className="small text-warning mt-1 fw-semibold" style={{ fontSize: '0.8rem' }}>
                          From ${show.basePrice ? show.basePrice.toFixed(2) : '13.50'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-dark border border-secondary text-center py-4 text-secondary">
            No shows available on this selected date. Please pick a different date above.
          </div>
        )}

        {/* Sticky Continue Footer Bar when show is selected */}
        {selectedShowObj && (
          <div className="sticky-bottom bg-black border-top border-danger py-3 px-4 mt-5 rounded-4 shadow-lg d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="text-secondary small text-uppercase fw-bold d-block">Selected Show</span>
              <strong className="text-light fs-5">
                {selectedShowObj.theaterName} • {selectedShowObj.time} ({selectedShowObj.format})
              </strong>
              <div className="text-secondary small">Date: {selectedShowObj.date} • Screen: {selectedShowObj.screenName}</div>
            </div>

            <Button
              variant="danger"
              size="lg"
              onClick={handleProceedToSeats}
              className="btn-primary-imovies d-flex align-items-center gap-2 px-4 shadow"
            >
              <span>Select Seats</span>
              <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default MovieDetails;
