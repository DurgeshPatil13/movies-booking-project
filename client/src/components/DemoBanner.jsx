import React, { useState } from 'react';
import { Alert, Badge, Button } from 'react-bootstrap';
import { Info, X, Database, ShieldAlert } from 'lucide-react';

const DemoBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-dark border-bottom border-danger-subtle py-2 px-3">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-2 text-light small">
        <div className="d-flex align-items-center gap-2">
          <Badge bg="danger" className="d-flex align-items-center gap-1 py-1 px-2">
            <Database size={13} />
            DEMO MODE (NO DATABASE)
          </Badge>
          <span className="text-secondary d-none d-md-inline">
            All movies, showtimes, and booking receipts persist in your browser's <strong className="text-light">localStorage</strong>. No external database or payment gateway is used.
          </span>
          <span className="text-secondary d-inline d-md-none">
            Browser localStorage demo mode.
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="secondary" className="d-none d-sm-inline">Demo Auth</Badge>
          <button
            type="button"
            className="btn btn-sm btn-link text-secondary p-0 text-decoration-none"
            onClick={() => setDismissed(true)}
            title="Dismiss notice"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
