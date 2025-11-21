import Product from '../models/product.model.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      fabric,
      colorFamily,
      occasion,
      work,
      minPrice,
      maxPrice,
      weave,
      zariType,
      origin,
      collection,
      sort,
      page = 1,
      limit = 12,
      search,
      featured,
      bestseller,
      newArrival,
      exclusive,
      limitedEdition,
      inStock,
      blousePiece,
      freeShipping,
      returnable
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Category filters
    if (category) {
      if (category.includes(',')) {
        filter.category = { $in: category.split(',') };
      } else {
        filter.category = category;
      }
    }
    if (subcategory) {
      if (subcategory.includes(',')) {
        filter.subcategory = { $in: subcategory.split(',') };
      } else {
        filter.subcategory = subcategory;
      }
    }
    
    // Fabric & Material filters
    if (fabric) {
      if (fabric.includes(',')) {
        filter.fabric = { $in: fabric.split(',') };
      } else {
        filter.fabric = fabric;
      }
    }
    if (colorFamily) {
      if (colorFamily.includes(',')) {
        filter.colorFamily = { $in: colorFamily.split(',') };
      } else {
        filter.colorFamily = colorFamily;
      }
    }
    
    // Occasion & Work filters
    if (occasion) filter.occasion = { $in: occasion.split(',') };
    if (work) filter.work = { $in: work.split(',') };
    
    // Weave & Zari filters
    if (weave) filter.weave = weave;
    if (zariType) filter.zariType = zariType;
    
    // Origin filter
    if (origin) filter['origin.region'] = origin;
    
    // Collection filter
    if (collection) filter['collection.name'] = collection;
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { 'origin.region': { $regex: search, $options: 'i' } },
        { 'collection.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Product flags
    if (featured === 'true') filter.featured = true;
    if (bestseller === 'true') filter.bestseller = true;
    if (newArrival === 'true') filter.newArrival = true;
    if (exclusive === 'true') filter.exclusive = true;
    if (limitedEdition === 'true') filter.limitedEdition = true;
    if (inStock === 'true') filter.stock = { $gt: 0 };
    
    // Additional filters
    if (blousePiece === 'true') filter.blousePiece = true;
    if (freeShipping === 'true') filter['shippingInfo.freeShipping'] = true;
    if (returnable === 'true') filter['returnPolicy.returnable'] = true;

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { sales: -1, views: -1 };
        break;
      case 'rating':
        sortOption = { 'ratings.average': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .select('-reviews -__v');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Get filter options for frontend
    const filterOptions = await getFilterOptions();

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      filters: filterOptions
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Helper function to get filter options
const getFilterOptions = async () => {
  try {
    const [
      categories,
      subcategories,
      fabrics,
      colors,
      weaves,
      zariTypes,
      origins,
      collections,
      priceRange,
      productCounts
    ] = await Promise.all([
      Product.distinct('category', { status: 'active' }),
      Product.distinct('subcategory', { status: 'active' }),
      Product.distinct('fabric', { status: 'active' }),
      Product.distinct('colorFamily', { status: 'active' }),
      Product.distinct('weave', { status: 'active' }),
      Product.distinct('zariType', { status: 'active' }),
      Product.distinct('origin.region', { status: 'active' }),
      Product.distinct('collection.name', { status: 'active' }),
      Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]),
      Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            featured: { $sum: { $cond: ['$featured', 1, 0] } },
            bestseller: { $sum: { $cond: ['$bestseller', 1, 0] } },
            newArrival: { $sum: { $cond: ['$newArrival', 1, 0] } },
            exclusive: { $sum: { $cond: ['$exclusive', 1, 0] } },
            inStock: { $sum: { $cond: [{ $gt: ['$stock', 0] }, 1, 0] } }
          }
        }
      ])
    ]);

    return {
      categories: categories.filter(Boolean).sort(),
      subcategories: subcategories.filter(Boolean).sort(),
      fabrics: fabrics.filter(Boolean).sort(),
      colors: colors.filter(Boolean).sort(),
      weaves: weaves.filter(Boolean).sort(),
      zariTypes: zariTypes.filter(Boolean).sort(),
      origins: origins.filter(Boolean).sort(),
      collections: collections.filter(Boolean).sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100000 },
      occasions: ['Wedding', 'Party', 'Festival', 'Casual', 'Office', 'Traditional', 'Formal'],
      work: ['Zari', 'Embroidery', 'Sequins', 'Stone Work', 'Print', 'Plain', 'Woven', 'Hand Painted'],
      counts: productCounts[0] || { total: 0, featured: 0, bestseller: 0, newArrival: 0, exclusive: 0, inStock: 0 }
    };
  } catch (error) {
    console.error('Get filter options error:', error);
    return {};
  }
};

// @desc    Get filter options
// @route   GET /api/products/filters/options
// @access  Public
export const getFilters = async (req, res) => {
  try {
    const filterOptions = await getFilterOptions();
    
    res.json({
      success: true,
      data: filterOptions
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filters',
      error: error.message
    });
  }
};
