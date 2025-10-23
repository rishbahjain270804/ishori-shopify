import CategoryItem from './CategoryItem'
import './CategoryNavigationSection.css'

// Placeholder icons - replace with actual category images
import placeholderIcon from '../../assets/collection1.avif'

const CategoryNavigationSection = () => {
  const categories = [
    { name: 'Silk Sarees', slug: 'silk-sarees', icon: placeholderIcon },
    { name: 'Cotton Sarees', slug: 'cotton-sarees', icon: placeholderIcon },
    { name: 'Designer Sarees', slug: 'designer-sarees', icon: placeholderIcon },
    { name: 'Wedding Collection', slug: 'wedding-collection', icon: placeholderIcon },
    { name: 'Festive Wear', slug: 'festive-wear', icon: placeholderIcon },
    { name: 'Casual Wear', slug: 'casual-wear', icon: placeholderIcon },
  ]

  return (
    <section className="category-navigation-section">
      <div className="section-container">
        <h2 className="section-title">Shop by Category</h2>
        
        <div className="categories-container">
          {categories.map((category) => (
            <CategoryItem
              key={category.slug}
              name={category.name}
              icon={category.icon}
              slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryNavigationSection
