import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-950">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 shadow-xl shadow-blue-500/20"></div>
        </div>
    );
    if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans antialiased text-slate-900 dark:text-slate-100">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex shrink-0">
                <Sidebar />
            </aside>

            {/* Mobile Drawer */}
            <div className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                <div className={`absolute top-0 left-0 h-full w-72 transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Sidebar />
                    <button 
                        onClick={() => setIsMenuOpen(false)} 
                        className="absolute top-6 right-[-50px] bg-slate-900 text-white p-2 rounded-xl border border-white/20 shadow-2xl"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Top Navbar */}
                <header className="flex lg:hidden items-center justify-between p-6 bg-slate-900 text-white shadow-xl relative z-50">
                     <div className="flex items-center gap-3">
                        <div className="bg-blue-950 p-2 rounded-xl">
                            <Menu size={20} className="text-white cursor-pointer" onClick={() => setIsMenuOpen(true)} />
                        </div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">Console</h2>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-800 flex items-center justify-center text-[10px] font-black">{user.name.split('')[0]}</div>
                     </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12 scroll-smooth">
                    <div className="max-w-7xl mx-auto py-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
