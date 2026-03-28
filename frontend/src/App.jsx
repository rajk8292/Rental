import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Utensils from './pages/Utensils';
import MyBookings from './pages/MyBookings';
import Cart from './pages/Cart';
import AdminLayout from './pages/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminUtensils from './pages/AdminUtensils';
import AdminBookings from './pages/AdminBookings';
import AdminManualBooking from './pages/AdminManualBooking';

function App() {
  return (
    <Router>
      <CartProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/utensils" element={<Utensils />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/my-bookings" element={<MyBookings />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminOverview />} />
                  <Route path="utensils" element={<AdminUtensils />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="manual" element={<AdminManualBooking />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
