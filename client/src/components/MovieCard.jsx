import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button } from 'react-bootstrap';
import { Star, Clock, Ticket, Calendar, Play } from 'lucide-react';
import { getFallbackPoster } from '../data/initialData.js';

const MovieCard = ({ movie }) => {
  const [imgSrc, setImgSrc] = useState(movie.posterUrl);

  const handleImageError = () => {
    setImgSrc(getFallbackPoster(movie.title));
  };

  return (
    <div className="movie-card">
      {/* Poster Container */}
      <div className="movie-poster-wrap">
        <img
          src={imgSrc}
          alt={movie.title}
          className="movie-poster-img"
          onError={handleImageError}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center">
          <span className="rating-badge d-flex align-items-center gap-1 shadow">
            <Star size={13} className="fill-warning text-warning" />
            <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
          </span>

          <Badge bg="dark" className="border border-secondary text-light px-2 py-1 small">
            {movie.certificate || 'PG-13'}
          </Badge>
        </div>

        {/* Upcoming or Format Badge */}
        <div className="position-absolute bottom-0 start-0 p-3">
          {movie.isUpcoming ? (
            <Badge bg="warning" text="dark" className="fw-bold px-2 py-1">
              Upcoming
            </Badge>
          ) : (
            <Badge bg="danger" className="fw-bold px-2 py-1">
              Now Showing
            </Badge>
          )}
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <div className="d-flex align-items-center justify-content-between text-secondary small mb-1">
            <span className="d-flex align-items-center gap-1">
              <Clock size={13} />
              {movie.duration}m
            </span>
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              {movie.language}
            </span>
          </div>

          <h5 className="text-light fw-bold mb-2 text-truncate" title={movie.title}>
            {movie.title}
          </h5>

          {/* Genre Badges */}
          <div className="d-flex flex-wrap gap-1 mb-3">
            {(movie.genres || []).slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className="badge bg-secondary-subtle text-light border border-secondary"
                style={{ fontSize: '0.7rem', fontWeight: 500 }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 border-top border-secondary-subtle d-flex align-items-center gap-2">
          <Button
            as={Link}
            to={`/movies/${movie.id}`}
            variant="outline-light"
            size="sm"
            className="w-100 d-flex align-items-center justify-content-center gap-1 py-2"
          >
            <Ticket size={15} />
            {movie.isUpcoming ? 'View Details' : 'Book Tickets'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
