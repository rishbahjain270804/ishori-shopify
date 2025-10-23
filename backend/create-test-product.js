import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true },
  fabric: { type: String, required: true },
  color: { type: String, required: true },
  stock: {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 }
  },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

async function createTestProduct() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Create multiple test products
    const products = [
      {
        name: 'Elegant Red Silk Saree',
        description: 'Beautiful handwoven silk saree with intricate golden border. Perfect for weddings and special occasions. This premium quality saree features traditional motifs and a stunning drape.',
        price: 4999,
        discountPrice: 3999,
        category: 'Sarees',
        fabric: 'Silk',
        color: 'Red',
        stock: { S: 5, M: 10, L: 8, XL: 3 },
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
          'https://images.unsplash.com/photo-1583391733981-9b0a0fdfa84b?w=800',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
        ],
        featured: true,
        isActive: true,
        ratings: { average: 4.5, count: 12 }
      },
      {
        name: 'Royal Blue Banarasi Saree',
        description: 'Exquisite Banarasi saree with pure zari work. Rich royal blue color with traditional buti patterns. A masterpiece of Indian craftsmanship.',
        price: 6999,
        discountPrice: 5499,
        category: 'Sarees',
        fabric: 'Banarasi Silk',
        color: 'Blue',
        stock: { S: 3, M: 7, L: 5, XL: 2 },
        images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'
        ],
        featured: true,
        isActive: true,
        ratings: { average: 4.8, count: 18 }
      },
      {
        name: 'Pastel Pink Cotton Saree',
        description: 'Lightweight cotton saree perfect for everyday wear. Soft pastel pink with delicate embroidery. Comfortable and elegant.',
        price: 2499,
        discountPrice: 1999,
        category: 'Sarees',
        fabric: 'Cotton',
        color: 'Pink',
        stock: { S: 8, M: 12, L: 10, XL: 5 },
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
        ],
        featured: true,
        isActive: true,
        ratings: { average: 4.3, count: 8 }
      },
      {
        name: 'Golden Yellow Kanjivaram Saree',
        description: 'Traditional Kanjivaram saree in vibrant golden yellow. Features temple border and contrast pallu. A classic choice for special occasions.',
        price: 8999,
        discountPrice: 7499,
        category: 'Sarees',
        fabric: 'Kanjivaram Silk',
        color: 'Yellow',
        stock: { S: 2, M: 4, L: 3, XL: 1 },
        images: [
          'https://images.unsplash.com/photo-1583391733981-9b0a0fdfa84b?w=800',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
        ],
        featured: true,
        isActive: true,
        ratings: { average: 4.9, count: 25 }
      }
    ];

    console.log('Creating test products...\n');
    
    for (const productData of products) {
      const product = await Product.create(productData);
      console.log(`✅ Created: ${product.name} (ID: ${product._id})`);
    }
    
    console.log(`\n✅ ${products.length} products created successfully!`);
    console.log(`\nView on frontend:`);
    console.log(`- Home: http://localhost:3000/`);
    console.log(`- Collections: http://localhost:3000/collections`);
    console.log(`- Admin: http://localhost:3000/admin/products`);
    
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

createTestProduct();
