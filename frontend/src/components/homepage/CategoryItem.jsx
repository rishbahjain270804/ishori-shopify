import PropTypes from 'prop-types'
import './CategoryItem.css'

const CategoryItem = ({ name, icon, slug }) => {
  return (
    <a href={`/collections?category=${slug}`} className="category-item">
      <div className="category-icon-container">
        <img src={icon} alt={name} className="category-icon" />
      </div>
      <span className="category-label">{name}</span>
    </a>
  )
}

CategoryItem.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
}

export default CategoryItem
