import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { LogIn, User, Lock, ShieldAlert, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, switchDemoAccount } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    switchDemoAccount(role);
    navigate(from, { replace: true });
  };

  return (
    <Container className="py-5" style={{ maxWidth: 520 }}>
      <div className="bg-dark border border-secondary-subtle rounded-4 p-4 p-md-5 shadow-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="rounded-circle bg-danger bg-opacity-25 text-danger d-inline-flex p-3 mb-2">
            <LogIn size={28} />
          </div>
          <h2 className="text-light fw-bold mb-1">Sign In to IMovies</h2>
          <p className="text-secondary small">
            Access your cinema ticket reservations and booking history.
          </p>
        </div>

        {/* Demo Notice Alert */}
        <Alert variant="secondary" className="bg-black border-secondary text-secondary small py-2 px-3 mb-4">
          <div className="d-flex align-items-center gap-2 text-warning fw-semibold mb-1">
            <ShieldAlert size={14} />
            <span>Demonstration Auth Mode</span>
          </div>
          <div>
            Client-side localStorage authentication for college evaluation. Passwords are validated locally.
          </div>
        </Alert>

        {errorMsg && (
          <Alert variant="danger" className="py-2 small mb-3">
            {errorMsg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small fw-medium">Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="bg-black text-light border-secondary py-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
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

          <Button
            type="submit"
            variant="danger"
            disabled={loading}
            className="w-100 btn-primary-imovies py-2 fw-semibold shadow"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </Form>

        {/* Quick Demo Accounts Helper */}
        <div className="p-3 bg-black rounded-3 border border-secondary-subtle mb-4">
          <div className="d-flex align-items-center gap-1 text-light small fw-bold mb-2">
            <Sparkles size={14} className="text-warning" />
            <span>One-Click Demo Profiles</span>
          </div>
          <div className="d-grid gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleQuickDemo('user')}
              className="text-start text-light small d-flex justify-content-between align-items-center"
            >
              <span>👤 <strong>Alex Mercer</strong> (Standard User)</span>
              <ArrowRight size={14} />
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => handleQuickDemo('admin')}
              className="text-start small d-flex justify-content-between align-items-center"
            >
              <span>🛡️ <strong>Sarah Jenkins</strong> (Cinema Admin)</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        <div className="text-center text-secondary small">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-danger fw-semibold text-decoration-none">
            Register Demo Account
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;
