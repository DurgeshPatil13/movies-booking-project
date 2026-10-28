import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Play, Ticket, Sparkles, Star, Film, MonitorPlay, Volume2, Armchair, ChevronRight } from 'lucide-react';
import MovieGrid from '../components/MovieGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import { movieApi } from '../services/api.js';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const data = await movieApi.getMovies();
        setMovies(data);
      } catch (err) {
        console.error('Failed to load movies on Home:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Filtered lists
  const nowShowing = movies.filter(m => m.isNowShowing);
  const upcoming = movies.filter(m => m.isUpcoming);
  const heroMovie = movies.find(m => m.featured && m.isNowShowing) || nowShowing[0] || movies[0];

  // Search/genre filtered for Now Showing section
  const filteredNowShowing = nowShowing.filter(m => {
    const matchesSearch = !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.synopsis && m.synopsis.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.cast && m.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesGenre = selectedGenre === 'All' ||
      (m.genres && m.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase()));

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="pb-5">
      {/* Hero Banner Section */}
      {heroMovie && (
        <div className="container-fluid px-lg-5 pt-3 mb-5">
          <div
            className="hero-banner shadow-lg"
            style={{
              backgroundImage: `url(${heroMovie.backdropUrl || heroMovie.posterUrl})`,
              backgroundPosition: 'center 20%'
            }}
          >
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="danger" className="d-flex align-items-center gap-1 px-3 py-1 text-uppercase fw-bold">
                  <Sparkles size={14} /> Spotlight Feature
                </Badge>
                <span className="rating-badge d-flex align-items-center gap-1">
                  <Star size={13} className="fill-warning text-warning" />
                  {heroMovie.rating.toFixed(1)} / 10
                </span>
                <Badge bg="dark" className="border border-secondary text-light">
                  {heroMovie.certificate}
                </Badge>
              </div>

              <h1 className="display-4 fw-extrabold text-light mb-2">
                {heroMovie.title}
              </h1>

              {heroMovie.tagline && (
                <p className="lead text-warning fst-italic mb-3 fw-medium">
                  "{heroMovie.tagline}"
                </p>
              )}

              <p className="text-light-subtle d-none d-md-block mb-4 text-truncate-3" style={{ maxWidth: 650, color: '#e2e8f0', lineHeight: 1.6 }}>
                {heroMovie.synopsis}
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to={`/movies/${heroMovie.id}`}
                  className="btn-primary-imovies d-flex align-items-center gap-2 px-4 py-2"
                >
                  <Ticket size={18} />
                  Book Tickets Now
                </Button>

                {heroMovie.trailerUrl && (
                  <Button
                    href={heroMovie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-light"
                    className="d-flex align-items-center gap-2 px-4 py-2"
                  >
                    <Play size={18} className="text-danger fill-danger" />
                    Watch Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Container fluid="xl">
        {/* Search & Genre Filters Bar */}
        <div className="bg-dark border border-secondary-subtle rounded-4 p-4 mb-5 shadow-sm">
          <Row className="g-3 align-items-center">
            <Col lg={5} md={6}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Search movies, actors, or genres..."
              />
            </Col>
            <Col lg={7} md={6}>
              <GenreFilter
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
            </Col>
          </Row>
        </div>

        {/* Now Showing Section */}
        <section className="mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
            <div>
              <h2 className="text-light fw-bold mb-1 d-flex align-items-center gap-2">
                <Film size={26} className="text-danger" />
                Now Showing in Cinemas
              </h2>
              <p className="text-secondary small mb-0">
                Pick a movie, select your favorite cinema, and reserve seats in seconds.
              </p>
            </div>
            <Button
              as={Link}
              to="/movies"
              variant="outline-secondary"
              size="sm"
              className="d-flex align-items-center gap-1 text-light border-secondary"
            >
              View Full Catalog
              <ChevronRight size={16} />
            </Button>
          </div>

          <MovieGrid
            movies={filteredNowShowing}
            loading={loading}
            emptyMessage="No movies found matching your search. Try resetting filters."
            onResetFilters={() => {
              setSearchQuery('');
              setSelectedGenre('All');
            }}
          />
        </section>

        {/* Experience Cinema Highlights Banner */}
        <section className="my-5 py-4 px-4 bg-dark border border-secondary-subtle rounded-4">
          <Row className="g-4 text-center">
            <Col md={4}>
              <div className="p-3">
                <div className="rounded-circle bg-danger bg-opacity-25 text-danger d-inline-flex p-3 mb-3">
                  <MonitorPlay size={32} />
                </div>
                <h5 className="text-light fw-bold">IMAX with Laser</h5>
                <p className="text-secondary small mb-0">
                  Next-generation laser projection delivering crystal-clear images, unmatched brightness, and vivid colors.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-3">
                <div className="rounded-circle bg-warning bg-opacity-25 text-warning d-inline-flex p-3 mb-3">
                  <Volume2 size={32} />
                </div>
                <h5 className="text-light fw-bold">Dolby Atmos Audio</h5>
                <p className="text-secondary small mb-0">
                  Immersive multi-dimensional soundscapes moving all around you with breathtaking realism.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-3">
                <div className="rounded-circle bg-info bg-opacity-25 text-info d-inline-flex p-3 mb-3">
                  <Armchair size={32} />
                </div>
                <h5 className="text-light fw-bold">Luxury VIP Recliners</h5>
                <p className="text-secondary small mb-0">
                  Motorized leather recliners with personal cup holders, USB ports, and gourmet at-seat dining options.
                </p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Upcoming Releases Section */}
        {upcoming.length > 0 && (
          <section className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="text-light fw-bold mb-1 d-flex align-items-center gap-2">
                  <Sparkles size={24} className="text-warning" />
                  Coming Soon to Theaters
                </h2>
                <p className="text-secondary small mb-0">
                  Preview upcoming blockbusters and advance dates.
                </p>
              </div>
              <Button as={Link} to="/movies?status=upcoming" variant="outline-secondary" size="sm" className="text-light border-secondary">
                See All Upcoming
              </Button>
            </div>

            <MovieGrid
              movies={upcoming}
              loading={loading}
              emptyMessage="No upcoming movies scheduled."
            />
          </section>
        )}
      </Container>
    </div>
  );
};

export default Home;
