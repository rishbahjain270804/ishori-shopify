import searchService from '../services/search.service.js'

/**
 * @desc    Search products with advanced filtering
 * @route   GET /api/products/search
 * @access  Public
 */
export const searchProducts = async (req, res) => {
  try {
    const params = {
      q: req.query.q,
      category: req.query.category,
      fabric: req.query.fabric,
      color: req.query.color,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      occasion: req.query.occasion,
      work: req.query.work,
      inStock: req.query.inStock,
      minRating: req.query.minRating,
      sort: req.query.sort || 'relevance',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 24
    }

    const result = await searchService.searchProducts(params)

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
      filters: params
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    })
  }
}

/**
 * @desc    Get search suggestions for autocomplete
 * @route   GET /api/products/suggestions
 * @access  Public
 */
export const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query
    const limit = parseInt(req.query.limit) || 10

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: []
      })
    }

    const suggestions = await searchService.getSuggestions(q, limit)

    res.status(200).json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    console.error('Suggestions error:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting suggestions',
      error: error.message
    })
  }
}

/**
 * @desc    Get available filter options
 * @route   GET /api/products/filters
 * @access  Public
 */
export const getFilterOptions = async (req, res) => {
  try {
    const currentFilters = {
      category: req.query.category,
      fabric: req.query.fabric
    }

    const filters = await searchService.getAvailableFilters(currentFilters)

    res.status(200).json({
      success: true,
      data: filters
    })
  } catch (error) {
    console.error('Filter options error:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting filter options',
      error: error.message
    })
  }
}
