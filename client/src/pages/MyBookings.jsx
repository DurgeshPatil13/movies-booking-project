import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Alert, Badge, Form } from 'react-bootstrap';
import {
  Ticket, Film, CheckCircle, XCircle, RotateCcw,
  AlertCircle, ArrowRight
} from 'lucide-react';
import BookingCard from '../components/BookingCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { getUserBookings } from '../services/storage.js';

const MyBookings = () => {
  const { user } = useAuth();
  const { handleCancelBooking } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionAlert, setActionAlert] = useState(null);

  const loadUserBookings = () => {
    if (user) {
      const userList = getUserBookings(user.id);
      setBookings(userList);
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    loadUserBookings();
  }, [user]);

  const onCancel = (bookingId) => {
    try {
      handleCancelBooking(bookingId);
      loadUserBookings();
      setActionAlert({
        type: 'success',
        text: 'Booking has been successfully cancelled and your reserved seats have been released back to availability!'
      });
      setTimeout(() => setActionAlert(null), 5000);
    } catch (err) {
      setActionAlert({
        type: 'danger',
        text: err.message || 'Failed to cancel booking'
      });
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <Container fluid="xl" className="py-4 pb-5" style={{ maxWidth: 950 }}>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 border-bottom border-secondary-subtle pb-3">
        <div>
          <h1 className="text-light fw-bold mb-1 d-flex align-items-center gap-2">
            <Ticket size={28} className="text-danger" />
            My Ticket Reservations
          </h1>
          <p className="text-secondary small mb-0">
            Tickets booked under demo profile: <strong className="text-light">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        {/* Filter by status */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-secondary small">Filter:</span>
          <Form.Select
            size="sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-dark text-light border-secondary"
            style={{ width: 140 }}
          >
            <option value="all">All ({bookings.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionAlert && (
        <Alert
          variant={actionAlert.type}
          dismissible
          onClose={() => setActionAlert(null)}
          className="small py-3 mb-4 shadow"
        >
          {actionAlert.text}
        </Alert>
      )}

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {filteredBookings.map(b => (
            <BookingCard
              key={b.id || b.bookingReference}
              booking={b}
              onCancelBooking={onCancel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-5 bg-dark border border-secondary rounded-4 shadow my-4">
          <Ticket size={56} className="text-secondary mb-3 opacity-40" />
          <h3 className="text-light fw-bold mb-2">No Bookings Found</h3>
          <p className="text-secondary small max-w-md mx-auto mb-4">
            {filterStatus === 'all'
              ? "You haven't reserved any cinema tickets yet in this browser session. Browse our now showing catalog to get started."
              : `You have no ${filterStatus} bookings.`}
          </p>
          <Button as={Link} to="/movies" variant="danger" className="btn-primary-imovies d-inline-flex align-items-center gap-2">
            <Film size={18} />
            <span>Browse Now Showing</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </Container>
  );
};

export default MyBookings;
