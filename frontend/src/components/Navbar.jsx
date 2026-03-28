import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
    Menu, 
    X, 
    LogOut, 
    LayoutDashboard, 
    ShoppingBag, 
    ShoppingCart, 
    Languages, 
    Sun, 
    Moon,
    User,
    ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             <div className="bg-blue-900 p-2 rounded-xl text-white shadow-lg shadow-blue-200 dark:shadow-none transition-transform group-hover:scale-110">
                 <ShoppingBag size={24} />
             </div>
             <div className="flex flex-col">
                <span className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${scrolled || theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
                    {lang === 'hi' ? 'दिनेश बर्तन' : 'DINESH BARTAN'}
                </span>
                <span className="text-[10px] font-bold text-blue-900 dark:text-blue-400 uppercase tracking-widest">Chainpur Hata</span>
             </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/utensils" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors">{t('catalog')}</Link>
            
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>

            <div className="flex items-center gap-4">
                {/* Language */}
                <button onClick={toggleLang} className="p-2 text-slate-500 hover:text-blue-900 transition-colors" title="Switch Language">
                    <Languages size={20} />
                </button>

                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className={`p-2.5 rounded-xl transition-all duration-300 group ${
                    theme === 'light' 
                    ? 'text-slate-500 hover:bg-amber-50 hover:text-amber-600' 
                    : 'text-slate-400 hover:bg-blue-900/40 hover:text-blue-400'
                  }`}
                  title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                >
                  {theme === 'light' ? (
                    <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
                  ) : (
                    <Sun size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                  )}
                </button>

                {/* Cart */}
                <Link to="/cart" className="relative p-2 text-slate-500 hover:text-blue-900 transition-colors group">
                    <ShoppingCart size={22} />
                    {cartItems.length > 0 && (
                        <span className="absolute top-0 right-0 bg-blue-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 group-hover:animate-bounce">
                            {cartItems.length}
                        </span>
                    )}
                </Link>

                {/* Auth */}
                {user ? (
                    <div className="relative group/user py-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                        <button className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold hover:text-blue-900 transition-colors">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-900 rounded-lg flex items-center justify-center">
                                <User size={18} />
                            </div>
                            <span className="text-sm">{user.name.split(' ')[0]}</span>
                            <ChevronDown size={14} />
                        </button>
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all translate-y-2 group-hover/user:translate-y-0 p-2">
                             {user.role === 'admin' && (
                                 <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                     <LayoutDashboard size={18} /> {t('admin')}
                                 </Link>
                             )}
                             <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                 <ShoppingBag size={18} /> {t('myBookings')}
                             </Link>
                             <div className="h-px bg-slate-100 dark:border-slate-700 my-1 mx-2"></div>
                             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                                 <LogOut size={18} /> {t('logout')}
                             </button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 dark:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0">
                        {t('login')}
                    </Link>
                )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
              <Link to="/cart" className="relative p-2 text-slate-600 dark:text-slate-300">
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                      <span className="absolute top-0 right-0 bg-blue-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                          {cartItems.length}
                      </span>
                  )}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-[90] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-0 right-0 h-full w-[80%] bg-white dark:bg-slate-900 p-8 shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-10">
                  <span className="font-black text-xl text-blue-900 italic">DINESH</span>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400"><X size={24} /></button>
              </div>

              <div className="space-y-4 flex-grow">
                  <Link to="/utensils" onClick={() => setIsOpen(false)} className="block p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200">
                      {t('catalog')}
                  </Link>
                  <button onClick={() => { toggleLang(); setIsOpen(false); }} className="w-full flex justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200">
                      <span>Language</span>
                      <span className="text-blue-900 uppercase">{lang}</span>
                  </button>
                  <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="w-full flex justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200">
                      <span>Appearance</span>
                      <span className="text-blue-900 uppercase">{theme}</span>
                  </button>
                  {user && (
                      <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200">
                         {t('myBookings')}
                      </Link>
                  )}
              </div>

              <div className="pt-8 border-t dark:border-slate-800 space-y-4">
                  {user ? (
                      <>
                        <div className="flex items-center gap-3 mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white"><User size={20} /></div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-[10px] text-blue-900 font-bold uppercase">{user.role}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full py-4 bg-red-50 dark:bg-red-950/10 text-red-500 rounded-xl font-bold">Logout</button>
                      </>
                  ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-blue-900 text-white text-center rounded-xl font-bold">Login / Register</Link>
                  )}
              </div>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
