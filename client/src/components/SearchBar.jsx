import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search movies by title, director, or cast...", onClear }) => {
  return (
    <div className="position-relative w-100">
      <InputGroup>
        <InputGroup.Text className="bg-dark border-secondary text-secondary">
          <Search size={18} />
        </InputGroup.Text>
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-dark text-light border-secondary shadow-none search-input py-2"
          style={{ borderColor: '#334155' }}
        />
        {value && (
          <Button
            variant="dark"
            className="border-secondary text-secondary"
            onClick={onClear}
            title="Clear search"
          >
            <X size={18} />
          </Button>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchBar;
