import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { UserPlus, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please complete all form fields.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters for this demo.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password });
      navigate('/profile');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 520 }}>
      <div className="bg-dark border border-secondary-subtle rounded-4 p-4 p-md-5 shadow-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="rounded-circle bg-danger bg-opacity-25 text-danger d-inline-flex p-3 mb-2">
            <UserPlus size={28} />
          </div>
          <h2 className="text-light fw-bold mb-1">Create Demo Account</h2>
          <p className="text-secondary small">
            Register a local user profile stored in browser localStorage.
          </p>
        </div>

        {/* Demo Notice Alert */}
        <Alert variant="secondary" className="bg-black border-secondary text-secondary small py-2 px-3 mb-4">
          <div className="d-flex align-items-center gap-2 text-warning fw-semibold mb-1">
            <ShieldAlert size={14} />
            <span>Demonstration Auth Mode</span>
          </div>
          <div>
            Data is stored strictly in your browser session. Do not enter real-world sensitive passwords.
          </div>
        </Alert>

        {errorMsg && (
          <Alert variant="danger" className="py-2 small mb-3">
            {errorMsg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small fw-medium">Full Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="bg-black text-light border-secondary py-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small fw-medium">Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="bg-black text-light border-secondary py-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small fw-medium">Password (Min 4 chars)</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black text-light border-secondary py-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small fw-medium">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black text-light border-secondary py-2"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="danger"
            disabled={loading}
            className="w-100 btn-primary-imovies py-2 fw-semibold shadow"
          >
            {loading ? 'Creating Demo Account...' : 'Complete Registration'}
          </Button>
        </Form>

        <div className="text-center text-secondary small">
          Already registered?{' '}
          <Link to="/login" className="text-danger fw-semibold text-decoration-none">
            Sign In Here
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Register;
