import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import { createCanvas } from 'canvas';

const BASE_URL = 'http://localhost:5000';

// Create test image buffers
function createTestImage(text, color) {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 800, 600);
  
  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 400, 300);
  
  return canvas.toBuffer('image/png');
}

async function uploadImage(imageBuffer, filename) {
  const formData = new FormData();
  formData.append('image', imageBuffer, {
    filename: filename,
    contentType: 'image/png'
  });

  console.log(`Uploading ${filename}...`);
  const response = await fetch(`${BASE_URL}/api/images`, {
    method: 'POST',
    body: formData,
    headers: formData.getHeaders()
  });

  const text = await response.text();
  console.log(`Response status: ${response.status}`);
  console.log(`Response body: ${text}`);

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} - ${text}`);
  }

  const data = JSON.parse(text);
  return data;
}

async function createProduct(imageUrls) {
  console.log('\nCreating product...');
  const productData = {
    name: 'Test Saree Collection',
    description: 'Beautiful test saree with elegant design and premium fabric. Perfect for special occasions.',
    price: 2999,
    discountPrice: 2499,
    category: 'Sarees',
    fabric: 'Silk',
    color: 'Red',
    stock: {
      S: 10,
      M: 15,
      L: 8
    },
    images: imageUrls,
    featured: true,
    isActive: true
  };

  const response = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json();
  console.log('Product creation response:', JSON.stringify(data, null, 2));
  return data;
}

async function main() {
  try {
    console.log('Starting test upload process...\n');

    // Create and upload 3 test images
    const images = [
      { text: 'Image 1', color: '#FF6B6B', filename: 'test-image-1.png' },
      { text: 'Image 2', color: '#4ECDC4', filename: 'test-image-2.png' },
      { text: 'Image 3', color: '#45B7D1', filename: 'test-image-3.png' }
    ];

    const uploadedImages = [];
    
    for (const img of images) {
      try {
        const buffer = createTestImage(img.text, img.color);
        const result = await uploadImage(buffer, img.filename);
        console.log(`✓ Uploaded: ${result.url}\n`);
        uploadedImages.push(result.url);
      } catch (error) {
        console.error(`✗ Failed to upload ${img.filename}:`, error.message);
      }
    }

    if (uploadedImages.length === 0) {
      console.error('\n❌ No images were uploaded successfully');
      return;
    }

    console.log(`\n✓ Successfully uploaded ${uploadedImages.length} images`);

    // Create product with uploaded images
    const product = await createProduct(uploadedImages);
    
    if (product.success) {
      console.log('\n✅ Product created successfully!');
      console.log(`Product ID: ${product.data._id}`);
      console.log(`Product Name: ${product.data.name}`);
      console.log(`Images: ${product.data.images.length}`);
      console.log('\nView on frontend:');
      console.log(`- Home: http://localhost:3000/`);
      console.log(`- Product page: http://localhost:3000/product/${product.data._id}`);
      console.log(`- Admin: http://localhost:3000/admin/products`);
    } else {
      console.error('\n❌ Product creation failed:', product.message);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

main();
