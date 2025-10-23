# Admin UI Quick Start

## Upload Images and Videos to MongoDB

1. **Access Media Manager**
   - Navigate to: http://localhost:3000/admin/media
   - Login with admin credentials

2. **Upload Hero Video**
   - Click "Upload Video" section
   - Select `frontend/src/assets/bgsaree_video.mp4`
   - Copy the video ID once uploaded
   - Update `frontend/src/pages/Home.jsx`:
     ```jsx
     <source src="/api/videos/YOUR_VIDEO_ID" type="video/mp4" />
     ```

3. **Upload Product Images**
   - Click "Upload Images" section
   - Drag & drop or select multiple images
   - Copy the file IDs

4. **Create a Product**
   - Navigate to: http://localhost:3000/admin/products/new
   - Fill in product details:
     - Name, description, price
     - Category, fabric, color, stock
   - Upload images directly in the form OR use copied file IDs
   - Submit

5. **View Products**
   - Visit: http://localhost:3000/collections
   - Products should display with images from MongoDB

## API Endpoints

### Images
- **Upload**: `POST /api/images` (admin, form-data: image)
- **Get**: `GET /api/images/:id` (public)

### Videos
- **Upload**: `POST /api/videos` (admin, form-data: video)
- **Stream**: `GET /api/videos/:id` (public, supports range requests)

### Products
- **Create**: `POST /api/products` (admin, JSON body with images array)
- **List**: `GET /api/products` (public)
- **Get**: `GET /api/products/:id` (public)

## Notes

- All media files are stored in MongoDB GridFS
- Images/videos are streamed on demand, no local storage needed
- Frontend only stores references (file IDs)
- CORS is configured for multiple frontend domains
- Max upload size: 100MB for videos

## Deploy Checklist

### Backend (VPS)
- Set `MONGODB_URI` in `.env`
- Set `CLIENT_ORIGINS` to include your frontend domains
- Ensure GridFS bucket is initialized on startup
- Configure reverse proxy for large uploads

### Frontend (Vercel/Hostinger)
- Set `VITE_API_BASE_URL` to your backend URL
- Build and deploy
- Images/videos will load from backend automatically
