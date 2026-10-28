import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = "An unexpected error occurred.", onRetry }) => {
  return (
    <Alert variant="danger" className="d-flex flex-column align-items-center text-center p-4 my-3 bg-dark border-danger text-light">
      <AlertTriangle size={32} className="text-danger mb-2" />
      <h6 className="fw-bold mb-1">Notice</h6>
      <p className="small text-secondary mb-3">{message}</p>
      {onRetry && (
        <Button variant="outline-danger" size="sm" onClick={onRetry} className="d-flex align-items-center gap-1">
          <RefreshCw size={14} />
          Retry
        </Button>
      )}
    </Alert>
  );
};

export default ErrorMessage;
