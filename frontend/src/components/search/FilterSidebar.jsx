import { useState, useEffect } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ 
  filters = {}, 
  activeFilters = {}, 
  onFilterChange,
  onClearAll 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    fabric: true,
    color: true,
    price: true,
    rating: false,
    availability: false
  });

  const [priceRange, setPriceRange] = useState({
    min: activeFilters.minPrice || '',
    max: activeFilters.maxPrice || ''
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (filterKey, value) => {
    const currentValues = activeFilters[filterKey] 
      ? activeFilters[filterKey].split(',') 
      : [];
    
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange(filterKey, newValues.length > 0 ? newValues.join(',') : '');
  };

  const isChecked = (filterKey, value) => {
    if (!activeFilters[filterKey]) return false;
    return activeFilters[filterKey].split(',').includes(value);
  };

  const handlePriceApply = () => {
    if (priceRange.min) {
      onFilterChange('minPrice', priceRange.min);
    }
    if (priceRange.max) {
      onFilterChange('maxPrice', priceRange.max);
    }
  };

  const handlePriceClear = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange('minPrice', '');
    onFilterChange('maxPrice', '');
  };

  const handleRatingChange = (rating) => {
    onFilterChange('minRating', activeFilters.minRating === rating ? '' : rating);
  };

  const handleInStockToggle = () => {
    onFilterChange('inStock', activeFilters.inStock === 'true' ? '' : 'true');
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(key => 
      activeFilters[key] && key !== 'page' && key !== 'limit' && key !== 'sort' && key !== 'q'
    ).length;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        {activeCount > 0 && (
          <button className="clear-all-btn" onClick={onClearAll}>
            Clear All ({activeCount})
          </button>
        )}
      </div>

      <div className="filter-sections">
        {/* Category Filter */}
        {filters.categories && filters.categories.length > 0 && (
          <FilterSection
            title="Category"
            isExpanded={expandedSections.category}
            onToggle={() => toggleSection('category')}
          >
            <div className="filter-options">
              {filters.categories.map(category => (
                <label key={category} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={isChecked('category', category)}
                    onChange={() => handleCheckboxChange('category', category)}
                  />
                  <span className="checkbox-label">{category}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Fabric Filter */}
        {filters.fabrics && filters.fabrics.length > 0 && (
          <FilterSection
            title="Fabric"
            isExpanded={expandedSections.fabric}
            onToggle={() => toggleSection('fabric')}
          >
            <div className="filter-options">
              {filters.fabrics.map(fabric => (
                <label key={fabric} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={isChecked('fabric', fabric)}
                    onChange={() => handleCheckboxChange('fabric', fabric)}
                  />
                  <span className="checkbox-label">{fabric}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Color Filter */}
        {filters.colors && filters.colors.length > 0 && (
          <FilterSection
            title="Color"
            isExpanded={expandedSections.color}
            onToggle={() => toggleSection('color')}
          >
            <div className="filter-options">
              {filters.colors.map(color => (
                <label key={color} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={isChecked('color', color)}
                    onChange={() => handleCheckboxChange('color', color)}
                  />
                  <span className="checkbox-label">
                    <span 
                      className="color-swatch" 
                      style={{ backgroundColor: getColorCode(color) }}
                    ></span>
                    {color}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="price-filter">
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="price-input"
                min="0"
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="price-input"
                min="0"
              />
            </div>
            <div className="price-actions">
              <button 
                className="price-apply-btn" 
                onClick={handlePriceApply}
                disabled={!priceRange.min && !priceRange.max}
              >
                Apply
              </button>
              {(activeFilters.minPrice || activeFilters.maxPrice) && (
                <button className="price-clear-btn" onClick={handlePriceClear}>
                  Clear
                </button>
              )}
            </div>
            {filters.priceRange && (
              <div className="price-range-info">
                <span>₹{filters.priceRange.min?.toLocaleString('en-IN')}</span>
                <span>₹{filters.priceRange.max?.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection
          title="Minimum Rating"
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="rating-filter">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  checked={activeFilters.minRating === rating.toString()}
                  onChange={() => handleRatingChange(rating.toString())}
                />
                <span className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < rating ? 'filled' : 'empty'}`}
                    ></i>
                  ))}
                  <span className="rating-text">& Up</span>
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability Filter */}
        <FilterSection
          title="Availability"
          isExpanded={expandedSections.availability}
          onToggle={() => toggleSection('availability')}
        >
          <div className="availability-filter">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={activeFilters.inStock === 'true'}
                onChange={handleInStockToggle}
              />
              <span className="checkbox-label">In Stock Only</span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

// Filter Section Component
const FilterSection = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={onToggle}>
        <h4>{title}</h4>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
      </button>
      {isExpanded && (
        <div className="filter-section-content">
          {children}
        </div>
      )}
    </div>
  );
};

// Helper function to get color codes
const getColorCode = (colorName) => {
  const colorMap = {
    'Red': '#DC143C',
    'Blue': '#4169E1',
    'Green': '#228B22',
    'Yellow': '#FFD700',
    'Pink': '#FF69B4',
    'Purple': '#9370DB',
    'Orange': '#FF8C00',
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gold': '#FFD700',
    'Silver': '#C0C0C0',
    'Brown': '#8B4513',
    'Beige': '#F5F5DC',
    'Cream': '#FFFDD0',
    'Maroon': '#800000',
    'Navy': '#000080',
    'Teal': '#008080',
    'Turquoise': '#40E0D0',
    'Lavender': '#E6E6FA',
    'Peach': '#FFE5B4',
    'Coral': '#FF7F50',
    'Mint': '#98FF98',
    'Olive': '#808000',
    'Rust': '#B7410E',
    'Burgundy': '#800020',
    'Magenta': '#FF00FF',
    'Indigo': '#4B0082',
    'Mustard': '#FFDB58',
    'Sage': '#9DC183',
    'Multi': '#999999'
  };

  return colorMap[colorName] || '#CCCCCC';
};

export default FilterSidebar;
