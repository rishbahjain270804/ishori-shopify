Deployment: Backend (VPS) with Frontend on Vercel/Hostinger

1) Environment variables (.env)
- MONGODB_URI=mongodb+srv://...
- JWT_SECRET=...
- PORT=5000
- CLIENT_ORIGINS=https://ishori.vercel.app,https://ishori.com,http://localhost:3000

2) Reverse proxy
- Serve Node app behind Nginx/Caddy; forward / to http://127.0.0.1:5000
- Enable HTTPS and HTTP/2

3) Process manager
- Use pm2 or systemd to keep the server running and restart on crash

4) CORS
- Multiple origins are supported via CLIENT_ORIGINS (comma-separated)

5) Health and features endpoints
- GET /api/health (200 OK JSON)
- GET /api/features (public; cacheable for 60s)

6) Logs
- Write logs to stdout and use your process manager for rotation
