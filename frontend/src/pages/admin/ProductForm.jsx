import { useState, useEffect } from 'react';
import { apiGet, getImageUrl } from '../../utils/apiClient';
import './ProductForm.css';

const ProductForm = ({ existingProduct = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    price: existingProduct?.price || '',
    discountPrice: existingProduct?.discountPrice || '',
    category: existingProduct?.category || 'Sarees',
    fabric: existingProduct?.fabric || '',
    color: existingProduct?.color || '',
    stock: existingProduct?.stock || { S: 0, M: 0, L: 0, XL: 0 },
    featured: existingProduct?.featured || false,
  });

  const [selectedImages, setSelectedImages] = useState(existingProduct?.images || []);
  const [availableImages, setAvailableImages] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = [
    'Sarees',
    'Silk Saree',
    'Cotton Saree',
    'Designer Saree',
    'Party Wear',
    'Bridal Saree',
    'Traditional Saree',
    'Contemporary Saree',
    'Casual Saree',
  ];

  // Load available images
  useEffect(() => {
    loadAvailableImages();
  }, []);

  const loadAvailableImages = async () => {
    try {
      const res = await apiGet('/api/images');
      if (res.success) {
        setAvailableImages(res.data || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStockChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: parseInt(value) || 0
      }
    }));
  };

  const handleImageSelect = (image) => {
    if (selectedImages.find(img => (img.fileId || img._id || img) === (image.fileId || image._id))) {
      // Remove if already selected
      setSelectedImages(prev => prev.filter(img => (img.fileId || img._id || img) !== (image.fileId || image._id)));
    } else {
      // Add to selected
      setSelectedImages(prev => [...prev, image.fileId || image._id]);
    }
  };

  const handleRemoveImage = (idx) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        images: selectedImages.map(img => typeof img === 'string' ? img : (img.fileId || img._id)),
      };

      const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
      const url = existingProduct ? `${BASE_URL}/api/products/${existingProduct._id}` : `${BASE_URL}/api/products`;
      const method = existingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to save product');

      setSuccess(existingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      if (onSuccess) onSuccess(data.data);

      // Reset form if creating new
      if (!existingProduct) {
        setFormData({
          name: '',
          description: '',
          price: '',
          discountPrice: '',
          category: 'Sarees',
          fabric: '',
          color: '',
          stock: { S: 0, M: 0, L: 0, XL: 0 },
          featured: false,
        });
        setSelectedImages([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isImageSelected = (image) => {
    return selectedImages.some(img => {
      const imgId = typeof img === 'string' ? img : (img.fileId || img._id);
      const imageId = image.fileId || image._id;
      return imgId === imageId;
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{existingProduct ? 'Edit Product' : 'Create New Product'}</h2>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="form-group">
        <label htmlFor="name">Product Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
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
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountPrice">Discount Price (₹)</label>
          <input
            type="number"
            id="discountPrice"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>

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
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fabric">Fabric *</label>
          <input
            type="text"
            id="fabric"
            name="fabric"
            value={formData.fabric}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="color">Color *</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Stock by Size *</label>
        <div className="stock-grid">
          {['S', 'M', 'L', 'XL'].map(size => (
            <div key={size} className="stock-input-group">
              <label htmlFor={`stock-${size}`}>{size}</label>
              <input
                type="number"
                id={`stock-${size}`}
                value={formData.stock[size] || 0}
                onChange={(e) => handleStockChange(size, e.target.value)}
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <span>Featured Product</span>
        </label>
      </div>

      <div className="form-group">
        <label>Product Images *</label>
        <p className="field-hint">Select images from Media Manager</p>
        
        <button 
          type="button" 
          className="btn-secondary"
          onClick={() => setShowImageSelector(!showImageSelector)}
        >
          {showImageSelector ? 'Hide' : 'Select'} Images from Media
        </button>

        {showImageSelector && (
          <div className="image-selector">
            {availableImages.length === 0 ? (
              <p>No images available. Upload images in Media Manager first.</p>
            ) : (
              <div className="available-images-grid">
                {availableImages.map((image) => (
                  <div
                    key={image._id}
                    className={`selectable-image ${isImageSelected(image) ? 'selected' : ''}`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img src={getImageUrl(image.fileId || image._id)} alt={image.filename} />
                    {isImageSelected(image) && <div className="selected-overlay">✓</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {selectedImages.length > 0 && (
          <div className="selected-images">
            <h4>Selected Images ({selectedImages.length})</h4>
            <div className="uploaded-images">
              {selectedImages.map((img, idx) => {
                const imgId = typeof img === 'string' ? img : (img.fileId || img._id);
                return (
                  <div key={idx} className="uploaded-image-item">
                    <img src={getImageUrl(imgId)} alt={`Selected ${idx + 1}`} />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="remove-btn">×</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Saving...' : existingProduct ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;
