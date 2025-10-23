import './CollectionDetail.css';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { apiGet, getImageUrl } from '@/utils/apiClient';
import fallbackImage from '../assets/collection1.avif';

export default function CollectionDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiGet(`/api/products/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.success) setProduct(res.data);
        else setError(res.message || 'Failed to load product');
      })
      .catch((err) => setError(err.message || 'Error loading product'))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  const images = useMemo(() => {
    const arr = product?.images || [];
    return arr.length ? arr.map(getImageUrl).filter(Boolean) : [fallbackImage];
  }, [product]);

  if (loading) {
    return <div className="product-detail-page"><div className="product-detail-container">Loading...</div></div>;
  }
  if (error || !product) {
    return <div className="product-detail-page"><div className="product-detail-container">{error || 'Product not found'}</div></div>;
  }

  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="main-image-container">
            <img src={images[selectedImage]} alt={product.name} className="main-product-img" />
          </div>
          <div className="thumbnail-gallery">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className={`product-thumb ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-rating">★★★★★ <span>({product.reviews?.length || 0} Reviews)</span></div>
          <div className="product-price-section">
            <span className="current-price">₹{currentPrice}</span>
            {hasDiscount && (
              <>
                <span className="old-price">₹{product.price}</span>
                <span className="discount-badge">-{discountPercent}%</span>
              </>
            )}
          </div>
          <div className="product-description">{product.description}</div>
          <div className="product-meta">
            {product.color && (
              <div className="meta-item">
                <span className="meta-label">Color:</span>
                <span className="color-pill">{product.color}</span>
              </div>
            )}
            {product.fabric && (
              <div className="meta-item">
                <span className="meta-label">Fabric:</span>
                <span className="size-pill">{product.fabric}</span>
              </div>
            )}
          </div>
          <div className="product-quantity">
            <span className="quantity-label">Quantity</span>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
          <button className="add-to-cart-btn">Add To Cart</button>
        </div>
      </div>
    </div>
  );
}
