import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

// Components
import ScrollToTop from './components/ScrollToTop'

// Layouts
import AdminLayout from './layouts/AdminLayout'

// UNIFIED PAGES - Production Ready
import HomeUnified from './pages/HomeUnified'
import CollectionsUnified from './pages/CollectionsUnified'
import ProductDetailUnified from './pages/ProductDetailUnified'
import CartUnified from './pages/CartUnified'
import CheckoutUnified from './pages/CheckoutUnified'

// Other Pages
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import ComingSoon from './pages/ComingSoon'
import OrderDetails from './pages/OrderDetails'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/OrderManagement'
import AdminCustomers from './pages/admin/CustomerManagement'
import AdminSettings from './pages/admin/Settings'
import ProductFormNew from './pages/admin/ProductFormNew'
import MediaManager from './pages/admin/MediaManager'
import CouponManagement from './pages/admin/CouponManagement'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="App">
            <Routes>
          {/* ===== FINAL PREMIUM PAGES ===== */}

          {/* Home */}
          <Route path="/" element={<HomeUnified />} />

          {/* About & Contact */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Shopping */}
          <Route path="/collections" element={<CollectionsUnified />} />
          <Route path="/product/:slug" element={<ProductDetailUnified />} />
          <Route path="/cart" element={<CartUnified />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Checkout */}
          <Route path="/checkout" element={<CheckoutUnified />} />

          {/* Payment */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />

          {/* Orders */}
          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Coming Soon Pages */}
          <Route path="/heritage" element={<ComingSoon pageName="Our Heritage" />} />
          <Route path="/craftsmanship" element={<ComingSoon pageName="Craftsmanship" />} />
          <Route path="/artisans" element={<ComingSoon pageName="Our Artisans" />} />
          <Route path="/sustainability" element={<ComingSoon pageName="Sustainability" />} />
          <Route path="/account" element={<ComingSoon pageName="My Account" />} />
          <Route path="/shipping" element={<ComingSoon pageName="Shipping Info" />} />
          <Route path="/returns" element={<ComingSoon pageName="Returns & Exchange" />} />
          <Route path="/faq" element={<ComingSoon pageName="FAQ" />} />
          <Route path="/care" element={<ComingSoon pageName="Saree Care Guide" />} />
          <Route path="/size-guide" element={<ComingSoon pageName="Size Guide" />} />
          <Route path="/privacy" element={<ComingSoon pageName="Privacy Policy" />} />
          <Route path="/terms" element={<ComingSoon pageName="Terms of Service" />} />

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductFormNew />} />
            <Route path="products/edit/:id" element={<ProductFormNew />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<CouponManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
