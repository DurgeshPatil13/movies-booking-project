import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getBookedSeatsForShow,
  createBooking,
  cancelBooking,
  getUserBookings,
  getStoredBookings
} from '../services/storage.js';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);

  const MAX_SEATS = 8;
  const CONVENIENCE_FEE_PER_TICKET = 1.75;
  const TAX_PERCENTAGE = 0.05;

  // When selectedShow changes, refresh the already booked seats for that show
  useEffect(() => {
    if (selectedShow) {
      const booked = getBookedSeatsForShow(selectedShow.id);
      setBookedSeats(booked);
      // Clean up any previously selected seats that might now be booked
      setSelectedSeats(prev => prev.filter(s => !booked.includes(s.id)));
    } else {
      setBookedSeats([]);
      setSelectedSeats([]);
    }
  }, [selectedShow]);

  const selectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const selectShow = (show, movie = null) => {
    setSelectedShow(show);
    if (movie) setSelectedMovie(movie);
    if (show) {
      setSelectedDate(show.date);
    }
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat.id)) {
      return { success: false, reason: 'ALREADY_BOOKED' };
    }

    const isSelected = selectedSeats.some(s => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      return { success: true, action: 'REMOVED' };
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        return { success: false, reason: 'MAX_LIMIT_REACHED' };
      }
      setSelectedSeats(prev => [...prev, seat]);
      return { success: true, action: 'ADDED' };
    }
  };

  const clearSelection = () => {
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedDate(null);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  const refreshShowSeats = (showId) => {
    if (!showId) return;
    const booked = getBookedSeatsForShow(showId);
    setBookedSeats(booked);
  };

  // Pricing calculations
  const subtotal = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0);
  const convenienceFee = selectedSeats.length > 0 ? Number((selectedSeats.length * CONVENIENCE_FEE_PER_TICKET).toFixed(2)) : 0;
  const tax = selectedSeats.length > 0 ? Number(((subtotal + convenienceFee) * TAX_PERCENTAGE).toFixed(2)) : 0;
  const totalAmount = Number((subtotal + convenienceFee + tax).toFixed(2));

  // Confirm booking
  const confirmBooking = (paymentMethod = 'Demo Card Payment', currentUser) => {
    if (!selectedShow) throw new Error('No show selected.');
    if (selectedSeats.length === 0) throw new Error('Please select at least 1 seat.');

    const bookingPayload = {
      showId: selectedShow.id,
      movieId: selectedShow.movieId || selectedMovie?.id,
      movieTitle: selectedShow.movieTitle || selectedMovie?.title,
      moviePoster: selectedShow.moviePoster || selectedMovie?.posterUrl,
      theaterId: selectedShow.theaterId,
      theaterName: selectedShow.theaterName,
      screenName: selectedShow.screenName,
      format: selectedShow.format,
      date: selectedShow.date,
      time: selectedShow.time,
      seats: selectedSeats,
      seatLabels: selectedSeats.map(s => s.id),
      ticketCount: selectedSeats.length,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentMethod,
      user: currentUser
    };

    const newBooking = createBooking(bookingPayload);
    setLastConfirmedBooking(newBooking);
    refreshShowSeats(selectedShow.id);
    setSelectedSeats([]);
    return newBooking;
  };

  const handleCancelBooking = (bookingId) => {
    const cancelled = cancelBooking(bookingId);
    if (selectedShow && selectedShow.id === cancelled.showId) {
      refreshShowSeats(selectedShow.id);
    }
    return cancelled;
  };

  const value = {
    selectedMovie,
    selectedTheater,
    selectedDate,
    selectedShow,
    selectedSeats,
    bookedSeats,
    lastConfirmedBooking,
    maxSeats: MAX_SEATS,
    subtotal,
    convenienceFee,
    tax,
    totalAmount,
    selectMovie,
    selectShow,
    toggleSeat,
    clearSelection,
    refreshShowSeats,
    confirmBooking,
    handleCancelBooking,
    getUserBookings,
    getAllBookings: getStoredBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
