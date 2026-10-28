import React, { useState } from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';
import { Ticket, Calendar, Clock, MapPin, XCircle, CheckCircle, Copy, Printer } from 'lucide-react';
import { getFallbackPoster } from '../data/initialData.js';

const BookingCard = ({ booking, onCancelBooking }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState(booking.moviePoster);

  const isCancelled = booking.status === 'cancelled';

  const copyRef = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    if (onCancelBooking) {
      onCancelBooking(booking.id);
    }
  };

  return (
    <>
      <div className={`ticket-stub p-4 mb-4 ${isCancelled ? 'opacity-75' : ''}`}>
        <div className="row g-4 align-items-center">
          {/* Movie Thumbnail */}
          <div className="col-md-2 col-4 text-center">
            <img
              src={imgSrc || getFallbackPoster(booking.movieTitle)}
              alt={booking.movieTitle}
              className="rounded-3 shadow w-100"
              style={{ maxHeight: 150, objectFit: 'cover' }}
              onError={() => setImgSrc(getFallbackPoster(booking.movieTitle))}
            />
          </div>

          {/* Ticket Information */}
          <div className="col-md-6 col-8">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="text-secondary small">REF:</span>
              <strong className="text-danger font-monospace fs-6">{booking.bookingReference}</strong>
              <button
                type="button"
                className="btn btn-sm btn-link text-secondary p-0"
                onClick={copyRef}
                title="Copy reference code"
              >
                <Copy size={13} />
              </button>
              {copied && <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>Copied</span>}

              {isCancelled ? (
                <Badge bg="danger" className="ms-auto d-flex align-items-center gap-1">
                  <XCircle size={12} /> CANCELLED
                </Badge>
              ) : (
                <Badge bg="success" className="ms-auto d-flex align-items-center gap-1">
                  <CheckCircle size={12} /> CONFIRMED
                </Badge>
              )}
            </div>

            <h4 className="text-light fw-bold mb-2">{booking.movieTitle}</h4>

            <div className="d-flex flex-column gap-1 text-secondary small mb-3">
              <div className="d-flex align-items-center gap-2 text-light">
                <MapPin size={14} className="text-danger flex-shrink-0" />
                <span>{booking.theaterName} ({booking.screenName || 'Screen 1'})</span>
                {booking.format && (
                  <Badge bg="dark" className="border border-secondary text-info ms-1">
                    {booking.format}
                  </Badge>
                )}
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-danger" />
                  {booking.date}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Clock size={14} className="text-danger" />
                  {booking.time}
                </span>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="text-secondary small">Seats:</span>
              {(booking.seatLabels || []).map(seatId => (
                <span key={seatId} className="badge bg-dark border border-secondary text-warning px-2 py-1">
                  {seatId}
                </span>
              ))}
              <span className="text-secondary small ms-2">({booking.ticketCount} ticket{booking.ticketCount > 1 ? 's' : ''})</span>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="col-md-4 col-12 border-start-md border-secondary-subtle pt-3 pt-md-0 d-flex flex-column justify-content-between">
            <div className="mb-3 text-md-end">
              <span className="text-secondary small d-block">Total Paid</span>
              <div className="fs-3 fw-bold text-light">
                ${Number(booking.totalAmount).toFixed(2)}
              </div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                Via {booking.paymentMethod || 'Demo Payment'}
              </span>
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => window.print()}
                className="d-flex align-items-center gap-1"
              >
                <Printer size={14} />
                Print
              </Button>

              {!isCancelled && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowCancelModal(true)}
                  className="d-flex align-items-center gap-1"
                >
                  <XCircle size={14} />
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="h5 text-danger d-flex align-items-center gap-2">
            <XCircle size={18} />
            Cancel This Ticket Booking?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          <p>
            Are you sure you want to cancel booking <strong className="text-light">{booking.bookingReference}</strong> for <strong className="text-light">{booking.movieTitle}</strong>?
          </p>
          <p className="mb-0">
            Cancelling will release seats <strong className="text-warning">{(booking.seatLabels || []).join(', ')}</strong> back to the available seat inventory in your local browser state.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-secondary" size="sm" onClick={() => setShowCancelModal(false)}>
            Keep Booking
          </Button>
          <Button variant="danger" size="sm" onClick={confirmCancel}>
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookingCard;
