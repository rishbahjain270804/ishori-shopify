import { useState, useEffect } from 'react'
import CollectionCard from './CollectionCard'
import { apiGet } from '@/utils/apiClient'
import './FeaturedCollectionsSection.css'

const FeaturedCollectionsSection = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiGet('/api/collections?featured=true&limit=6')
        const collectionsData = data.collections || data || []
        setCollections(Array.isArray(collectionsData) ? collectionsData : [])
      } catch (err) {
        console.error('Failed to fetch collections:', err)
        setError('Unable to load collections. Please refresh the page.')
        setCollections([]) // Ensure collections is always an array
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return (
    <section className="featured-collections-section">
      <div className="section-container">
        <h2 className="section-title">Featured Collections</h2>
        
        {loading && (
          <div className="collections-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="collection-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-count"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="collections-error">
            <p className="error-message">{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="collections-grid">
            {collections.map((collection) => (
              <CollectionCard
                key={collection._id || collection.id}
                id={collection._id || collection.id}
                name={collection.name}
                image={collection.image}
                itemCount={collection.itemCount}
                slug={collection.slug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedCollectionsSection
