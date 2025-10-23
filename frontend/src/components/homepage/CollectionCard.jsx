import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './CollectionCard.css'

const CollectionCard = ({ id, name, image, itemCount, slug }) => {
  return (
    <Link 
      to={`/collections/${slug}`} 
      className="collection-card"
      aria-label={`View ${name} collection with ${itemCount} items`}
    >
      {/* Collection Image */}
      <div className="collection-image-container">
        <img 
          src={image} 
          alt={`${name} collection`}
          className="collection-image"
          loading="lazy"
        />
      </div>

      {/* Hover Overlay */}
      <div className="collection-overlay">
        <div className="collection-info">
          <h3 className="collection-name">{name}</h3>
          <p className="collection-count">{itemCount} Items</p>
        </div>
      </div>
    </Link>
  )
}

CollectionCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  itemCount: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
}

export default CollectionCard
