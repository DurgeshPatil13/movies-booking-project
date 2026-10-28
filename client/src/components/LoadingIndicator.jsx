import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingIndicator = ({ message = "Loading...", fullPage = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-4 text-secondary">
      <Spinner animation="border" variant="danger" role="status" className="mb-2" />
      <span className="small">{message}</span>
    </div>
  );

  if (fullPage) {
    return <div className="min-vh-50 d-flex align-items-center justify-content-center">{content}</div>;
  }

  return content;
};

export default LoadingIndicator;
