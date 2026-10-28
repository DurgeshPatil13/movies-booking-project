import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Alert, Button, Container } from 'react-bootstrap';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, switchDemoAccount } = useAuth();

  if (loading) {
    return (
      <div className="py-5 text-center text-secondary">
        <div className="spinner-border text-danger" role="status" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: 600 }}>
        <div className="p-5 border border-danger-subtle rounded-4 bg-dark shadow">
          <ShieldAlert size={56} className="text-danger mb-3" />
          <h3 className="text-light fw-bold">Admin Privileges Required</h3>
          <p className="text-secondary small mb-4">
            The Admin Dashboard is restricted to demonstration administrator accounts. You can easily switch to the demo admin profile with one click below.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Button variant="warning" onClick={() => switchDemoAccount('admin')}>
              Switch to Demo Admin (Sarah)
            </Button>
            <Button as={Link} to="/" variant="outline-light">
              <ArrowLeft size={16} className="me-1 inline" />
              Return Home
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return children;
};

export default AdminRoute;
