import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Menu, X, LogOut, User, LayoutDashboard, ShoppingBag, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-indigo-600 flex items-center gap-2">
              <ShoppingBag className="shrink-0" /> दिनेश बर्तन भंडार
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/utensils" className="text-gray-700 hover:text-indigo-600 font-medium">Bartan Catalog</Link>
            
            {/* Cart Link */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium flex items-center">
                    <LayoutDashboard size={18} className="mr-1" /> Dashboard
                  </Link>
                ) : (
                  <Link to="/my-bookings" className="text-gray-700 hover:text-indigo-600 font-medium">My Bookings</Link>
                )}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l">
                  <span className="text-gray-600 flex items-center shrink-0">
                    <User size={18} className="mr-1" /> {user.name}
                  </span>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center">
                    <LogOut size={18} className="mr-1" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Register</Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden gap-4">
             {/* Mobile Cart Link */}
             <Link to="/cart" className="relative p-2 text-gray-700">
               <ShoppingCart size={22} />
               {cartItems.length > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                   {cartItems.length}
                 </span>
               )}
             </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link to="/utensils" className="block text-gray-700 hover:text-indigo-600">Bartan Stock</Link>
          <Link to="/cart" className="block text-gray-700 hover:text-indigo-600">Cart ({cartItems.length})</Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard" className="block text-gray-700 hover:text-indigo-600">Dashboard</Link>
              ) : (
                <Link to="/my-bookings" className="block text-gray-700 hover:text-indigo-600">My Bookings</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="block text-indigo-600 font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
