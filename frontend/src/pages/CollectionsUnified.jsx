import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import './CollectionsUnified.css'

const CollectionsUnified = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    fabric: searchParams.get('fabric') || '',
    color: searchParams.get('color') || '',
    occasion: searchParams.get('occasion') || '',
  })
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')

  const categories = [
    { id: 'silk', name: 'Silk Sarees', count: 150 },
    { id: 'cotton', name: 'Cotton Sarees', count: 200 },
    { id: 'designer', name: 'Designer Sarees', count: 80 },
    { id: 'bridal', name: 'Bridal Sarees', count: 50 },
    { id: 'party-wear', name: 'Party Wear', count: 120 },
  ]

  const priceRanges = [
    { id: 'under-5000', label: 'Under ₹5,000', min: 0, max: 5000 },
    { id: '5000-10000', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { id: '10000-20000', label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { id: 'above-20000', label: 'Above ₹20,000', min: 20000, max: 999999 },
  ]

  const fabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Banarasi', 'Kanjivaram']
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White', 'Gold']
  const occasions = ['Wedding', 'Party', 'Festival', 'Casual', 'Office', 'Traditional']

  useEffect(() => {
    fetchProducts()
  }, [filters, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      if (sortBy) queryParams.append('sort', sortBy)

      const response = await fetch(`/api/products?${queryParams}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.set(key, val)
    })
    if (sortBy) params.set('sort', sortBy)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      fabric: '',
      color: '',
      occasion: '',
    })
    setSearchParams({})
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <MainLayout>
      <div className="collections-unified">
        {/* Breadcrumb */}
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Collections</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="collections-header">
          <div className="container">
            <h1 className="page-title">Explore Our Collections</h1>
            <p className="page-description">
              Discover handcrafted sarees that celebrate tradition and elegance
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container">
          <div className="collections-layout">
            {/* Filters Sidebar */}
            <aside className={`filters-sidebar ${showFilters ? 'visible' : 'hidden'}`}>
              <div className="filters-header">
                <h2 className="filters-title">Filters</h2>
                {activeFilterCount > 0 && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear All ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <h3 className="filter-group-title">Category</h3>
                <div className="filter-options">
                  {categories.map(category => (
                    <label key={category.id} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id}
                        onChange={e => handleFilterChange('category', e.target.value)}
                      />
                      <span className="filter-option-label">
                        {category.name}
                        <span className="filter-option-count">({category.count})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h3 className="filter-group-title">Price Range</h3>
                <div className="filter-options">
                  {priceRanges.map(range => (
                    <label key={range.id} className="filter-option">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.id}
                        checked={filters.priceRange === range.id}
                        onChange={e => handleFilterChange('priceRange', e.target.value)}
                      />
                      <span className="filter-option-label">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fabric Filter */}
              <div className="filter-group">
                <h3 className="filter-group-title">Fabric</h3>
                <div className="filter-options">
                  {fabrics.map(fabric => (
                    <label key={fabric} className="filter-option">
                      <input
                        type="radio"
                        name="fabric"
                        value={fabric.toLowerCase()}
                        checked={filters.fabric === fabric.toLowerCase()}
                        onChange={e => handleFilterChange('fabric', e.target.value)}
                      />
                      <span className="filter-option-label">{fabric}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="filter-group">
                <h3 className="filter-group-title">Color</h3>
                <div className="color-filter-grid">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`color-filter-btn ${filters.color === color.toLowerCase() ? 'active' : ''}`}
                      onClick={() => handleFilterChange('color', color.toLowerCase())}
                      title={color}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              <div className="filter-group">
                <h3 className="filter-group-title">Occasion</h3>
                <div className="filter-options">
                  {occasions.map(occasion => (
                    <label key={occasion} className="filter-option">
                      <input
                        type="radio"
                        name="occasion"
                        value={occasion.toLowerCase()}
                        checked={filters.occasion === occasion.toLowerCase()}
                        onChange={e => handleFilterChange('occasion', e.target.value)}
                      />
                      <span className="filter-option-label">{occasion}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="products-section">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="toolbar-left">
                  <button
                    className="toggle-filters-btn"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4h14M3 10h10M3 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </button>
                  <span className="results-count">
                    {loading ? 'Loading...' : `${products.length} Products`}
                  </span>
                </div>

                <div className="toolbar-right">
                  <div className="view-mode-toggle">
                    <button
                      className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <rect x="2" y="2" width="7" height="7" />
                        <rect x="11" y="2" width="7" height="7" />
                        <rect x="2" y="11" width="7" height="7" />
                        <rect x="11" y="11" width="7" height="7" />
                      </svg>
                    </button>
                    <button
                      className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <rect x="2" y="3" width="16" height="3" />
                        <rect x="2" y="8" width="16" height="3" />
                        <rect x="2" y="13" width="16" height="3" />
                      </svg>
                    </button>
                  </div>

                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="active-filters">
                  {Object.entries(filters).map(([key, value]) =>
                    value ? (
                      <span key={key} className="active-filter-tag">
                        {value}
                        <button
                          className="remove-filter-btn"
                          onClick={() => handleFilterChange(key, '')}
                        >
                          ×
                        </button>
                      </span>
                    ) : null
                  )}
                </div>
              )}

              {/* Products Grid/List */}
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                    <path d="M40 60h40M60 40v40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              ) : (
                <div className={`products-grid view-${viewMode}`}>
                  {products.map((product, index) => (
                    <Card
                      key={product._id || index}
                      hover
                      className="product-card animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <Link to={`/product/${product.slug || product._id}`} className="product-link">
                        <div className="product-image-wrapper">
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.name}
                            className="product-image"
                            loading="lazy"
                          />
                          {product.discount && (
                            <span className="product-badge discount-badge">
                              {product.discount}% OFF
                            </span>
                          )}
                          {product.isNew && (
                            <span className="product-badge new-badge">New</span>
                          )}
                          <button className="wishlist-btn" aria-label="Add to wishlist">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M10 18.35l-1.45-1.32C3.4 12.36 0 9.28 0 5.5 0 2.42 2.42 0 5.5 0 7.24 0 8.91 0.81 10 2.09 11.09 0.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.78-3.4 6.86-8.55 11.54L10 18.35z" />
                            </svg>
                          </button>
                        </div>
                        <div className="product-info">
                          <h3 className="product-name">{product.name}</h3>
                          <div className="product-rating">
                            <span className="rating-stars">★★★★★</span>
                            <span className="rating-count">(24)</span>
                          </div>
                          <div className="product-price">
                            <span className="price-current">₹{product.price?.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <Button fullWidth size="sm" className="add-to-cart-btn">
                        Add to Cart
                      </Button>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && products.length > 0 && (
                <div className="pagination">
                  <button className="pagination-btn" disabled>
                    Previous
                  </button>
                  <span className="pagination-info">Page 1 of 10</span>
                  <button className="pagination-btn">Next</button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default CollectionsUnified
