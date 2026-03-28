import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Calendar, LogOut, UserPlus } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl flex-shrink-0">
            <div className="p-6 border-b border-indigo-800">
                <h2 className="text-xl font-black flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
                        <ShoppingBag size={20} />
                    </div>
                    दिनेश बर्तन भंडार
                </h2>
            </div>

            <nav className="flex-grow p-4 space-y-2">
                <NavLink 
                    to="/admin/dashboard" 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-indigo-800 text-white font-semibold' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
                >
                    <LayoutDashboard size={20} /> Overview
                </NavLink>
                <NavLink 
                    to="/admin/manual" 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-indigo-800 text-white font-semibold' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
                >
                    <UserPlus size={20} /> Manual Order
                </NavLink>
                <NavLink 
                    to="/admin/utensils" 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-indigo-800 text-white font-semibold' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
                >
                    <ShoppingBag size={20} /> Bartan Manage
                </NavLink>
                <NavLink 
                    to="/admin/bookings" 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-indigo-800 text-white font-semibold' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}
                >
                    <Calendar size={20} /> Bookings
                </NavLink>
            </nav>

            <div className="p-4 border-t border-indigo-800">
                <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
