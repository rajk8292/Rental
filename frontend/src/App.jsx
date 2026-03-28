import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Utensils from './pages/Utensils';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import AdminLayout from './pages/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminManualBooking from './pages/AdminManualBooking';
import AdminUtensils from './pages/AdminUtensils';
import AdminBookings from './pages/AdminBookings';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Simple Layout for User Facing Pages
const UserLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8 pt-20 sm:pt-28">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <AuthProvider>
              <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-slate-950">
                <Routes>
                  {/* User Routes inside UserLayout */}
                  <Route element={<UserLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/utensils" element={<Utensils />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                  </Route>

                  {/* Admin Routes inside AdminLayout (Immersive Full Screen) */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="dashboard" element={<AdminOverview />} />
                    <Route path="manual" element={<AdminManualBooking />} />
                    <Route path="utensils" element={<AdminUtensils />} />
                    <Route path="bookings" element={<AdminBookings />} />
                  </Route>
                </Routes>
              </div>
            </AuthProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
