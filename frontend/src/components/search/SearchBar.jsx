import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../config/api';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialValue = '', autoFocus = false }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounce timer
  const debounceTimer = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await productAPI.getSuggestions(query);
        if (response.data.success) {
          setSuggestions(response.data.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/collections?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      setQuery(suggestion.text);
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(suggestion.text);
      } else {
        navigate(`/collections?q=${encodeURIComponent(suggestion.text)}`);
      }
    } else if (suggestion.type === 'category') {
      setShowSuggestions(false);
      navigate(`/collections?category=${encodeURIComponent(suggestion.text)}`);
    } else if (suggestion.type === 'fabric') {
      setShowSuggestions(false);
      navigate(`/collections?fabric=${encodeURIComponent(suggestion.text)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'product':
        return 'fa-tag';
      case 'category':
        return 'fa-folder';
      case 'fabric':
        return 'fa-tshirt';
      default:
        return 'fa-search';
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search for sarees, fabrics, colors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
            autoFocus={autoFocus}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          {loading && (
            <div className="search-loading">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          )}
        </div>
        <button type="submit" className="search-submit">
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`suggestion-item ${
                  index === selectedIndex ? 'selected' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <i className={`fas ${getSuggestionIcon(suggestion.type)} suggestion-icon`}></i>
                <div className="suggestion-content">
                  <span className="suggestion-text">{suggestion.text}</span>
                  {suggestion.category && (
                    <span className="suggestion-meta">{suggestion.category}</span>
                  )}
                </div>
                <span className="suggestion-type">{suggestion.type}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !loading && query.trim().length >= 2 && suggestions.length === 0 && (
        <div className="search-suggestions">
          <div className="no-suggestions">
            <i className="fas fa-search"></i>
            <p>No suggestions found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
