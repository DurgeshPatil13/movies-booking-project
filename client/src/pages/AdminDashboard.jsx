import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Tab, Nav } from 'react-bootstrap';
import {
  Shield, Film, Ticket, DollarSign, PlusCircle, Edit3, Trash2,
  Calendar, MapPin, Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import {
  getStoredMovies, saveStoredMovie, updateStoredMovie, deleteStoredMovie,
  getStoredBookings, getStoredTheaters, getStoredShows
} from '../services/storage.js';
import { getFallbackPoster } from '../data/initialData.js';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal State for Add / Edit Movie
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form fields
  const [movieForm, setMovieForm] = useState({
    title: '',
    tagline: '',
    synopsis: '',
    genres: 'Action, Sci-Fi',
    language: 'English',
    duration: 120,
    rating: 8.0,
    certificate: 'PG-13',
    releaseDate: '2025-01-01',
    director: '',
    cast: 'Lead Actor, Co-Star',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    basePrice: 14.00,
    isNowShowing: true,
    isUpcoming: false
  });

  const loadData = () => {
    setMovies(getStoredMovies());
    setBookings(getStoredBookings());
    setTheaters(getStoredTheaters());
    setShows(getStoredShows());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats calculation
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  const openAddModal = () => {
    setEditingMovie(null);
    setMovieForm({
      title: '',
      tagline: '',
      synopsis: '',
      genres: 'Action, Adventure',
      language: 'English',
      duration: 130,
      rating: 8.5,
      certificate: 'PG-13',
      releaseDate: new Date().toISOString().split('T')[0],
      director: '',
      cast: 'Actor One, Actor Two',
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: '',
      basePrice: 14.50,
      isNowShowing: true,
      isUpcoming: false
    });
    setShowMovieModal(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      tagline: movie.tagline || '',
      synopsis: movie.synopsis || '',
      genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres,
      language: movie.language || 'English',
      duration: movie.duration || 120,
      rating: movie.rating || 8.0,
      certificate: movie.certificate || 'PG-13',
      releaseDate: movie.releaseDate || '2024-01-01',
      director: movie.director || '',
      cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast,
      posterUrl: movie.posterUrl || '',
      backdropUrl: movie.backdropUrl || '',
      trailerUrl: movie.trailerUrl || '',
      basePrice: movie.basePrice || 14.00,
      isNowShowing: movie.isNowShowing ?? true,
      isUpcoming: movie.isUpcoming ?? false
    });
    setShowMovieModal(true);
  };

  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!movieForm.title.trim()) return;

    if (editingMovie) {
      updateStoredMovie(editingMovie.id, {
        ...movieForm,
        genres: movieForm.genres.split(',').map(s => s.trim()),
        cast: movieForm.cast.split(',').map(s => s.trim()),
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating),
        basePrice: Number(movieForm.basePrice)
      });
      setNotification({ type: 'success', text: `Movie "${movieForm.title}" updated successfully!` });
    } else {
      saveStoredMovie(movieForm);
      setNotification({ type: 'success', text: `New movie "${movieForm.title}" added to catalog!` });
    }

    setShowMovieModal(false);
    loadData();
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteMovie = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      deleteStoredMovie(id);
      loadData();
      setNotification({ type: 'warning', text: `Movie "${title}" removed from catalog.` });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <Container fluid="xl" className="py-4 pb-5">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 border-bottom border-secondary-subtle pb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="text-light fw-bold mb-0 d-flex align-items-center gap-2">
              <Shield size={28} className="text-warning" />
              Admin Management Console
            </h1>
            <Badge bg="warning" text="dark" className="fw-bold">DEMO ADMIN</Badge>
          </div>
          <p className="text-secondary small mb-0">
            Control center for catalog management, cinema schedules, and local booking transactions.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button variant="danger" size="sm" onClick={openAddModal} className="d-flex align-items-center gap-1 shadow">
            <PlusCircle size={15} />
            Add New Movie
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={loadData} className="text-light">
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      {/* Security Disclaimer Banner */}
      <Alert variant="secondary" className="bg-dark border-secondary text-secondary small py-2 px-3 mb-4">
        <div className="d-flex gap-2">
          <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-1" />
          <div>
            <strong>Client-Side Demo Administrative Interface:</strong> Any movie catalog changes or deletions performed here are written directly to your browser's <code className="text-danger">localStorage</code>. No remote server database is modified.
          </div>
        </div>
      </Alert>

      {/* Action Notification */}
      {notification && (
        <Alert variant={notification.type} dismissible onClose={() => setNotification(null)} className="small py-2 mb-4">
          {notification.text}
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <Row className="g-3 mb-4">
        <Col lg={3} sm={6}>
          <div className="p-3 bg-dark border border-secondary rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small">Total Catalog Movies</span>
              <Film size={20} className="text-danger" />
            </div>
            <div className="fs-3 fw-bold text-light">{movies.length}</div>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Active titles</span>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="p-3 bg-dark border border-secondary rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small">Confirmed Bookings</span>
              <Ticket size={20} className="text-success" />
            </div>
            <div className="fs-3 fw-bold text-success">{confirmedBookings}</div>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{cancelledBookings} cancelled</span>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="p-3 bg-dark border border-secondary rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small">Gross Demo Revenue</span>
              <DollarSign size={20} className="text-warning" />
            </div>
            <div className="fs-3 fw-bold text-warning">${totalRevenue.toFixed(2)}</div>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Simulated payments</span>
          </div>
        </Col>

        <Col lg={3} sm={6}>
          <div className="p-3 bg-dark border border-secondary rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small">Cinema Venues</span>
              <MapPin size={20} className="text-info" />
            </div>
            <div className="fs-3 fw-bold text-info">{theaters.length}</div>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{shows.length} shows scheduled</span>
          </div>
        </Col>
      </Row>

      {/* Tabs: Movies Catalog, Shows, Bookings List */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="pills" className="bg-dark p-2 rounded-3 border border-secondary mb-4 gap-2">
          <Nav.Item>
            <Nav.Link eventKey="overview" className="text-light small py-2 px-3">
              Movie Catalog ({movies.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bookings" className="text-light small py-2 px-3">
              All Local Bookings ({bookings.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="theaters" className="text-light small py-2 px-3">
              Cinemas & Screens ({theaters.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* TAB 1: Movie Catalog Manager */}
          <Tab.Pane eventKey="overview">
            <div className="bg-dark border border-secondary rounded-4 p-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-light fw-bold mb-0">Movie Catalog Inventory</h5>
                <Button variant="danger" size="sm" onClick={openAddModal} className="d-flex align-items-center gap-1">
                  <PlusCircle size={14} /> Add Movie
                </Button>
              </div>

              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle small mb-0">
                  <thead className="border-bottom border-secondary text-secondary">
                    <tr>
                      <th style={{ width: 60 }}>Poster</th>
                      <th>Title & Details</th>
                      <th>Language</th>
                      <th>Duration</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Base Price</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map(movie => (
                      <tr key={movie.id} className="border-bottom border-secondary-subtle">
                        <td>
                          <img
                            src={movie.posterUrl || getFallbackPoster(movie.title)}
                            alt={movie.title}
                            className="rounded"
                            style={{ width: 44, height: 60, objectFit: 'cover' }}
                            onError={(e) => { e.target.src = getFallbackPoster(movie.title); }}
                          />
                        </td>
                        <td>
                          <strong className="text-light d-block">{movie.title}</strong>
                          <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                            {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
                          </span>
                        </td>
                        <td>{movie.language}</td>
                        <td>{movie.duration} min</td>
                        <td>
                          <span className="badge bg-black border border-warning text-warning">
                            ★ {Number(movie.rating).toFixed(1)}
                          </span>
                        </td>
                        <td>
                          {movie.isUpcoming ? (
                            <Badge bg="warning" text="dark">Upcoming</Badge>
                          ) : (
                            <Badge bg="danger">Now Showing</Badge>
                          )}
                        </td>
                        <td className="text-light">${Number(movie.basePrice || 14).toFixed(2)}</td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-1">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => openEditModal(movie)}
                              title="Edit Movie"
                              className="text-light p-1"
                            >
                              <Edit3 size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteMovie(movie.id, movie.title)}
                              title="Delete Movie"
                              className="p-1"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Pane>

          {/* TAB 2: Bookings Explorer */}
          <Tab.Pane eventKey="bookings">
            <div className="bg-dark border border-secondary rounded-4 p-4 shadow-sm">
              <h5 className="text-light fw-bold mb-3">All Customer Bookings in Local Storage</h5>
              {bookings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle small mb-0">
                    <thead className="border-bottom border-secondary text-secondary">
                      <tr>
                        <th>Reference</th>
                        <th>User</th>
                        <th>Movie & Cinema</th>
                        <th>Date & Time</th>
                        <th>Seats</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date Booked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id || b.bookingReference} className="border-bottom border-secondary-subtle">
                          <td>
                            <strong className="text-danger font-monospace">{b.bookingReference}</strong>
                          </td>
                          <td>
                            <div className="text-light">{b.userName}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.userEmail}</div>
                          </td>
                          <td>
                            <div className="text-light fw-semibold">{b.movieTitle}</div>
                            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{b.theaterName}</div>
                          </td>
                          <td>
                            <div>{b.date}</div>
                            <div className="text-secondary">{b.time}</div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {(b.seatLabels || []).map(s => (
                                <Badge key={s} bg="black" className="border border-secondary text-warning">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="fw-bold text-light">${Number(b.totalAmount).toFixed(2)}</td>
                          <td>
                            {b.status === 'confirmed' ? (
                              <Badge bg="success">Confirmed</Badge>
                            ) : (
                              <Badge bg="danger">Cancelled</Badge>
                            )}
                          </td>
                          <td className="text-secondary" style={{ fontSize: '0.75rem' }}>
                            {new Date(b.bookedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-secondary">
                  No bookings recorded yet.
                </div>
              )}
            </div>
          </Tab.Pane>

          {/* TAB 3: Theaters & Screens */}
          <Tab.Pane eventKey="theaters">
            <Row className="g-4">
              {theaters.map(th => (
                <Col key={th.id} md={4}>
                  <div className="bg-dark border border-secondary rounded-4 p-4 h-100 shadow-sm">
                    <h5 className="text-light fw-bold mb-2">{th.name}</h5>
                    <div className="text-secondary small mb-3">
                      <MapPin size={13} className="text-danger me-1 inline" />
                      {th.address}
                    </div>

                    <h6 className="text-light small fw-bold mb-2">Auditorium Screens:</h6>
                    <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-3">
                      {(th.screens || []).map(scr => (
                        <li key={scr.id} className="p-2 bg-black rounded border border-secondary d-flex justify-content-between align-items-center">
                          <span>{scr.name}</span>
                          <Badge bg="info" text="dark">{scr.type}</Badge>
                        </li>
                      ))}
                    </ul>

                    <div className="d-flex flex-wrap gap-1">
                      {(th.facilities || []).map((f, i) => (
                        <span key={i} className="badge bg-secondary text-light" style={{ fontSize: '0.65rem' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Add / Edit Movie Modal */}
      <Modal show={showMovieModal} onHide={() => setShowMovieModal(false)} size="lg" centered contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="h5 text-light fw-bold">
            {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie to Catalog'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveMovie}>
          <Modal.Body className="small">
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="text-secondary">Movie Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="bg-black text-light border-secondary"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-secondary">Language</Form.Label>
                  <Form.Control
                    type="text"
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="text-secondary">Tagline</Form.Label>
                  <Form.Control
                    type="text"
                    value={movieForm.tagline}
                    onChange={(e) => setMovieForm({ ...movieForm, tagline: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="text-secondary">Synopsis</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={movieForm.synopsis}
                    onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-secondary">Genres (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={movieForm.genres}
                    onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-secondary">Cast Members (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={movieForm.cast}
                    onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-secondary">Duration (mins)</Form.Label>
                  <Form.Control
                    type="number"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-secondary">Rating (1-10)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-secondary">Certificate</Form.Label>
                  <Form.Control
                    type="text"
                    value={movieForm.certificate}
                    onChange={(e) => setMovieForm({ ...movieForm, certificate: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="text-secondary">Base Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    value={movieForm.basePrice}
                    onChange={(e) => setMovieForm({ ...movieForm, basePrice: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="text-secondary">Poster Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="bg-black text-light border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Now Showing in Cinemas"
                  checked={movieForm.isNowShowing}
                  onChange={(e) => setMovieForm({ ...movieForm, isNowShowing: e.target.checked })}
                  className="text-light"
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Upcoming Release"
                  checked={movieForm.isUpcoming}
                  onChange={(e) => setMovieForm({ ...movieForm, isUpcoming: e.target.checked })}
                  className="text-light"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-secondary">
            <Button variant="outline-secondary" size="sm" onClick={() => setShowMovieModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" className="btn-primary-imovies">
              {editingMovie ? 'Save Changes' : 'Add Movie'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
