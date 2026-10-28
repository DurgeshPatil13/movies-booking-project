import React from 'react';
import { Button } from 'react-bootstrap';

const GENRES = [
  "All",
  "Action",
  "Sci-Fi",
  "Adventure",
  "Drama",
  "Biography",
  "Animation",
  "Crime",
  "Thriller",
  "Comedy",
  "Romance"
];

const GenreFilter = ({ selectedGenre = "All", onSelectGenre }) => {
  return (
    <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 custom-filter-bar" style={{ scrollbarWidth: 'none' }}>
      {GENRES.map((genre) => {
        const isSelected = selectedGenre.toLowerCase() === genre.toLowerCase();
        return (
          <Button
            key={genre}
            variant={isSelected ? "danger" : "dark"}
            size="sm"
            onClick={() => onSelectGenre(genre)}
            className={`text-nowrap rounded-pill px-3 py-1 border ${
              isSelected ? "fw-bold shadow-sm" : "border-secondary text-secondary"
            }`}
            style={{ fontSize: '0.85rem' }}
          >
            {genre}
          </Button>
        );
      })}
    </div>
  );
};

export default GenreFilter;
