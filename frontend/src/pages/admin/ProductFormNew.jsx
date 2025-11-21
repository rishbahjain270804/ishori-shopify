import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../config/api';
import './ProductFormNew.css';

const ProductFormNew = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    
    // Category & Classification
    category: 'Silk',
    subcategory: '',
    fabric: 'Pure Silk',
    color: '',
    colorFamily: 'Red',
    
    // Occasions & Work
    occasion: [],
    work: [],
    
    // Saree Specifications
    length: 6.3,
    blousePiece: true,
    blouseLength: 0.8,
    
    // Border Details
    borderType: '',
    borderWidth: '',
    borderDescription: '',
    
    // Pallu Details
    palluDesign: '',
    palluLength: '',
    palluDescription: '',
    
    // Weave & Quality
    weave: '',
    zariType: '',
    threadCount: '',
    
    // Origin
    originRegion: '',
    originState: '',
    originCountry: 'India',
    
    // Certifications
    certifications: [],
    
    // Care Instructions
    washing: 'Dry Clean Only',
    ironing: '',
    storage: '',
    specialCare: '',
    
    // Customization
    blouseStitchingAvailable: false,
    blouseStitchingPrice: '',
    fallPicoAvailable: false,
    fallPicoPrice: '',
    customLengthAvailable: false,
    
    // Inventory
    stock: 0,
    sku: '',
    weight: '',
    
    // Shipping
    processingTime: '2-3 business days',
    estimatedDelivery: '5-7 business days',
    freeShipping: false,
    shippingCharge: 0,
    codAvailable: true,
    
    // Returns
    returnable: true,
    returnWindow: 7,
    returnConditions: '',
    
    // Collection
    collectionName: '',
    collectionSeason: '',
    collectionYear: new Date().getFullYear(),
    
    // Designer
    designerName: '',
    designerBrand: '',
    
    // Product Flags
    featured: false,
    bestseller: false,
    newArrival: false,
    exclusive: false,
    limitedEdition: false,
    status: 'active',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    
    // Tags
    tags: '',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load product if editing
  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(id);
      if (response.data.success) {
        const product = response.data.data;
        // Map product data to form
        setFormData({
          ...formData,
          ...product,
          borderType: product.border?.type || '',
          borderWidth: product.border?.width || '',
          borderDescription: product.border?.description || '',
          palluDesign: product.pallu?.design || '',
          palluLength: product.pallu?.length || '',
          palluDescription: product.pallu?.description || '',
          originRegion: product.origin?.region || '',
          originState: product.origin?.state || '',
          originCountry: product.origin?.country || 'India',
          washing: product.careInstructions?.washing || 'Dry Clean Only',
          ironing: product.careInstructions?.ironing || '',
          storage: product.careInstructions?.storage || '',
          specialCare: product.careInstructions?.specialCare || '',
          blouseStitchingAvailable: product.customization?.blouseStitching?.available || false,
          blouseStitchingPrice: product.customization?.blouseStitching?.price || '',
          fallPicoAvailable: product.customization?.fallPico?.available || false,
          fallPicoPrice: product.customization?.fallPico?.price || '',
          customLengthAvailable: product.customization?.customLength?.available || false,
          processingTime: product.shippingInfo?.processingTime || '2-3 business days',
          estimatedDelivery: product.shippingInfo?.estimatedDelivery || '5-7 business days',
          freeShipping: product.shippingInfo?.freeShipping || false,
          shippingCharge: product.shippingInfo?.shippingCharge || 0,
          codAvailable: product.shippingInfo?.codAvailable || true,
          returnable: product.returnPolicy?.returnable || true,
          returnWindow: product.returnPolicy?.returnWindow || 7,
          returnConditions: product.returnPolicy?.conditions || '',
          collectionName: product.collection?.name || '',
          collectionSeason: product.collection?.season || '',
          collectionYear: product.collection?.year || new Date().getFullYear(),
          designerName: product.designer?.name || '',
          designerBrand: product.designer?.brand || '',
          tags: product.tags?.join(', ') || '',
          metaKeywords: product.metaKeywords?.join(', ') || '',
        });
        setImages(product.images || []);
      }
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const current = prev[name] || [];
      const index = current.indexOf(value);
      if (index > -1) {
        return { ...prev, [name]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // For now, just store file names - implement actual upload later
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      isPrimary: images.length === 0
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        fabric: formData.fabric,
        color: formData.color,
        colorFamily: formData.colorFamily,
        occasion: formData.occasion,
        work: formData.work,
        length: parseFloat(formData.length),
        blousePiece: formData.blousePiece,
        blouseLength: parseFloat(formData.blouseLength),
        border: {
          type: formData.borderType,
          width: formData.borderWidth,
          description: formData.borderDescription
        },
        pallu: {
          design: formData.palluDesign,
          length: formData.palluLength,
          description: formData.palluDescription
        },
        weave: formData.weave || undefined,
        zariType: formData.zariType || undefined,
        threadCount: formData.threadCount ? parseInt(formData.threadCount) : undefined,
        origin: {
          region: formData.originRegion,
          state: formData.originState,
          country: formData.originCountry
        },
        certifications: formData.certifications,
        careInstructions: {
          washing: formData.washing,
          ironing: formData.ironing,
          storage: formData.storage,
          specialCare: formData.specialCare
        },
        customization: {
          blouseStitching: {
            available: formData.blouseStitchingAvailable,
            price: formData.blouseStitchingPrice ? parseFloat(formData.blouseStitchingPrice) : undefined
          },
          fallPico: {
            available: formData.fallPicoAvailable,
            price: formData.fallPicoPrice ? parseFloat(formData.fallPicoPrice) : undefined
          },
          customLength: {
            available: formData.customLengthAvailable
          }
        },
        images: images,
        stock: parseInt(formData.stock),
        sku: formData.sku,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        shippingInfo: {
          processingTime: formData.processingTime,
          estimatedDelivery: formData.estimatedDelivery,
          freeShipping: formData.freeShipping,
          shippingCharge: parseFloat(formData.shippingCharge),
          codAvailable: formData.codAvailable
        },
        returnPolicy: {
          returnable: formData.returnable,
          returnWindow: parseInt(formData.returnWindow),
          conditions: formData.returnConditions
        },
        collection: {
          name: formData.collectionName,
          season: formData.collectionSeason,
          year: parseInt(formData.collectionYear)
        },
        designer: {
          name: formData.designerName,
          brand: formData.designerBrand
        },
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        featured: formData.featured,
        bestseller: formData.bestseller,
        newArrival: formData.newArrival,
        exclusive: formData.exclusive,
        limitedEdition: formData.limitedEdition,
        status: formData.status,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords.split(',').map(k => k.trim()).filter(Boolean)
      };

      let response;
      if (isEditMode) {
        response = await productAPI.updateProduct(id, productData);
      } else {
        response = await productAPI.createProduct(productData);
      }

      if (response.data.success) {
        setSuccess(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading-state">Loading product...</div>;
  }

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
        <button onClick={() => navigate('/admin/products')} className="btn-secondary">
          Back to Products
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Information */}
        <section className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Royal Banarasi Silk Saree"
            />
          </div>

          <div className="form-group">
            <label htmlFor="shortDescription">Short Description *</label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              maxLength="500"
              placeholder="Brief description for listings"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Full Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Detailed product description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="originalPrice">Original Price (₹)</label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="For showing discount"
              />
            </div>
          </div>
        </section>

        {/* Category & Classification */}
        <section className="form-section">
          <h2>Category & Classification</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Bridal">Bridal</option>
                <option value="Silk">Silk</option>
                <option value="Cotton">Cotton</option>
                <option value="Designer">Designer</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Heritage">Heritage</option>
                <option value="Festive">Festive</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subcategory">Subcategory</label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Banarasi">Banarasi</option>
                <option value="Kanjivaram">Kanjivaram</option>
                <option value="Patola">Patola</option>
                <option value="Chanderi">Chanderi</option>
                <option value="Tussar">Tussar</option>
                <option value="Georgette">Georgette</option>
                <option value="Chiffon">Chiffon</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fabric">Fabric *</label>
              <select
                id="fabric"
                name="fabric"
                value={formData.fabric}
                onChange={handleChange}
                required
              >
                <option value="Pure Silk">Pure Silk</option>
                <option value="Art Silk">Art Silk</option>
                <option value="Cotton">Cotton</option>
                <option value="Cotton Silk">Cotton Silk</option>
                <option value="Georgette">Georgette</option>
                <option value="Chiffon">Chiffon</option>
                <option value="Crepe">Crepe</option>
                <option value="Net">Net</option>
                <option value="Velvet">Velvet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Color *</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                placeholder="e.g., Maroon, Emerald Green"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="colorFamily">Color Family *</label>
            <select
              id="colorFamily"
              name="colorFamily"
              value={formData.colorFamily}
              onChange={handleChange}
              required
            >
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              <option value="Pink">Pink</option>
              <option value="Purple">Purple</option>
              <option value="Orange">Orange</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Multi">Multi</option>
            </select>
          </div>
        </section>

        {/* Occasions & Work */}
        <section className="form-section">
          <h2>Occasions & Work Type</h2>
          
          <div className="form-group">
            <label>Occasions</label>
            <div className="checkbox-group">
              {['Wedding', 'Party', 'Festival', 'Casual', 'Office', 'Traditional', 'Formal'].map(occ => (
                <label key={occ} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.occasion.includes(occ)}
                    onChange={() => handleMultiSelect('occasion', occ)}
                  />
                  {occ}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Work Type</label>
            <div className="checkbox-group">
              {['Zari', 'Embroidery', 'Sequins', 'Stone Work', 'Print', 'Plain', 'Woven', 'Hand Painted'].map(work => (
                <label key={work} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.work.includes(work)}
                    onChange={() => handleMultiSelect('work', work)}
                  />
                  {work}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Saree Specifications */}
        <section className="form-section">
          <h2>Saree Specifications</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="length">Length (meters) *</label>
              <input
                type="number"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                required
                min="5"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="blouseLength">Blouse Length (meters)</label>
              <input
                type="number"
                id="blouseLength"
                name="blouseLength"
                value={formData.blouseLength}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="blousePiece"
                checked={formData.blousePiece}
                onChange={handleChange}
              />
              Includes Blouse Piece
            </label>
          </div>

          {/* Border Details */}
          <h3>Border Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="borderType">Border Type</label>
              <select
                id="borderType"
                name="borderType"
                value={formData.borderType}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Zari">Zari</option>
                <option value="Contrast">Contrast</option>
                <option value="Self">Self</option>
                <option value="Embroidered">Embroidered</option>
                <option value="Plain">Plain</option>
                <option value="Woven">Woven</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="borderWidth">Border Width</label>
              <input
                type="text"
                id="borderWidth"
                name="borderWidth"
                value={formData.borderWidth}
                onChange={handleChange}
                placeholder="e.g., 4 inches"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="borderDescription">Border Description</label>
            <textarea
              id="borderDescription"
              name="borderDescription"
              value={formData.borderDescription}
              onChange={handleChange}
              rows="2"
              placeholder="Describe the border design"
            />
          </div>

          {/* Pallu Details */}
          <h3>Pallu Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="palluDesign">Pallu Design</label>
              <input
                type="text"
                id="palluDesign"
                name="palluDesign"
                value={formData.palluDesign}
                onChange={handleChange}
                placeholder="e.g., Mughal Motifs"
              />
            </div>

            <div className="form-group">
              <label htmlFor="palluLength">Pallu Length</label>
              <input
                type="text"
                id="palluLength"
                name="palluLength"
                value={formData.palluLength}
                onChange={handleChange}
                placeholder="e.g., 1.2 meters"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="palluDescription">Pallu Description</label>
            <textarea
              id="palluDescription"
              name="palluDescription"
              value={formData.palluDescription}
              onChange={handleChange}
              rows="2"
              placeholder="Describe the pallu design"
            />
          </div>

          {/* Weave & Quality */}
          <h3>Weave & Quality</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weave">Weave Type</label>
              <select
                id="weave"
                name="weave"
                value={formData.weave}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Handloom">Handloom</option>
                <option value="Powerloom">Powerloom</option>
                <option value="Hand Woven">Hand Woven</option>
                <option value="Machine Made">Machine Made</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="zariType">Zari Type</label>
              <select
                id="zariType"
                name="zariType"
                value={formData.zariType}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Pure Zari">Pure Zari</option>
                <option value="Tested Zari">Tested Zari</option>
                <option value="Imitation Zari">Imitation Zari</option>
                <option value="No Zari">No Zari</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="threadCount">Thread Count</label>
            <input
              type="number"
              id="threadCount"
              name="threadCount"
              value={formData.threadCount}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 400"
            />
          </div>
        </section>

        {/* Origin & Authenticity */}
        <section className="form-section">
          <h2>Origin & Authenticity</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originRegion">Region</label>
              <input
                type="text"
                id="originRegion"
                name="originRegion"
                value={formData.originRegion}
                onChange={handleChange}
                placeholder="e.g., Varanasi, Kanchipuram"
              />
            </div>

            <div className="form-group">
              <label htmlFor="originState">State</label>
              <input
                type="text"
                id="originState"
                name="originState"
                value={formData.originState}
                onChange={handleChange}
                placeholder="e.g., Uttar Pradesh"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Certifications</label>
            <div className="checkbox-group">
              {['Silk Mark', 'Handloom Mark', 'GI Tag', 'ISO Certified', 'Eco Friendly'].map(cert => (
                <label key={cert} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.certifications.includes(cert)}
                    onChange={() => handleMultiSelect('certifications', cert)}
                  />
                  {cert}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="form-section">
          <h2>Care Instructions</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="washing">Washing *</label>
              <select
                id="washing"
                name="washing"
                value={formData.washing}
                onChange={handleChange}
                required
              >
                <option value="Dry Clean Only">Dry Clean Only</option>
                <option value="Hand Wash">Hand Wash</option>
                <option value="Machine Wash Cold">Machine Wash Cold</option>
                <option value="Gentle Hand Wash">Gentle Hand Wash</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ironing">Ironing</label>
              <input
                type="text"
                id="ironing"
                name="ironing"
                value={formData.ironing}
                onChange={handleChange}
                placeholder="e.g., Low heat on reverse side"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="storage">Storage</label>
              <input
                type="text"
                id="storage"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                placeholder="e.g., Store in muslin cloth"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialCare">Special Care</label>
              <input
                type="text"
                id="specialCare"
                name="specialCare"
                value={formData.specialCare}
                onChange={handleChange}
                placeholder="e.g., Avoid direct sunlight"
              />
            </div>
          </div>
        </section>

        {/* Customization Options */}
        <section className="form-section">
          <h2>Customization Options</h2>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="blouseStitchingAvailable"
                checked={formData.blouseStitchingAvailable}
                onChange={handleChange}
              />
              Blouse Stitching Available
            </label>
            {formData.blouseStitchingAvailable && (
              <input
                type="number"
                name="blouseStitchingPrice"
                value={formData.blouseStitchingPrice}
                onChange={handleChange}
                placeholder="Price (₹)"
                min="0"
                className="mt-2"
              />
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="fallPicoAvailable"
                checked={formData.fallPicoAvailable}
                onChange={handleChange}
              />
              Fall & Pico Available
            </label>
            {formData.fallPicoAvailable && (
              <input
                type="number"
                name="fallPicoPrice"
                value={formData.fallPicoPrice}
                onChange={handleChange}
                placeholder="Price (₹)"
                min="0"
                className="mt-2"
              />
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="customLengthAvailable"
                checked={formData.customLengthAvailable}
                onChange={handleChange}
              />
              Custom Length Available
            </label>
          </div>
        </section>

        {/* Inventory & Logistics */}
        <section className="form-section">
          <h2>Inventory & Logistics</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="e.g., ISH-BAN-001"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (grams)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 800"
            />
          </div>
        </section>

        {/* Shipping Information */}
        <section className="form-section">
          <h2>Shipping Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="processingTime">Processing Time</label>
              <input
                type="text"
                id="processingTime"
                name="processingTime"
                value={formData.processingTime}
                onChange={handleChange}
                placeholder="e.g., 2-3 business days"
              />
            </div>

            <div className="form-group">
              <label htmlFor="estimatedDelivery">Estimated Delivery</label>
              <input
                type="text"
                id="estimatedDelivery"
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                placeholder="e.g., 5-7 business days"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="freeShipping"
                  checked={formData.freeShipping}
                  onChange={handleChange}
                />
                Free Shipping
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="shippingCharge">Shipping Charge (₹)</label>
              <input
                type="number"
                id="shippingCharge"
                name="shippingCharge"
                value={formData.shippingCharge}
                onChange={handleChange}
                min="0"
                disabled={formData.freeShipping}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="codAvailable"
                checked={formData.codAvailable}
                onChange={handleChange}
              />
              Cash on Delivery Available
            </label>
          </div>
        </section>

        {/* Return Policy */}
        <section className="form-section">
          <h2>Return Policy</h2>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="returnable"
                checked={formData.returnable}
                onChange={handleChange}
              />
              Product is Returnable
            </label>
          </div>

          {formData.returnable && (
            <>
              <div className="form-group">
                <label htmlFor="returnWindow">Return Window (days)</label>
                <input
                  type="number"
                  id="returnWindow"
                  name="returnWindow"
                  value={formData.returnWindow}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="returnConditions">Return Conditions</label>
                <textarea
                  id="returnConditions"
                  name="returnConditions"
                  value={formData.returnConditions}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Product must be unused with original tags"
                />
              </div>
            </>
          )}
        </section>

        {/* Collection & Designer */}
        <section className="form-section">
          <h2>Collection & Designer</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="collectionName">Collection Name</label>
              <input
                type="text"
                id="collectionName"
                name="collectionName"
                value={formData.collectionName}
                onChange={handleChange}
                placeholder="e.g., Royal Heritage"
              />
            </div>

            <div className="form-group">
              <label htmlFor="collectionSeason">Season</label>
              <input
                type="text"
                id="collectionSeason"
                name="collectionSeason"
                value={formData.collectionSeason}
                onChange={handleChange}
                placeholder="e.g., Wedding, Festive"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="collectionYear">Year</label>
              <input
                type="number"
                id="collectionYear"
                name="collectionYear"
                value={formData.collectionYear}
                onChange={handleChange}
                min="2000"
                max="2100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="designerName">Designer Name</label>
              <input
                type="text"
                id="designerName"
                name="designerName"
                value={formData.designerName}
                onChange={handleChange}
                placeholder="e.g., Ishori Couture"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="designerBrand">Designer Brand</label>
            <input
              type="text"
              id="designerBrand"
              name="designerBrand"
              value={formData.designerBrand}
              onChange={handleChange}
              placeholder="e.g., Ishori"
            />
          </div>
        </section>

        {/* Product Flags */}
        <section className="form-section">
          <h2>Product Flags</h2>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Product
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
              />
              Bestseller
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
              />
              New Arrival
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="exclusive"
                checked={formData.exclusive}
                onChange={handleChange}
              />
              Exclusive
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="limitedEdition"
                checked={formData.limitedEdition}
                onChange={handleChange}
              />
              Limited Edition
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </section>

        {/* Images */}
        <section className="form-section">
          <h2>Product Images</h2>
          
          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="file-input"
            />
            <p className="field-hint">Upload product images (JPG, PNG, AVIF)</p>
          </div>

          {images.length > 0 && (
            <div className="images-preview">
              {images.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img src={img.url} alt={img.alt || `Image ${index + 1}`} />
                  <div className="image-actions">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      className={`btn-small ${img.isPrimary ? 'active' : ''}`}
                    >
                      {img.isPrimary ? 'Primary' : 'Set Primary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn-small btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SEO & Tags */}
        <section className="form-section">
          <h2>SEO & Tags</h2>
          
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Comma-separated tags (e.g., banarasi, silk, wedding)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="metaTitle">Meta Title</label>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              maxLength="60"
              placeholder="SEO title (max 60 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="metaDescription">Meta Description</label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows="3"
              maxLength="160"
              placeholder="SEO description (max 160 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="metaKeywords">Meta Keywords</label>
            <input
              type="text"
              id="metaKeywords"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleChange}
              placeholder="Comma-separated keywords"
            />
          </div>
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormNew;
