import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { Film, RefreshCw } from 'lucide-react';
import MovieCard from './MovieCard.jsx';

const MovieGrid = ({ movies = [], loading = false, emptyMessage = "No movies found matching your criteria.", onResetFilters }) => {
  if (loading) {
    return (
      <div className="py-5 text-center text-secondary">
        <div className="spinner-border text-danger mb-3" role="status">
          <span className="visually-hidden">Loading movies...</span>
        </div>
        <p className="small">Loading movie catalog...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-5 text-center border border-secondary rounded-4 p-5 bg-dark my-4">
        <Film size={48} className="text-secondary mb-3 opacity-50" />
        <h4 className="text-light fw-bold">No Movies Found</h4>
        <p className="text-secondary small max-w-md mx-auto mb-4">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <Button variant="outline-danger" size="sm" onClick={onResetFilters} className="d-inline-flex align-items-center gap-2">
            <RefreshCw size={14} />
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <Row className="g-4">
      {movies.map(movie => (
        <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
          <MovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  );
};

export default MovieGrid;
