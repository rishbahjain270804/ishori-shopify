Deployment: Frontend (Vercel/Hostinger) with Backend on VPS

1) Build-time environment variables
- Set VITE_API_BASE_URL to your backend base URL (no trailing slash), e.g.
  - https://api.ishori.com
  - https://vps-yourdomain.com:5000

2) Vercel configuration
- Add an Environment Variable: VITE_API_BASE_URL = https://api.ishori.com
- Redeploy

3) Hostinger File Manager
- Build locally: npm ci && npm run build
- Upload the dist/ folder contents to your public directory
- Ensure VITE_API_BASE_URL is baked at build time (set it before build)

4) Local development
- Copy .env.example to .env and set VITE_API_BASE_URL=http://localhost:5000
- npm run dev (Vite will also proxy /api to :5000 if VITE_API_BASE_URL is not set)

5) CORS on backend (VPS)
- Set CLIENT_ORIGINS in backend .env to include your deployed frontends, e.g.
  CLIENT_ORIGINS=https://ishori.vercel.app,https://ishori.com,http://localhost:3000

6) Image URLs
- The API returns images as absolute URLs (recommended). If using Cloudinary or your VPS domain, store full URLs in product.images[].url.

7) Health check
- Frontend calls: GET <API>/api/health for monitoring. Cache is safe.
