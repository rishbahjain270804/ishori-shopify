import Product from '../models/product.model.js'

/**
 * Search Service
 * Handles advanced product search and filtering with MongoDB aggregation
 */

class SearchService {
  /**
   * Main search method with filters, sorting, and pagination
   * @param {Object} params - Search parameters
   * @returns {Object} - Search results with pagination
   */
  async searchProducts(params) {
    const {
      q, // search query
      category,
      fabric,
      color,
      minPrice,
      maxPrice,
      occasion,
      work,
      inStock,
      minRating,
      sort = 'relevance',
      page = 1,
      limit = 24
    } = params

    // Build the aggregation pipeline
    const pipeline = []

    // Stage 1: Text search (if query provided)
    if (q && q.trim()) {
      pipeline.push({
        $match: {
          $text: { $search: q }
        }
      })
      
      // Add text score for relevance sorting
      pipeline.push({
        $addFields: {
          score: { $meta: 'textScore' }
        }
      })
    }

    // Stage 2: Apply filters
    const filterQuery = this.buildFilterQuery({
      category,
      fabric,
      color,
      minPrice,
      maxPrice,
      occasion,
      work,
      inStock,
      minRating
    })

    if (Object.keys(filterQuery).length > 0) {
      pipeline.push({ $match: filterQuery })
    }

    // Stage 3: Calculate total stock
    pipeline.push({
      $addFields: {
        totalStock: {
          $add: [
            { $ifNull: ['$stock.S', 0] },
            { $ifNull: ['$stock.M', 0] },
            { $ifNull: ['$stock.L', 0] },
            { $ifNull: ['$stock.XL', 0] }
          ]
        }
      }
    })

    // Count total results before pagination
    const countPipeline = [...pipeline, { $count: 'total' }]
    const countResult = await Product.aggregate(countPipeline)
    const total = countResult.length > 0 ? countResult[0].total : 0

    // Stage 4: Sorting
    const sortStage = this.buildSortStage(sort, q)
    pipeline.push({ $sort: sortStage })

    // Stage 5: Pagination
    const skip = (page - 1) * limit
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    // Stage 6: Project only needed fields
    pipeline.push({
      $project: {
        name: 1,
        description: 1,
        price: 1,
        discountPrice: 1,
        images: 1,
        category: 1,
        fabric: 1,
        color: 1,
        stock: 1,
        totalStock: 1,
        featured: 1,
        ratings: 1,
        reviewCount: 1,
        createdAt: 1,
        score: 1
      }
    })

    // Execute the aggregation
    const products = await Product.aggregate(pipeline)

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Build filter query object
   * @param {Object} filters - Filter parameters
   * @returns {Object} - MongoDB filter query
   */
  buildFilterQuery(filters) {
    const query = { isActive: true }

    // Category filter (supports multiple)
    if (filters.category) {
      const categories = filters.category.split(',').map(c => c.trim())
      query.category = categories.length === 1 ? categories[0] : { $in: categories }
    }

    // Fabric filter (supports multiple)
    if (filters.fabric) {
      const fabrics = filters.fabric.split(',').map(f => f.trim())
      query.fabric = fabrics.length === 1 ? fabrics[0] : { $in: fabrics }
    }

    // Color filter (supports multiple)
    if (filters.color) {
      const colors = filters.color.split(',').map(c => c.trim())
      query.color = colors.length === 1 ? colors[0] : { $in: colors }
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      query.price = {}
      if (filters.minPrice) {
        query.price.$gte = parseFloat(filters.minPrice)
      }
      if (filters.maxPrice) {
        query.price.$lte = parseFloat(filters.maxPrice)
      }
    }

    // Occasion filter (if product model has this field)
    if (filters.occasion) {
      const occasions = filters.occasion.split(',').map(o => o.trim())
      query.occasion = occasions.length === 1 ? occasions[0] : { $in: occasions }
    }

    // Work filter (if product model has this field)
    if (filters.work) {
      const works = filters.work.split(',').map(w => w.trim())
      query.work = works.length === 1 ? works[0] : { $in: works }
    }

    // In stock filter
    if (filters.inStock === 'true') {
      query.$expr = {
        $gt: [
          {
            $add: [
              { $ifNull: ['$stock.S', 0] },
              { $ifNull: ['$stock.M', 0] },
              { $ifNull: ['$stock.L', 0] },
              { $ifNull: ['$stock.XL', 0] }
            ]
          },
          0
        ]
      }
    }

    // Minimum rating filter
    if (filters.minRating) {
      query['ratings.average'] = { $gte: parseFloat(filters.minRating) }
    }

    return query
  }

  /**
   * Build sort stage for aggregation
   * @param {String} sortOption - Sort option
   * @param {String} hasQuery - Whether text search is active
   * @returns {Object} - MongoDB sort object
   */
  buildSortStage(sortOption, hasQuery) {
    const sortStage = {}

    switch (sortOption) {
      case 'relevance':
        if (hasQuery) {
          sortStage.score = -1 // Sort by text search relevance
        } else {
          sortStage.createdAt = -1 // Default to newest if no search query
        }
        break

      case 'price-asc':
      case 'price_asc':
        sortStage.price = 1
        break

      case 'price-desc':
      case 'price_desc':
        sortStage.price = -1
        break

      case 'rating':
        sortStage['ratings.average'] = -1
        sortStage['ratings.count'] = -1
        break

      case 'newest':
        sortStage.createdAt = -1
        break

      case 'popular':
        sortStage.reviewCount = -1
        sortStage['ratings.average'] = -1
        break

      default:
        sortStage.createdAt = -1
    }

    return sortStage
  }

  /**
   * Get search suggestions for autocomplete
   * @param {String} query - Search query
   * @param {Number} limit - Number of suggestions
   * @returns {Array} - Array of suggestions
   */
  async getSuggestions(query, limit = 10) {
    if (!query || query.trim().length < 2) {
      return []
    }

    try {
      // Search in product names using regex for partial matching
      const regex = new RegExp(query.trim(), 'i')
      
      const suggestions = await Product.find({
        isActive: true,
        $or: [
          { name: regex },
          { category: regex },
          { fabric: regex },
          { color: regex }
        ]
      })
        .select('name category fabric color')
        .limit(limit)
        .lean()

      // Format suggestions
      const formatted = suggestions.map(product => ({
        text: product.name,
        category: product.category,
        type: 'product'
      }))

      // Add unique categories and fabrics
      const categories = [...new Set(suggestions.map(p => p.category))]
        .filter(c => c.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(cat => ({ text: cat, type: 'category' }))

      const fabrics = [...new Set(suggestions.map(p => p.fabric))]
        .filter(f => f.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(fab => ({ text: fab, type: 'fabric' }))

      return [...formatted, ...categories, ...fabrics].slice(0, limit)
    } catch (error) {
      console.error('Error getting suggestions:', error)
      return []
    }
  }

  /**
   * Get available filter options based on current search/filters
   * @param {Object} currentFilters - Current active filters
   * @returns {Object} - Available filter options
   */
  async getAvailableFilters(currentFilters = {}) {
    try {
      const baseQuery = { isActive: true }

      // Apply current filters to get relevant options
      if (currentFilters.category) {
        baseQuery.category = currentFilters.category
      }

      const [categories, fabrics, colors] = await Promise.all([
        Product.distinct('category', baseQuery),
        Product.distinct('fabric', baseQuery),
        Product.distinct('color', baseQuery)
      ])

      // Get price range
      const priceRange = await Product.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ])

      return {
        categories: categories.sort(),
        fabrics: fabrics.sort(),
        colors: colors.sort(),
        priceRange: priceRange.length > 0 
          ? { min: priceRange[0].minPrice, max: priceRange[0].maxPrice }
          : { min: 0, max: 100000 }
      }
    } catch (error) {
      console.error('Error getting available filters:', error)
      return {
        categories: [],
        fabrics: [],
        colors: [],
        priceRange: { min: 0, max: 100000 }
      }
    }
  }
}

export default new SearchService()
