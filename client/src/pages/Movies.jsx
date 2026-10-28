import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Film, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import MovieGrid from '../components/MovieGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import { movieApi } from '../services/api.js';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState('rating-desc');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieApi.getMovies();
        setMovies(data);
      } catch (err) {
        console.error('Failed to load movie catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Update query params when filters change
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedStatus('all');
    setSortBy('rating-desc');
  };

  // Compute languages dynamically from movies
  const availableLanguages = ['All', ...new Set(movies.map(m => m.language).filter(Boolean))];

  // Filter and sort movies
  const filteredMovies = movies
    .filter(m => {
      // Search check
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        m.title.toLowerCase().includes(query) ||
        (m.synopsis && m.synopsis.toLowerCase().includes(query)) ||
        (m.director && m.director.toLowerCase().includes(query)) ||
        (m.cast && m.cast.some(actor => actor.toLowerCase().includes(query)));

      // Genre check
      const matchesGenre = selectedGenre === 'All' ||
        (m.genres && m.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase()));

      // Language check
      const matchesLanguage = selectedLanguage === 'All' ||
        (m.language && m.language.toLowerCase() === selectedLanguage.toLowerCase());

      // Status check
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'now-showing' && m.isNowShowing) ||
        (selectedStatus === 'upcoming' && m.isUpcoming);

      return matchesSearch && matchesGenre && matchesLanguage && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'rating-asc') return (a.rating || 0) - (b.rating || 0);
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      if (sortBy === 'duration-desc') return (b.duration || 0) - (a.duration || 0);
      return 0;
    });

  return (
    <Container fluid="xl" className="py-4 pb-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-light fw-bold mb-1 d-flex align-items-center gap-2">
          <Film size={28} className="text-danger" />
          Browse Cinema Catalog
        </h1>
        <p className="text-secondary small mb-0">
          Showing {filteredMovies.length} movies across 3 cinema venues.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-dark border border-secondary-subtle rounded-4 p-4 mb-4 shadow-sm">
        <Row className="g-3 align-items-center mb-3">
          {/* Search bar */}
          <Col lg={6} md={6}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by title, director, or cast..."
            />
          </Col>

          {/* Status selector (All, Now Showing, Upcoming) */}
          <Col lg={2} sm={6}>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-dark text-light border-secondary"
            >
              <option value="all">All Releases</option>
              <option value="now-showing">Now Showing</option>
              <option value="upcoming">Coming Soon</option>
            </Form.Select>
          </Col>

          {/* Language selector */}
          <Col lg={2} sm={6}>
            <Form.Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-dark text-light border-secondary"
            >
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>
                  Language: {lang}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Sort By selector */}
          <Col lg={2} sm={12}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark text-light border-secondary"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="duration-desc">Longest Duration</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Genre Pill Bar */}
        <div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Filter by Genre
            </span>
            {(searchQuery || selectedGenre !== 'All' || selectedLanguage !== 'All' || selectedStatus !== 'all') && (
              <Button
                variant="link"
                size="sm"
                onClick={handleResetFilters}
                className="text-danger p-0 text-decoration-none small d-flex align-items-center gap-1"
              >
                <RotateCcw size={12} />
                Reset all
              </Button>
            )}
          </div>
          <GenreFilter
            selectedGenre={selectedGenre}
            onSelectGenre={handleGenreChange}
          />
        </div>
      </div>

      {/* Movie Grid */}
      <MovieGrid
        movies={filteredMovies}
        loading={loading}
        emptyMessage="No movies found matching your current filter criteria."
        onResetFilters={handleResetFilters}
      />
    </Container>
  );
};

export default Movies;
