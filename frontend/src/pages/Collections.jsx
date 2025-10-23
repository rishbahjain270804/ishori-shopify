import './Collections.css';
import collection1 from '../assets/collection1.avif';
import collection2 from '../assets/collection2.avif';
import collection3 from '../assets/collection3.avif';
import collection4 from '../assets/collection4.avif';

import { useEffect, useState } from 'react';
import { apiGet, getImageUrl } from '@/utils/apiClient';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    apiGet('/api/products')
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setCollections(data.data);
        } else {
          setError(data.message || 'Failed to load products');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Error fetching products');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div className="collections-grid">Loading collections...</div>;
  if (error) return <div className="collections-grid">{error}</div>;

  return (
    <div className="collections-grid">
      {collections.map(col => (
        <div className="collection-box" key={col._id}>
          <img src={getImageUrl(col.images?.[0]) || collection1} alt={col.name} className="collection-img" />
          <h3>{col.name}</h3>
          <p className="collection-price">	₹{col.price}</p>
          <button className="know-more-btn" onClick={() => window.location.href = `/product/${col._id}`}>Know More</button>
        </div>
      ))}
    </div>
  );
}

export default Collections
