import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Calendar, 
    LogOut, 
    UserPlus,
    BarChart3,
    Settings,
    ChevronRight,
    MessageSquare
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);

    const navItems = [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview", count: null },
        { to: "/admin/manual", icon: UserPlus, label: "Manual Order", count: "Quick" },
        { to: "/admin/utensils", icon: ShoppingBag, label: "Manage Stock", count: "Live" },
        { to: "/admin/bookings", icon: Calendar, label: "Reservations", count: null },
        { to: "/admin/feedback", icon: MessageSquare, label: "Feedbacks", count: null },
    ];

    return (
        <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl flex-shrink-0 border-r border-white/5 relative z-50">
            {/* Sidebar Branding */}
            <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-900 p-2.5 rounded-2xl shadow-xl shadow-blue-500/10 ring-1 ring-white/20">
                        <BarChart3 size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Console</h2>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">v2.1 Stable</span>
                    </div>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-grow p-6 space-y-8 overflow-y-auto">
                <div>
                    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4">Management</h3>
                    <div className="space-y-2">
                        {navItems.map((item, idx) => (
                            <NavLink 
                                key={idx}
                                to={item.to} 
                                className={({isActive}) => `flex items-center justify-between gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-blue-900 text-white font-black shadow-xl shadow-blue-900/40 translate-x-3' : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-2'}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                                            <span className="text-xs uppercase tracking-widest font-bold">{item.label}</span>
                                        </div>
                                        {item.count && (
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${item.count === 'Live' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-blue-500/30 text-blue-500 bg-blue-500/10'}`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4">System</h3>
                    <div className="space-y-2">
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest font-bold">
                            <Settings size={20} /> Settings
                        </button>
                    </div>
                </div>
            </nav>

            {/* User Profile / Logout */}
            <div className="p-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-md mt-auto">
                <button 
                    onClick={logout}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <LogOut size={20} />
                        <span className="text-xs uppercase tracking-widest font-black">Secure Logout</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
            
            {/* Decorative Grid Overlay (Subtle) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
    );
};

export default Sidebar;
