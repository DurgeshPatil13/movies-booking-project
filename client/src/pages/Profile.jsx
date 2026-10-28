import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import {
  User, Mail, Calendar, Shield, Ticket, LogOut, CheckCircle,
  Edit2, Sparkles, Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserBookings } from '../services/storage.js';

const Profile = () => {
  const { user, updateProfile, logout, switchDemoAccount } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.name || '');
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!user) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: 500 }}>
        <p className="text-secondary">Please sign in to view your profile.</p>
        <Button as={Link} to="/login" variant="danger">Sign In</Button>
      </Container>
    );
  }

  const userBookings = getUserBookings(user.id);
  const confirmedCount = userBookings.filter(b => b.status === 'confirmed').length;

  const handleUpdateName = (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!displayName.trim()) {
      setErrorMsg('Display name cannot be empty.');
      return;
    }

    try {
      updateProfile({ name: displayName.trim() });
      setSuccessMsg('Display name updated successfully in your local browser profile!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update name');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container fluid="xl" className="py-5 pb-5" style={{ maxWidth: 850 }}>
      <div className="bg-dark border border-secondary-subtle rounded-4 p-4 p-md-5 shadow-lg">
        {/* Header Profile Section */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-4 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-danger bg-opacity-25 text-danger p-3 d-flex align-items-center justify-content-center shadow" style={{ width: 68, height: 68 }}>
              {user.role === 'admin' ? <Shield size={36} className="text-warning" /> : <User size={36} />}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="text-light fw-bold mb-0">{user.name}</h3>
                <Badge bg={user.role === 'admin' ? "warning" : "info"} text={user.role === 'admin' ? "dark" : "white"}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              <div className="text-secondary small d-flex align-items-center gap-1 mt-1">
                <Mail size={13} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleLogout}
            className="d-flex align-items-center gap-1"
          >
            <LogOut size={15} />
            Sign Out
          </Button>
        </div>

        {/* Stats Row */}
        <Row className="g-3 mb-4 text-center">
          <Col md={4} sm={6}>
            <div className="p-3 bg-black rounded-3 border border-secondary-subtle">
              <span className="text-secondary small d-block mb-1">Total Bookings</span>
              <div className="fs-3 fw-bold text-light">{userBookings.length}</div>
            </div>
          </Col>
          <Col md={4} sm={6}>
            <div className="p-3 bg-black rounded-3 border border-secondary-subtle">
              <span className="text-secondary small d-block mb-1">Confirmed Tickets</span>
              <div className="fs-3 fw-bold text-success">{confirmedCount}</div>
            </div>
          </Col>
          <Col md={4} sm={12}>
            <div className="p-3 bg-black rounded-3 border border-secondary-subtle">
              <span className="text-secondary small d-block mb-1">Member Since</span>
              <div className="fs-6 fw-bold text-light mt-1">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Demo User'}
              </div>
            </div>
          </Col>
        </Row>

        {/* Feedback Messages */}
        {successMsg && (
          <Alert variant="success" className="py-2 small mb-3">
            <CheckCircle size={15} className="me-1 inline" />
            {successMsg}
          </Alert>
        )}
        {errorMsg && (
          <Alert variant="danger" className="py-2 small mb-3">
            {errorMsg}
          </Alert>
        )}

        {/* Edit Display Name Form */}
        <div className="p-4 bg-black rounded-3 border border-secondary-subtle mb-4">
          <h5 className="text-light fw-bold mb-3 d-flex align-items-center gap-2">
            <Edit2 size={18} className="text-danger" />
            Edit Profile Details
          </h5>

          <Form onSubmit={handleUpdateName}>
            <Row className="g-3 align-items-end">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="text-secondary small">Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Button type="submit" variant="danger" className="w-100 btn-primary-imovies">
                  Update Name
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Quick Link to Bookings */}
        <div className="d-flex flex-wrap align-items-center justify-content-between p-3 bg-black rounded-3 border border-secondary-subtle mb-4 gap-3">
          <div className="d-flex align-items-center gap-2">
            <Ticket size={22} className="text-danger" />
            <div>
              <strong className="text-light d-block">Cinema Ticket History</strong>
              <span className="text-secondary small">View, download receipts, or cancel eligible tickets.</span>
            </div>
          </div>
          <Button as={Link} to="/my-bookings" variant="outline-light" size="sm">
            Open My Bookings
          </Button>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="border-top border-secondary pt-3 d-flex flex-wrap align-items-center justify-content-between gap-2 small text-secondary">
          <span className="d-flex align-items-center gap-1">
            <Sparkles size={14} className="text-warning" />
            Switch Active Demo Persona:
          </span>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => { switchDemoAccount('user'); setDisplayName('Alex Mercer'); }}
              className="text-light small"
            >
              Alex (User)
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => { switchDemoAccount('admin'); setDisplayName('Sarah Jenkins (Admin)'); }}
              className="small"
            >
              Sarah (Admin)
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
