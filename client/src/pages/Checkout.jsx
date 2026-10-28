import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import {
  CreditCard, CheckCircle, ArrowLeft, ShieldCheck, Ticket,
  MapPin, Calendar, Clock, AlertTriangle, Building2, QrCode
} from 'lucide-react';
import { useBooking } from '../context/BookingContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getFallbackPoster } from '../data/initialData.js';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedMovie,
    selectedShow,
    selectedSeats,
    subtotal,
    convenienceFee,
    tax,
    totalAmount,
    confirmBooking
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('demo-card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form states for demo card simulation
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Mercer');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Guard: if user lands here without selecting show or seats, redirect back
  if (!selectedShow || selectedSeats.length === 0) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: 600 }}>
        <div className="p-5 bg-dark border border-secondary rounded-4 shadow">
          <Ticket size={48} className="text-secondary mb-3 opacity-50" />
          <h3 className="text-light fw-bold">No Active Ticket Selection</h3>
          <p className="text-secondary small mb-4">
            You do not have any active seats selected for checkout. Please browse movies and pick a showtime first.
          </p>
          <Button as={Link} to="/movies" variant="danger" className="btn-primary-imovies">
            Browse Movies
          </Button>
        </div>
      </Container>
    );
  }

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const paymentLabel = paymentMethod === 'demo-card'
        ? 'Demo Card Payment'
        : paymentMethod === 'counter'
        ? 'Pay at Cinema Box Office Counter'
        : 'Demo UPI / Digital Wallet';

      const booking = confirmBooking(paymentLabel, user);
      // Small simulated delay for realistic feel
      setTimeout(() => {
        setIsSubmitting(false);
        navigate(`/booking-confirmation/${booking.bookingReference}`);
      }, 700);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to complete booking confirmation.');
    }
  };

  return (
    <Container fluid="xl" className="py-4 pb-5">
      {/* Step Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <Button
          as={Link}
          to={`/seat-selection/${selectedShow.id}`}
          variant="outline-secondary"
          size="sm"
          className="d-flex align-items-center gap-1 text-light border-secondary"
        >
          <ArrowLeft size={16} />
          Back to Seat Map
        </Button>

        <Badge bg="danger" className="text-uppercase py-1 px-2">
          Step 3 of 3: Checkout & Confirmation
        </Badge>
      </div>

      <Row className="g-4">
        {/* Left Column: Order Summary & Review */}
        <Col lg={7}>
          <div className="bg-dark border border-secondary-subtle rounded-4 p-4 shadow-sm mb-4">
            <h4 className="text-light fw-bold mb-4 d-flex align-items-center gap-2">
              <Ticket size={22} className="text-danger" />
              Review Booking Summary
            </h4>

            {/* Movie Info card */}
            <div className="d-flex gap-3 p-3 bg-black rounded-3 border border-secondary-subtle mb-4">
              <img
                src={selectedShow.moviePoster || selectedMovie?.posterUrl || getFallbackPoster(selectedShow.movieTitle)}
                alt={selectedShow.movieTitle}
                className="rounded-3 shadow"
                style={{ width: 80, height: 110, objectFit: 'cover' }}
                onError={(e) => { e.target.src = getFallbackPoster(selectedShow.movieTitle); }}
              />
              <div className="d-flex flex-column justify-content-center">
                <h5 className="text-light fw-bold mb-1">{selectedShow.movieTitle}</h5>
                <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                  <MapPin size={14} className="text-danger flex-shrink-0" />
                  <span>{selectedShow.theaterName}</span>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small">
                  <span className="d-flex align-items-center gap-1">
                    <Calendar size={13} className="text-danger" />
                    {selectedShow.date}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <Clock size={13} className="text-danger" />
                    {selectedShow.time}
                  </span>
                  <Badge bg="dark" className="border border-secondary text-info">
                    {selectedShow.format} • {selectedShow.screenName}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Selected Seats Table */}
            <div className="mb-4">
              <h6 className="text-light fw-bold mb-2">Reserved Seat Details</h6>
              <div className="table-responsive">
                <table className="table table-dark table-borderless small mb-0">
                  <thead className="border-bottom border-secondary text-secondary">
                    <tr>
                      <th>Seat #</th>
                      <th>Category / Tier</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSeats.map(seat => (
                      <tr key={seat.id} className="border-bottom border-secondary-subtle">
                        <td className="fw-bold text-danger">{seat.id}</td>
                        <td className="text-light">{seat.tierLabel || seat.tier}</td>
                        <td className="text-end text-light">${Number(seat.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demo Notice Banner */}
            <Alert variant="warning" className="small bg-dark border-warning-subtle text-light mb-0">
              <div className="d-flex gap-2">
                <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-1" />
                <div>
                  <strong>College Demonstration Environment</strong>
                  <div className="text-secondary mt-1">
                    No real transactions take place. Confirming this order writes the ticket record into your browser's local storage and reserves your selected seats.
                  </div>
                </div>
              </div>
            </Alert>
          </div>
        </Col>

        {/* Right Column: Demo Payment Method & Order Total */}
        <Col lg={5}>
          <div className="bg-dark border border-secondary-subtle rounded-4 p-4 shadow-sm">
            <h4 className="text-light fw-bold mb-3 d-flex align-items-center gap-2">
              <CreditCard size={22} className="text-danger" />
              Demo Payment Method
            </h4>

            {errorMsg && (
              <Alert variant="danger" className="py-2 small mb-3">
                {errorMsg}
              </Alert>
            )}

            <Form onSubmit={handleConfirmOrder}>
              {/* Payment Method Selector */}
              <div className="d-flex flex-column gap-2 mb-4">
                <div
                  className={`p-3 rounded-3 border cursor-pointer ${
                    paymentMethod === 'demo-card' ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary bg-black'
                  }`}
                  onClick={() => setPaymentMethod('demo-card')}
                >
                  <Form.Check
                    type="radio"
                    id="method-card"
                    name="paymentMethod"
                    checked={paymentMethod === 'demo-card'}
                    onChange={() => setPaymentMethod('demo-card')}
                    label={
                      <div className="ms-2">
                        <strong className="text-light d-block">Demo Card Simulation</strong>
                        <span className="text-secondary small">Pre-filled sandbox card details (Instant)</span>
                      </div>
                    }
                  />
                </div>

                <div
                  className={`p-3 rounded-3 border cursor-pointer ${
                    paymentMethod === 'counter' ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary bg-black'
                  }`}
                  onClick={() => setPaymentMethod('counter')}
                >
                  <Form.Check
                    type="radio"
                    id="method-counter"
                    name="paymentMethod"
                    checked={paymentMethod === 'counter'}
                    onChange={() => setPaymentMethod('counter')}
                    label={
                      <div className="ms-2">
                        <strong className="text-light d-block">Pay at Box Office Counter</strong>
                        <span className="text-secondary small">Collect and pay in cash/card at theater</span>
                      </div>
                    }
                  />
                </div>

                <div
                  className={`p-3 rounded-3 border cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary bg-black'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <Form.Check
                    type="radio"
                    id="method-upi"
                    name="paymentMethod"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    label={
                      <div className="ms-2">
                        <strong className="text-light d-block">Demo Digital Wallet / QR</strong>
                        <span className="text-secondary small">Instant simulated UPI wallet transfer</span>
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Demo Card Fields (Pre-filled) */}
              {paymentMethod === 'demo-card' && (
                <div className="bg-black p-3 rounded-3 border border-secondary mb-4 small">
                  <Form.Group className="mb-2">
                    <Form.Label className="text-secondary mb-1">Cardholder Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="bg-dark text-light border-secondary form-control-sm"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="text-secondary mb-1">Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={cardNumber}
                      disabled
                      className="bg-dark text-light border-secondary form-control-sm"
                    />
                  </Form.Group>
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Label className="text-secondary mb-1">Expires</Form.Label>
                      <Form.Control
                        type="text"
                        value={cardExpiry}
                        disabled
                        className="bg-dark text-light border-secondary form-control-sm"
                      />
                    </Col>
                    <Col xs={6}>
                      <Form.Label className="text-secondary mb-1">CVV</Form.Label>
                      <Form.Control
                        type="password"
                        value={cardCvv}
                        disabled
                        className="bg-dark text-light border-secondary form-control-sm"
                      />
                    </Col>
                  </Row>
                </div>
              )}

              {/* Price Calculation Block */}
              <div className="border-top border-secondary pt-3 mb-4 text-secondary small">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tickets ({selectedSeats.length})</span>
                  <span className="text-light">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Convenience Fee</span>
                  <span className="text-light">${convenienceFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Taxes (5%)</span>
                  <span className="text-light">${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary text-light">
                  <span className="fw-bold fs-5">Final Total</span>
                  <span className="fs-3 fw-extrabold text-danger">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirm Booking Button */}
              <Button
                type="submit"
                variant="danger"
                size="lg"
                disabled={isSubmitting}
                className="w-100 btn-primary-imovies d-flex align-items-center justify-content-center gap-2 py-3 shadow"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm text-light" role="status" />
                    <span>Reserving Seats in Local Storage...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Confirm Booking (${totalAmount.toFixed(2)})</span>
                  </>
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
