import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const sampleProducts = [
  {
    name: "Kanjivaram Pure Silk Saree - Royal Blue",
    description: "Exquisite Kanjivaram silk saree with traditional temple border and rich zari work.",
    price: 18999,
    discountPrice: 14999,
    category: "Silk Sarees",
    fabric: "Pure Silk",
    color: "Royal Blue",
    stock: { S: 5, M: 10, L: 8, XL: 5 },
    images: [{ url: "https://via.placeholder.com/800x1000/4169E1/FFFFFF?text=Royal+Blue+Silk" }],
    featured: true,
    status: 'active'
  },
  {
    name: "Banarasi Silk Saree - Maroon Gold",
    description: "Handwoven Banarasi silk saree with intricate brocade work and golden zari.",
    price: 16499,
    discountPrice: 12999,
    category: "Silk Sarees",
    fabric: "Pure Silk",
    color: "Maroon",
    stock: { S: 8, M: 12, L: 10, XL: 6 },
    images: [{ url: "https://via.placeholder.com/800x1000/800000/FFD700?text=Maroon+Banarasi" }],
    featured: true,
    status: 'active'
  },
  {
    name: "Mysore Silk Saree - Emerald Green",
    description: "Soft Mysore silk saree with delicate gold border.",
    price: 12999,
    discountPrice: 9999,
    category: "Silk Sarees",
    fabric: "Pure Silk",
    color: "Green",
    stock: { S: 10, M: 15, L: 12, XL: 8 },
    images: [{ url: "https://via.placeholder.com/800x1000/50C878/FFFFFF?text=Emerald+Silk" }],
    status: 'active'
  },
  {
    name: "Handloom Cotton Saree - White",
    description: "Pure handloom cotton saree with traditional border.",
    price: 2999,
    discountPrice: 2499,
    category: "Cotton Sarees",
    fabric: "Cotton",
    color: "White",
    stock: { S: 20, M: 25, L: 20, XL: 15 },
    images: [{ url: "https://via.placeholder.com/800x1000/FFFFFF/000000?text=White+Cotton" }],
    status: 'active'
  },
  {
    name: "Designer Georgette Saree - Black",
    description: "Contemporary designer saree with sequin work.",
    price: 9999,
    discountPrice: 7999,
    category: "Designer Sarees",
    fabric: "Georgette",
    color: "Black",
    stock: { S: 8, M: 12, L: 10, XL: 6 },
    images: [{ url: "https://via.placeholder.com/800x1000/000000/FFFFFF?text=Black+Designer" }],
    featured: true,
    status: 'active'
  }
];

// Generate 45 more products
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Teal', 'Maroon'];
const categories = ['Silk Sarees', 'Cotton Sarees', 'Designer Sarees'];
const fabrics = {
  'Silk Sarees': ['Pure Silk', 'Tussar Silk', 'Mysore Silk'],
  'Cotton Sarees': ['Cotton', 'Khadi Cotton', 'Handloom Cotton'],
  'Designer Sarees': ['Georgette', 'Chiffon', 'Net']
};

for (let i = 0; i < 45; i++) {
  const category = categories[i % 3];
  const color = colors[i % colors.length];
  const fabricList = fabrics[category];
  const fabric = fabricList[i % fabricList.length];
  const price = 3999 + (i * 500);
  
  sampleProducts.push({
    name: `${fabric} Saree - ${color} ${i + 1}`,
    description: `Beautiful ${fabric} saree in ${color} color. Perfect blend of tradition and style.`,
    price: price,
    discountPrice: Math.floor(price * 0.8),
    category: category,
    fabric: fabric,
    color: color,
    stock: { S: 5 + (i % 10), M: 10 + (i % 15), L: 8 + (i % 12), XL: 5 + (i % 8) },
    images: [{ url: `https://via.placeholder.com/800x1000/${(i * 111111).toString(16).slice(0, 6)}/FFFFFF?text=${fabric}+${color}` }],
    featured: i % 10 === 0,
    status: 'active'
  });
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✓ Successfully inserted ${inserted.length} products`);

    console.log('\n📦 Sample products:');
    inserted.slice(0, 5).forEach(product => {
      console.log(`  - ${product.name} (₹${product.price})`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
