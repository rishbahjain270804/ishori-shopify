// Video Upload Script - Run this once to upload your local video to MongoDB
// Usage: node scripts/uploadVideo.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEO_PATH = path.join(__dirname, '../frontend/src/assets/bgsaree_video.mp4');
const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

async function uploadVideo() {
  try {
    console.log('📹 Reading video file...');
    if (!fs.existsSync(VIDEO_PATH)) {
      throw new Error(`Video not found at ${VIDEO_PATH}`);
    }

    const videoBuffer = fs.readFileSync(VIDEO_PATH);
    console.log(`✅ Video loaded: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    const formData = new FormData();
    formData.append('video', videoBuffer, {
      filename: 'bgsaree_video.mp4',
      contentType: 'video/mp4',
    });

    console.log('⬆️  Uploading to MongoDB via GridFS...');
    const res = await fetch(`${API_BASE}/api/videos`, {
      method: 'POST',
      body: formData,
      headers: {
        // Note: Add authorization header with admin token here
        // 'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
      },
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    console.log('✅ Video uploaded successfully!');
    console.log('📦 File ID:', data.fileId);
    console.log('🔗 URL:', data.url);
    console.log('\n💡 Update your Home.jsx video source to:');
    console.log(`   <source src="/api/videos/${data.fileId}" type="video/mp4" />`);
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadVideo();
