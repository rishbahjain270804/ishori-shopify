# Ishori Project Setup Guide

## Quick Start Guide

Welcome to the Ishori e-commerce platform! This guide will help you set up and run the project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- A code editor (VS Code recommended)

## Step-by-Step Setup

### Step 1: Install MongoDB (if not using Atlas)

**Windows:**
```powershell
# Download from MongoDB website and install
# Or use Chocolatey:
choco install mongodb
```

**Start MongoDB:**
```powershell
mongod
```

### Step 2: Setup Backend

1. **Navigate to backend directory:**
```powershell
cd d:\projects\ishori\backend
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Create environment file:**
```powershell
Copy-Item .env.example .env
```

4. **Edit the .env file** with your configuration:
```env
NODE_ENV=development
PORT=5000

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ishori

# Or MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ishori

JWT_SECRET=ishori_secret_key_2024_change_in_production
JWT_EXPIRE=30d

CLIENT_URL=http://localhost:3000
```

5. **Start the backend server:**
```powershell
npm run dev
```

You should see:
```
🚀 Ishori Backend Server running on port 5000
✅ MongoDB Connected
```

### Step 3: Setup Frontend

1. **Open a new terminal and navigate to frontend:**
```powershell
cd d:\projects\ishori\frontend
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Start the development server:**
```powershell
npm run dev
```

The frontend will be available at: **http://localhost:3000**

### Step 4: Access the Application

- **Main Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api/health

## Default Admin Account

To create an admin account, you'll need to register and manually update the role in MongoDB:

1. Register a new account at http://localhost:3000/register
2. Open MongoDB Compass or use MongoDB shell
3. Find your user in the `users` collection
4. Update the `role` field from `"user"` to `"admin"`

**MongoDB Shell Command:**
```javascript
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Project Structure

```
ishori/
├── frontend/          # React application (Port 3000)
├── backend/           # Express API (Port 5000)
├── design-system/     # Shared design tokens
└── docs/             # Documentation
```

## Testing the Setup

### Test Backend API

1. **Health Check:**
```powershell
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Ishori API is running"
}
```

2. **Register a User:**
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Frontend

1. Open http://localhost:3000 in your browser
2. You should see the beautiful glassmorphic homepage
3. Navigate through different pages
4. Try the login/register forms

## Design System

The design system is located in `/design-system` and includes:

- **colors.js** - Color palette
- **glassmorphism.js** - Glass effect styles
- **neumorphism.js** - Soft UI styles
- **typography.js** - Font system
- **spacing.js** - Spacing scale

## Available Scripts

### Frontend Scripts
```powershell
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Scripts
```powershell
cd backend
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```

## Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```powershell
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Issues

1. **Ensure MongoDB is running:**
```powershell
# Check if MongoDB service is running
net start | findstr MongoDB

# Start MongoDB service
net start MongoDB
```

2. **Check MongoDB connection string** in `.env` file

3. **For MongoDB Atlas:**
   - Ensure IP address is whitelisted
   - Check username and password are correct
   - Verify database name in connection string

### Module Not Found Errors

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Vite Config Issues

If you see path resolution errors, ensure `vite.config.js` has:
```javascript
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

## 🚀 Next Development Steps

### 1. Complete Product Management
- [ ] Implement product CRUD operations
- [ ] Add image upload with Cloudinary
- [ ] Create product filters and search
- [ ] Add pagination

### 2. Shopping Cart & Checkout
- [ ] Implement cart functionality
- [ ] Add cart persistence (localStorage)
- [ ] Create checkout flow
- [ ] Integrate payment gateway (Razorpay)

### 3. Order Management
- [ ] Complete order creation
- [ ] Add order tracking
- [ ] Implement order status updates
- [ ] Email notifications

### 4. Admin Panel Features
- [ ] Dashboard with real statistics
- [ ] Product management interface
- [ ] Order management system
- [ ] Customer management

### 5. Enhanced Features
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Search with filters
- [ ] Email notifications
- [ ] SMS notifications (optional)

### 6. Production Preparation
- [ ] Environment configuration
- [ ] Image optimization
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Error logging (Winston/Morgan)
- [ ] API rate limiting
- [ ] HTTPS setup
- [ ] Domain configuration

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## 🆘 Getting Help

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error messages carefully
3. Check the browser console for frontend errors
4. Check the terminal for backend errors
5. Ensure all dependencies are installed correctly

## 📧 Contact

For any queries or support:
- **Email:** connectishori@gmail.com
- **Phone:** +91 8306038989, +91 8107708989

---

**Happy Coding! 🎉**

Built with ❤️ for Ishori - Elegance Redefined
