import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function testQuery() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Test 1: Count all products
    const totalCount = await Product.countDocuments({});
    console.log(`\nTotal products in DB: ${totalCount}`);

    // Test 2: Count products with status: 'active'
    const activeCount = await Product.countDocuments({ status: 'active' });
    console.log(`Products with status='active': ${activeCount}`);

    // Test 3: Get one product to see its fields
    const sampleProduct = await Product.findOne({});
    console.log(`\nSample product fields:`, Object.keys(sampleProduct.toObject()));
    console.log(`Sample product status:`, sampleProduct.status);
    console.log(`Sample product name:`, sampleProduct.name);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testQuery();
