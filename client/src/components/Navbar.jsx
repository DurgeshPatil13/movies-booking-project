import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge, Button, Modal } from 'react-bootstrap';
import { Film, Ticket, User, Shield, RotateCcw, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const AppNavbar = () => {
  const { user, isAuthenticated, isAdmin, logout, switchDemoAccount, resetAllData } = useAuth();
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

  const handleResetConfirm = () => {
    resetAllData();
    setShowResetModal(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <Navbar expand="lg" variant="dark" className="cinema-navbar sticky-top py-2">
        <Container fluid="xl">
          {/* Brand */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-danger text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
              <Film size={22} className="text-white" />
            </div>
            <div className="d-flex flex-column">
              <span className="brand-text">IMovies</span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.08em', marginTop: '-4px' }}>
                TICKETS MADE SIMPLE
              </span>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar-nav" />

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto ms-lg-3 gap-1">
              <Nav.Link as={NavLink} to="/" end className="px-3">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/movies" className="px-3">
                Browse Movies
              </Nav.Link>
              <Nav.Link as={NavLink} to="/my-bookings" className="px-3 d-flex align-items-center gap-1">
                <Ticket size={16} />
                My Bookings
              </Nav.Link>
              {isAdmin && (
                <Nav.Link as={NavLink} to="/admin" className="px-3 text-warning d-flex align-items-center gap-1">
                  <Shield size={16} />
                  Admin Dashboard
                </Nav.Link>
              )}
            </Nav>

            <Nav className="align-items-lg-center gap-2 mt-3 mt-lg-0">
              {/* Quick Reset Demo Button */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-flex align-items-center gap-1 text-secondary border-secondary-subtle"
                onClick={() => setShowResetModal(true)}
                title="Reset all localStorage sample data"
              >
                <RotateCcw size={14} />
                <span className="d-none d-xl-inline">Reset Data</span>
              </Button>

              {/* User Dropdown / Login */}
              {isAuthenticated ? (
                <NavDropdown
                  title={
                    <span className="d-inline-flex align-items-center gap-2 text-light">
                      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
                        {isAdmin ? <Shield size={14} className="text-warning" /> : <User size={14} />}
                      </div>
                      <span className="small font-weight-bold">{user.name.split(' ')[0]}</span>
                      {isAdmin && <Badge bg="warning" text="dark" style={{ fontSize: '0.65rem' }}>ADMIN</Badge>}
                    </span>
                  }
                  id="user-nav-dropdown"
                  align="end"
                  menuVariant="dark"
                  className="user-dropdown-custom"
                >
                  <div className="px-3 py-2 border-bottom border-secondary small">
                    <div className="fw-bold text-white">{user.name}</div>
                    <div className="text-muted text-truncate">{user.email}</div>
                    <Badge bg={isAdmin ? "warning" : "info"} text={isAdmin ? "dark" : "white"} className="mt-1">
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>

                  <NavDropdown.Item as={Link} to="/profile" className="py-2">
                    <User size={15} className="me-2" />
                    My Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/my-bookings" className="py-2">
                    <Ticket size={15} className="me-2" />
                    My Bookings
                  </NavDropdown.Item>

                  {isAdmin && (
                    <NavDropdown.Item as={Link} to="/admin" className="py-2 text-warning">
                      <Shield size={15} className="me-2" />
                      Admin Dashboard
                    </NavDropdown.Item>
                  )}

                  <NavDropdown.Divider />

                  <div className="px-3 py-1 small text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>
                    Quick Demo Switcher
                  </div>
                  <NavDropdown.Item onClick={() => switchDemoAccount('user')} className="py-1 small">
                    Switch to: Alex (Standard User)
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => switchDemoAccount('admin')} className="py-1 small text-warning">
                    Switch to: Sarah (Cinema Admin)
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={logout} className="py-2 text-danger">
                    <LogOut size={15} className="me-2" />
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Button as={Link} to="/login" variant="outline-light" size="sm" className="d-flex align-items-center gap-1">
                    <LogIn size={15} />
                    Sign In
                  </Button>
                  <Button as={Link} to="/register" variant="danger" size="sm" className="d-flex align-items-center gap-1">
                    <UserPlus size={15} />
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Reset Confirmation Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="h5 d-flex align-items-center gap-2 text-danger">
            <RotateCcw size={18} />
            Reset Demo Storage Data?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-secondary">
          <p>
            This action will reset your browser's <strong className="text-light">localStorage</strong> back to initial default movies, cinemas, showtimes, and seed accounts.
          </p>
          <p className="mb-0">
            Any custom bookings created during this session will be reverted to sample demo records.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-secondary" size="sm" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetConfirm}>
            Yes, Reset Data
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppNavbar;
