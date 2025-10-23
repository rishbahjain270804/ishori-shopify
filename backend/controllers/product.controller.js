import Product from '../models/product.model.js'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    // Build filter object
    let filter = { isActive: true }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {}
      if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice)
      if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice)
    }

    // Color filter
    if (req.query.color) {
      filter.color = req.query.color
    }

    // Fabric filter
    if (req.query.fabric) {
      filter.fabric = req.query.fabric
    }

    // Featured filter
    if (req.query.featured === 'true') {
      filter.featured = true
    }

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search }
    }

    // Sort options
    let sortOption = { createdAt: -1 } // Default: newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOption = { price: 1 }
          break
        case 'price_desc':
          sortOption = { price: -1 }
          break
        case 'rating':
          sortOption = { 'ratings.average': -1 }
          break
        case 'newest':
          sortOption = { createdAt: -1 }
          break
        case 'oldest':
          sortOption = { createdAt: 1 }
          break
      }
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('reviews.user', 'name')

    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    })
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    })
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      fabric,
      color,
      stock
    } = req.body

    // Validation
    if (!name || !description || !price || !category || !fabric || !color) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    const normalizedImages = (images || []).map((img) => {
      if (typeof img === 'string') {
        return { url: `/api/images/${img}`, fileId: img }
      }
      if (img.fileId && !img.url) {
        return { ...img, url: `/api/images/${img.fileId}` }
      }
      return img
    })

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      images: normalizedImages,
      category,
      fabric,
      color,
      stock: stock || { S: 0, M: 0, L: 0, XL: 0 },
      featured: req.body.featured || false
    })

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    })
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      fabric,
      color,
      stock,
      featured,
      isActive
    } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Update fields
    if (name) product.name = name
    if (description) product.description = description
    if (price !== undefined) product.price = price
    if (discountPrice !== undefined) product.discountPrice = discountPrice
    if (images) {
      product.images = images.map((img) => {
        if (typeof img === 'string') return { url: `/api/images/${img}`, fileId: img }
        if (img.fileId && !img.url) return { ...img, url: `/api/images/${img.fileId}` }
        return img
      })
    }
    if (category) product.category = category
    if (fabric) product.fabric = fabric
    if (color) product.color = color
    if (stock !== undefined) product.stock = stock
    if (featured !== undefined) product.featured = featured
    if (isActive !== undefined) product.isActive = isActive

    await product.save()

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    })
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    })
  }
}

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true })

    res.status(200).json({
      success: true,
      data: categories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(8)

    res.status(200).json({
      success: true,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    })
  }
}
