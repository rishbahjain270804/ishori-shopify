import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model.js';

dotenv.config();

const updateSlugs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      if (!product.slug || product.slug === '') {
        // Generate slug from name
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        await product.save();
        console.log(`✅ Updated: ${product.name} -> ${product.slug}`);
        updated++;
      } else {
        console.log(`⏭️  Skipped: ${product.name} (already has slug: ${product.slug})`);
        skipped++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${products.length}`);
    console.log('\n✅ Slug update complete!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating slugs:', error);
    process.exit(1);
  }
};

updateSlugs();
