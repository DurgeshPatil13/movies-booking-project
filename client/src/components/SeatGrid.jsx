import React, { useState } from 'react';
import { Badge, Alert } from 'react-bootstrap';
import { Tv, Sparkles, Check, AlertCircle } from 'lucide-react';
import { getSeatLayout } from '../services/storage.js';

const SeatGrid = ({
  basePrice = 14,
  bookedSeatIds = [],
  selectedSeats = [],
  onToggleSeat,
  maxSeats = 8
}) => {
  const [warningMsg, setWarningMsg] = useState(null);
  const seats = getSeatLayout(basePrice);

  // Group seats by row
  const rowsMap = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = { tier: seat.tier, tierLabel: seat.tierLabel, items: [] };
    }
    acc[seat.row].items.push(seat);
    return acc;
  }, {});

  const handleSeatClick = (seat) => {
    setWarningMsg(null);
    if (bookedSeatIds.includes(seat.id)) return;

    const result = onToggleSeat(seat);
    if (result && !result.success && result.reason === 'MAX_LIMIT_REACHED') {
      setWarningMsg(`Maximum limit of ${maxSeats} seats reached per booking.`);
      setTimeout(() => setWarningMsg(null), 4000);
    }
  };

  return (
    <div className="w-100 py-3">
      {/* Screen Indicator */}
      <div className="cinema-screen-container">
        <div className="cinema-screen" />
        <div className="cinema-screen-text d-flex align-items-center justify-content-center gap-1">
          <Tv size={14} className="text-danger" />
          <span>CINEMA SCREEN THIS WAY</span>
        </div>
      </div>

      {/* Warning message if max seats hit */}
      {warningMsg && (
        <Alert variant="warning" className="py-2 small text-center mb-3 mx-auto" style={{ maxWidth: 450 }}>
          <AlertCircle size={15} className="me-1 inline" />
          {warningMsg}
        </Alert>
      )}

      {/* Seat Layout Rows */}
      <div className="d-flex flex-column align-items-center gap-1 my-4 overflow-x-auto pb-3">
        {Object.entries(rowsMap).map(([rowKey, rowData]) => {
          return (
            <div key={rowKey} className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <span className="row-label">{rowKey}</span>

              {/* Seats in this row */}
              <div className="d-flex align-items-center gap-2">
                {rowData.items.map((seat, index) => {
                  const isBooked = bookedSeatIds.includes(seat.id);
                  const isSelected = selectedSeats.some(s => s.id === seat.id);

                  let seatClass = "seat-btn ";
                  if (isBooked) {
                    seatClass += "seat-booked";
                  } else if (isSelected) {
                    seatClass += "seat-selected";
                  } else {
                    seatClass += "seat-available";
                    if (seat.tier === 'VIP') seatClass += " seat-vip";
                    if (seat.tier === 'Premium') seatClass += " seat-premium";
                  }

                  // Aisle gap after seat 4
                  const hasAisleGap = index === 3;

                  return (
                    <React.Fragment key={seat.id}>
                      <button
                        type="button"
                        disabled={isBooked}
                        onClick={() => handleSeatClick(seat)}
                        className={seatClass}
                        title={`${seat.id} (${seat.tierLabel}) - $${seat.price.toFixed(2)}${isBooked ? ' - Booked' : ''}`}
                        aria-label={`Seat ${seat.id}`}
                      >
                        {isSelected ? <Check size={14} /> : seat.number}
                      </button>
                      {hasAisleGap && <div style={{ width: 24 }} />}
                    </React.Fragment>
                  );
                })}
              </div>

              <span className="row-label">{rowKey}</span>
            </div>
          );
        })}
      </div>

      {/* Seating Legend */}
      <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 py-3 border-top border-secondary-subtle small text-secondary">
        <div className="d-flex align-items-center gap-2">
          <div className="seat-btn seat-available" style={{ width: 22, height: 22, fontSize: '0.65rem' }}>1</div>
          <span>Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-btn seat-selected" style={{ width: 22, height: 22, fontSize: '0.65rem' }}>
            <Check size={12} />
          </div>
          <span className="text-light fw-bold">Selected ({selectedSeats.length})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat-btn seat-booked" style={{ width: 22, height: 22, fontSize: '0.65rem' }}>X</div>
          <span>Booked</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-purple-subtle text-info border border-info" style={{ fontSize: '0.75rem' }}>VIP Recliners</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary-subtle text-primary border border-primary" style={{ fontSize: '0.75rem' }}>Premium Club</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
