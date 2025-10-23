# Ishori - Quick Reference Guide

## 🚀 Quick Commands

### Start Development Servers

**Backend:**
```powershell
cd d:\projects\ishori\backend
npm run dev
```

**Frontend:**
```powershell
cd d:\projects\ishori\frontend
npm run dev
```

---

## 📍 Important URLs

- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Backend API:** http://localhost:5000/api
- **API Health:** http://localhost:5000/api/health

---

## 🎨 Design Tokens Quick Reference

### Colors
```javascript
// Primary
--color-rose-gold: #B76E79
--color-white: #FFFFFF
--color-black: #0A0A0A

// Accents
--color-blush: #FFC2D1
--color-mauve: #E0B0FF
--color-lavender: #E6E6FA
```

### Glass Effect
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

### Neumorphic Effect
```css
.neumorphic-card {
  background: #F8F8F8;
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.9);
}
```

---

## 📝 Common Code Snippets

### Create a New Page

**Frontend (src/pages/NewPage.jsx):**
```jsx
const NewPage = () => {
  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title text-gradient">Page Title</h1>
        <p className="page-subtitle">Subtitle</p>
      </div>
    </div>
  )
}

export default NewPage
```

**Add Route (src/App.jsx):**
```jsx
<Route path="/new-page" element={<NewPage />} />
```

### Create API Route

**Backend (routes/example.routes.js):**
```javascript
import express from 'express'
import { protect, admin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: [] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
```

**Register in server.js:**
```javascript
import exampleRoutes from './routes/example.routes.js'
app.use('/api/example', exampleRoutes)
```

### Create MongoDB Model

```javascript
import mongoose from 'mongoose'

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Add more fields
}, {
  timestamps: true,
})

export default mongoose.model('Example', exampleSchema)
```

---

## 🔑 API Endpoints Reference

### Authentication
```
POST   /api/auth/register    - Register user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
PUT    /api/auth/profile     - Update profile
```

### Products
```
GET    /api/products         - Get all products
GET    /api/products/:id     - Get product by ID
POST   /api/products         - Create product (admin)
PUT    /api/products/:id     - Update product (admin)
DELETE /api/products/:id     - Delete product (admin)
```

### Orders
```
GET    /api/orders           - Get user orders
GET    /api/orders/:id       - Get order by ID
POST   /api/orders           - Create order
GET    /api/orders/admin/all - Get all orders (admin)
```

---

## 🎯 Frontend Routes

### Main Website
```
/                  - Home
/collections       - Product collections
/product/:id       - Product details
/about             - About page
/contact           - Contact page
/cart              - Shopping cart
/checkout          - Checkout
/login             - Login
/register          - Register
```

### Admin Panel
```
/admin             - Dashboard
/admin/products    - Product management
/admin/orders      - Order management
/admin/customers   - Customer management
/admin/settings    - Settings
```

---

## 🛠️ Useful MongoDB Commands

### Start MongoDB
```powershell
mongod
```

### Connect to Database
```powershell
mongosh
use ishori
```

### Common Queries
```javascript
// Find all users
db.users.find()

// Find user by email
db.users.findOne({ email: "test@example.com" })

// Update user role to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

// Count products
db.products.countDocuments()

// Find all orders
db.orders.find().sort({ createdAt: -1 })
```

---

## 🐛 Debug Commands

### Check Running Processes
```powershell
# Check port 3000
netstat -ano | findstr :3000

# Check port 5000
netstat -ano | findstr :5000
```

### Kill Process
```powershell
taskkill /PID <PID> /F
```

### Clear npm Cache
```powershell
npm cache clean --force
```

### Reinstall Dependencies
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📦 Adding New Dependencies

### Frontend
```powershell
cd frontend
npm install package-name
```

### Backend
```powershell
cd backend
npm install package-name
```

### Common Packages You Might Need

**Frontend:**
- `npm install axios` - HTTP client
- `npm install react-query` - Data fetching
- `npm install formik` - Form management
- `npm install yup` - Validation

**Backend:**
- `npm install express-validator` - Request validation
- `npm install multer` - File uploads
- `npm install nodemailer` - Email sending
- `npm install winston` - Logging

---

## 🎨 Component Templates

### Glass Button
```jsx
<button className="glass-button" onClick={handleClick}>
  Click Me
</button>
```

### Neumorphic Card
```jsx
<div className="neumorphic-card" style={{ padding: '24px' }}>
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Text Gradient
```jsx
<h1 className="text-gradient">Gradient Text</h1>
```

---

## 📧 Contact Details

**Ishori Contact Information:**
- Email: connectishori@gmail.com
- Phone: +91 8306038989, +91 8107708989
- Address: Near old nagar Palika, Kotputli 303108
- Domain: ishori.com

---

## 🔗 Useful Links

- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Vite Docs](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Quick Tip:** Keep this file handy for quick reference during development! 🚀
