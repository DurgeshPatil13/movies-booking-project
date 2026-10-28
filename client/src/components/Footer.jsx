import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Film, Ticket, Heart, Shield, Database, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Footer = () => {
  const { switchDemoAccount } = useAuth();

  return (
    <footer className="bg-black text-secondary border-top border-secondary-subtle pt-5 pb-4 mt-auto">
      <Container fluid="xl">
        <Row className="g-4 mb-4">
          {/* Brand Info */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-danger text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                <Film size={20} className="text-white" />
              </div>
              <span className="brand-text fs-4">IMovies</span>
            </div>
            <p className="small mb-3 text-secondary" style={{ lineHeight: '1.6' }}>
              Movie ticket booking made simple. A responsive, database-free demonstration platform showcasing theater layouts, seat reservation algorithms, and local browser state persistence.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="danger" className="d-flex align-items-center gap-1 py-1 px-2">
                <Database size={12} />
                No-Database Architecture
              </Badge>
              <Badge bg="dark" className="border border-secondary text-light py-1 px-2">
                React + Express
              </Badge>
              <Badge bg="dark" className="border border-secondary text-light py-1 px-2">
                Bootstrap 5
              </Badge>
            </div>
          </Col>

          {/* Quick Navigation */}
          <Col lg={2} sm={6}>
            <h6 className="text-light text-uppercase fw-bold mb-3 small" style={{ letterSpacing: '0.05em' }}>
              Explore
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/" className="text-secondary text-decoration-none hover-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-secondary text-decoration-none hover-light">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=upcoming" className="text-secondary text-decoration-none hover-light">
                  Upcoming Releases
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-secondary text-decoration-none hover-light">
                  My Bookings
                </Link>
              </li>
            </ul>
          </Col>

          {/* Cinema Locations */}
          <Col lg={3} sm={6}>
            <h6 className="text-light text-uppercase fw-bold mb-3 small" style={{ letterSpacing: '0.05em' }}>
              Cinema Locations
            </h6>
            <div className="small d-flex flex-column gap-2 text-secondary">
              <div>
                <strong className="text-light d-block">Grand Cinema – Downtown</strong>
                <span style={{ fontSize: '0.8rem' }}>742 Broadway Ave (IMAX & Dolby Atmos)</span>
              </div>
              <div>
                <strong className="text-light d-block">Cineplex – Metro Galleria</strong>
                <span style={{ fontSize: '0.8rem' }}>1200 Galleria Mall, Level 3</span>
              </div>
              <div>
                <strong className="text-light d-block">Dome – West End</strong>
                <span style={{ fontSize: '0.8rem' }}>88 Promenade Blvd (4DX Motion)</span>
              </div>
            </div>
          </Col>

          {/* Demo Details & Disclaimer */}
          <Col lg={3} md={6}>
            <h6 className="text-light text-uppercase fw-bold mb-3 small" style={{ letterSpacing: '0.05em' }}>
              Demonstration Mode
            </h6>
            <p className="small mb-3 text-secondary" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
              This is a student college project demonstration. User sessions, bookings, and seat reservations are persisted exclusively within your current browser's <code className="text-danger">localStorage</code>.
            </p>
            <div className="d-flex flex-column gap-1">
              <button
                type="button"
                onClick={() => switchDemoAccount('admin')}
                className="btn btn-sm btn-outline-warning text-start d-flex align-items-center justify-content-between px-2 py-1"
                style={{ fontSize: '0.75rem' }}
              >
                <span>Switch to Demo Admin</span>
                <Shield size={13} />
              </button>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between small text-secondary gap-2">
          <div>
            © {new Date().getFullYear()} IMovies Cinema Platform. Designed for College Project Demonstration.
          </div>
          <div className="d-flex align-items-center gap-1">
            Built with <Heart size={14} className="text-danger fill-danger" /> by Full-Stack Student Developer
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
