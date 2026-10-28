import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import {
  CheckCircle2, Ticket, Calendar, Clock, MapPin, Printer,
  ArrowRight, Film, Download, Share2, Sparkles, AlertCircle
} from 'lucide-react';
import { getStoredBookings } from '../services/storage.js';
import { useBooking } from '../context/BookingContext.jsx';
import { getFallbackPoster } from '../data/initialData.js';

const BookingConfirmation = () => {
  const { refId } = useParams();
  const { lastConfirmedBooking } = useBooking();
  const [booking, setBooking] = useState(lastConfirmedBooking || null);

  useEffect(() => {
    if (!booking) {
      const all = getStoredBookings();
      const match = all.find(b => b.bookingReference === refId || b.id === refId);
      if (match) {
        setBooking(match);
      }
    }
  }, [refId, booking]);

  if (!booking) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: 600 }}>
        <div className="p-5 bg-dark border border-secondary rounded-4 shadow">
          <AlertCircle size={48} className="text-warning mb-3" />
          <h3 className="text-light fw-bold">Booking Record Not Found</h3>
          <p className="text-secondary small mb-4">
            Could not locate a booking with reference code: <strong className="text-light">{refId}</strong>.
          </p>
          <Button as={Link} to="/my-bookings" variant="danger" className="btn-primary-imovies">
            Go to My Bookings
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5 pb-5" style={{ maxWidth: 850 }}>
      {/* Success Banner */}
      <div className="text-center mb-5">
        <div className="rounded-circle bg-success bg-opacity-25 text-success d-inline-flex p-3 mb-3 shadow">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="display-6 fw-bold text-light mb-2">Booking Confirmed!</h1>
        <p className="text-secondary small max-w-md mx-auto mb-2">
          Your cinema seats have been successfully reserved and saved to your browser's local state.
        </p>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <span className="text-secondary small">Booking Reference:</span>
          <Badge bg="danger" className="font-monospace fs-6 px-3 py-1">
            {booking.bookingReference}
          </Badge>
        </div>
      </div>

      {/* Printable Digital Cinema Ticket Stub */}
      <div className="ticket-stub p-4 p-md-5 mb-5 shadow-lg border border-secondary">
        <Row className="g-4 align-items-center">
          {/* Movie Poster */}
          <Col md={4} className="text-center">
            <img
              src={booking.moviePoster || getFallbackPoster(booking.movieTitle)}
              alt={booking.movieTitle}
              className="rounded-4 shadow-lg w-100"
              style={{ maxHeight: 280, objectFit: 'cover', maxWidth: 220 }}
              onError={(e) => { e.target.src = getFallbackPoster(booking.movieTitle); }}
            />
          </Col>

          {/* Ticket Information */}
          <Col md={8}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <Badge bg="success" className="d-flex align-items-center gap-1 py-1 px-2">
                <CheckCircle2 size={13} /> CONFIRMED TICKET
              </Badge>
              <span className="text-secondary small font-monospace">
                REF: {booking.bookingReference}
              </span>
            </div>

            <h2 className="text-light fw-bold mb-3">{booking.movieTitle}</h2>

            <div className="d-flex flex-column gap-2 text-secondary small mb-4">
              <div className="d-flex align-items-center gap-2 text-light">
                <MapPin size={16} className="text-danger flex-shrink-0" />
                <span className="fw-semibold">{booking.theaterName}</span>
                {booking.format && (
                  <Badge bg="dark" className="border border-secondary text-info ms-1">
                    {booking.format}
                  </Badge>
                )}
              </div>

              <div className="d-flex flex-wrap gap-4 text-light">
                <span className="d-flex align-items-center gap-1">
                  <Calendar size={15} className="text-danger" />
                  {booking.date}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Clock size={15} className="text-danger" />
                  {booking.time}
                </span>
                <span>
                  Auditorium: <strong>{booking.screenName || 'Screen 1'}</strong>
                </span>
              </div>
            </div>

            {/* Seat & Price Breakdown Badges */}
            <div className="p-3 bg-black rounded-3 border border-secondary-subtle mb-4">
              <div className="row g-2 align-items-center text-center">
                <div className="col-4">
                  <span className="text-secondary small d-block">Seats</span>
                  <div className="fw-bold text-warning fs-6">
                    {(booking.seatLabels || []).join(', ')}
                  </div>
                </div>
                <div className="col-4 border-start border-end border-secondary">
                  <span className="text-secondary small d-block">Tickets</span>
                  <div className="fw-bold text-light fs-6">
                    {booking.ticketCount}
                  </div>
                </div>
                <div className="col-4">
                  <span className="text-secondary small d-block">Total Paid</span>
                  <div className="fw-bold text-success fs-6">
                    ${Number(booking.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code / Barcode Simulation */}
            <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary">
              <div className="small text-secondary">
                <div>Holder: <strong className="text-light">{booking.userName || 'Guest User'}</strong></div>
                <div style={{ fontSize: '0.75rem' }}>Booked via: {booking.paymentMethod}</div>
              </div>
              <div className="text-end">
                <div
                  className="bg-light p-2 rounded text-dark font-monospace fw-bold small text-center"
                  style={{ letterSpacing: '0.2em', fontSize: '0.7rem' }}
                >
                  ||| | |||| | ||| |||| |
                </div>
                <span className="text-secondary" style={{ fontSize: '0.65rem' }}>SCAN AT ADMISSION</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Action Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-3">
        <Button
          variant="outline-light"
          onClick={() => window.print()}
          className="d-flex align-items-center gap-2 px-4 py-2"
        >
          <Printer size={16} />
          Print Ticket Voucher
        </Button>

        <Button
          as={Link}
          to="/my-bookings"
          variant="danger"
          className="btn-primary-imovies d-flex align-items-center gap-2 px-4 py-2 shadow"
        >
          <Ticket size={16} />
          View All My Bookings
        </Button>

        <Button
          as={Link}
          to="/movies"
          variant="outline-secondary"
          className="d-flex align-items-center gap-2 px-4 py-2 text-light"
        >
          <Film size={16} />
          Book Another Movie
        </Button>
      </div>
    </Container>
  );
};

export default BookingConfirmation;
