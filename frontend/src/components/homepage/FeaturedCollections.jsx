import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCollections.css';

const FeaturedCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setCollections([
        {
          id: 1,
          name: 'Bridal Elegance',
          image: '/src/assets/collection1.avif',
          itemCount: 45,
          slug: 'bridal-elegance',
          color: 'ruby'
        },
        {
          id: 2,
          name: 'Royal Silk',
          image: '/src/assets/collection1.avif',
          itemCount: 38,
          slug: 'royal-silk',
          color: 'sapphire'
        },
        {
          id: 3,
          name: 'Heritage Collection',
          image: '/src/assets/collection1.avif',
          itemCount: 52,
          slug: 'heritage',
          color: 'emerald'
        },
        {
          id: 4,
          name: 'Contemporary Luxe',
          image: '/src/assets/collection1.avif',
          itemCount: 29,
          slug: 'contemporary',
          color: 'amethyst'
        },
        {
          id: 5,
          name: 'Festive Grandeur',
          image: '/src/assets/collection1.avif',
          itemCount: 41,
          slug: 'festive',
          color: 'topaz'
        },
        {
          id: 6,
          name: 'Designer Exclusive',
          image: '/src/assets/collection1.avif',
          itemCount: 33,
          slug: 'designer',
          color: 'gold'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <section className="featured-collections">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Curated for You</span>
            <h2 className="section-title">Featured Collections</h2>
          </div>
          <div className="collections-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="collection-skeleton"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-collections">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Curated for You</span>
          <h2 className="section-title">Featured Collections</h2>
          <p className="section-description">
            Explore our handpicked collections, each telling a unique story of craftsmanship and elegance
          </p>
        </div>

        <div className="collections-grid">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              to={`/collections/${collection.slug}`}
              className={`collection-card ${collection.color}`}
            >
              <div className="collection-image-wrapper">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="collection-image"
                  loading="lazy"
                />
                <div className="collection-overlay"></div>
              </div>
              <div className="collection-content">
                <h3 className="collection-name">{collection.name}</h3>
                <p className="collection-count">{collection.itemCount} Pieces</p>
                <span className="collection-cta">Explore Collection →</span>
              </div>
              <div className={`collection-accent ${collection.color}-accent`}></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
