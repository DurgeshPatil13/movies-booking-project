import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import {
  Film, MapPin, Calendar, Clock, ArrowRight, ArrowLeft,
  AlertCircle, ShieldCheck, Ticket
} from 'lucide-react';
import SeatGrid from '../components/SeatGrid.jsx';
import { showApi, movieApi } from '../services/api.js';
import { useBooking } from '../context/BookingContext.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getFallbackPoster } from '../data/initialData.js';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const {
    selectedShow,
    selectedMovie,
    selectedSeats,
    bookedSeats,
    toggleSeat,
    subtotal,
    convenienceFee,
    tax,
    totalAmount,
    maxSeats,
    selectShow,
    selectMovie
  } = useBooking();

  const [loading, setLoading] = useState(!selectedShow || selectedShow.id !== showId);
  const [error, setError] = useState(null);

  // Load show if user navigated directly or refreshed the page
  useEffect(() => {
    const loadShowData = async () => {
      if (selectedShow && selectedShow.id === showId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const show = await showApi.getShowById(showId);
        if (!show) throw new Error('Showtime not found');

        const movie = await movieApi.getMovieById(show.movieId);
        selectMovie(movie);
        selectShow(show, movie);
      } catch (err) {
        setError(err.message || 'Could not load show details');
      } finally {
        setLoading(false);
      }
    };

    loadShowData();
  }, [showId]);

  if (loading) {
    return <LoadingIndicator message="Configuring theater auditorium layout..." fullPage />;
  }

  if (error || !selectedShow) {
    return (
      <Container className="py-5" style={{ maxWidth: 650 }}>
        <ErrorMessage message={error || "Show details could not be found."} onRetry={() => window.location.reload()} />
        <div className="text-center mt-3">
          <Button as={Link} to="/movies" variant="outline-light" size="sm">
            <ArrowLeft size={16} className="me-1 inline" />
            Back to Movies
          </Button>
        </div>
      </Container>
    );
  }

  const currentMovie = selectedMovie || {
    title: selectedShow.movieTitle,
    posterUrl: selectedShow.moviePoster
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;
    navigate('/checkout');
  };

  return (
    <Container fluid="xl" className="py-4 pb-5">
      {/* Breadcrumb Navigation & Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <Button
          as={Link}
          to={`/movies/${selectedShow.movieId}`}
          variant="outline-secondary"
          size="sm"
          className="d-flex align-items-center gap-1 text-light border-secondary"
        >
          <ArrowLeft size={16} />
          Change Showtime
        </Button>

        <div className="text-end">
          <Badge bg="danger" className="text-uppercase py-1 px-2">
            Step 2 of 3: Seat Selection
          </Badge>
        </div>
      </div>

      <Row className="g-4">
        {/* Left Side: Seat Map & Screen */}
        <Col lg={8}>
          <div className="bg-dark border border-secondary-subtle rounded-4 p-4 shadow-sm text-center">
            <div className="mb-3">
              <h4 className="text-light fw-bold mb-1">Select Your Seats</h4>
              <p className="text-secondary small mb-0">
                You can select up to <strong className="text-light">{maxSeats} seats</strong> per booking. Click a seat to select or unselect.
              </p>
            </div>

            {/* Interactive Seat Matrix */}
            <SeatGrid
              basePrice={selectedShow.basePrice || 14}
              bookedSeatIds={bookedSeats}
              selectedSeats={selectedSeats}
              onToggleSeat={toggleSeat}
              maxSeats={maxSeats}
            />
          </div>
        </Col>

        {/* Right Side: Booking Summary & Live Price Card */}
        <Col lg={4}>
          <div className="bg-dark border border-secondary-subtle rounded-4 p-4 shadow-sm position-sticky" style={{ top: '5rem' }}>
            {/* Show Overview */}
            <div className="d-flex gap-3 mb-4 pb-3 border-bottom border-secondary">
              <img
                src={currentMovie.posterUrl || getFallbackPoster(currentMovie.title)}
                alt={currentMovie.title}
                className="rounded-3 shadow"
                style={{ width: 70, height: 95, objectFit: 'cover' }}
                onError={(e) => { e.target.src = getFallbackPoster(currentMovie.title); }}
              />
              <div className="d-flex flex-column justify-content-center">
                <h5 className="text-light fw-bold mb-1 text-truncate" style={{ maxWidth: 220 }} title={currentMovie.title}>
                  {currentMovie.title}
                </h5>
                <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                  <MapPin size={13} className="text-danger flex-shrink-0" />
                  <span className="text-truncate">{selectedShow.theaterName}</span>
                </div>
                <div className="d-flex align-items-center gap-2 small text-secondary">
                  <Badge bg="dark" className="border border-secondary text-info">
                    {selectedShow.format}
                  </Badge>
                  <span>{selectedShow.screenName}</span>
                </div>
              </div>
            </div>

            {/* Date & Time pills */}
            <div className="bg-black rounded-3 p-3 mb-4 border border-secondary-subtle d-flex justify-content-between text-center">
              <div>
                <span className="text-secondary small d-block">Date</span>
                <strong className="text-light">{selectedShow.date}</strong>
              </div>
              <div className="border-end border-secondary" />
              <div>
                <span className="text-secondary small d-block">Showtime</span>
                <strong className="text-danger">{selectedShow.time}</strong>
              </div>
            </div>

            {/* Selected Seats Badges */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>
                  Chosen Seats ({selectedSeats.length}/{maxSeats})
                </span>
                {selectedSeats.length > 0 && (
                  <span className="text-warning small fw-bold">
                    {selectedSeats.map(s => s.id).join(', ')}
                  </span>
                )}
              </div>

              {selectedSeats.length === 0 ? (
                <div className="text-secondary small fst-italic p-3 text-center bg-black rounded-3 border border-secondary-subtle">
                  No seats selected yet. Please click on available seats on the seating map.
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map(seat => (
                    <Badge
                      key={seat.id}
                      bg="danger"
                      className="d-flex align-items-center gap-1 py-2 px-3 fw-medium"
                    >
                      <span>{seat.id}</span>
                      <span className="opacity-75 small">(${Number(seat.price).toFixed(2)})</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            {selectedSeats.length > 0 && (
              <div className="border-top border-secondary pt-3 mb-4 small text-secondary">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tickets Subtotal</span>
                  <span className="text-light">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Online Convenience Fee</span>
                  <span className="text-light">${convenienceFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Estimated Tax (5%)</span>
                  <span className="text-light">${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary text-light">
                  <span className="fw-bold fs-6">Grand Total</span>
                  <span className="fs-4 fw-extrabold text-danger">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            <Button
              variant="danger"
              size="lg"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToCheckout}
              className="w-100 btn-primary-imovies d-flex align-items-center justify-content-center gap-2 py-3 shadow"
            >
              <Ticket size={18} />
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Button>

            <div className="text-center mt-3 small text-secondary d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '0.75rem' }}>
              <ShieldCheck size={14} className="text-success" />
              <span>Free instant cancellation available anytime</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SeatSelection;
