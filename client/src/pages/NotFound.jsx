import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { Film, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <Container className="py-5 text-center my-auto" style={{ maxWidth: 560 }}>
      <div className="p-5 bg-dark border border-secondary rounded-4 shadow-lg">
        <div className="rounded-circle bg-danger bg-opacity-25 text-danger d-inline-flex p-3 mb-3">
          <Film size={48} />
        </div>
        <h1 className="display-4 fw-extrabold text-light mb-2">404</h1>
        <h4 className="text-light fw-bold mb-3">Page Not Found</h4>
        <p className="text-secondary small mb-4">
          The cinema hall or movie page you are looking for doesn't exist or has moved.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button as={Link} to="/" variant="danger" className="btn-primary-imovies d-flex align-items-center gap-2">
            <Home size={16} />
            Back to Home
          </Button>
          <Button as={Link} to="/movies" variant="outline-light" className="d-flex align-items-center gap-2">
            Browse Movies
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
