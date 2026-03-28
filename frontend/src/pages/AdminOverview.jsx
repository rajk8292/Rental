import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { 
    DollarSign, 
    ShoppingBag, 
    CalendarCheck, 
    TrendingUp, 
    PackageCheck, 
    AlertTriangle, 
    ArrowRight,
    Search,
    Bell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1e3a8a', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminOverview = () => {
    const [stats, setStats] = useState({ bookings: 0, revenue: 0, utensils: 0, lowStock: 0 });
    const [chartData, setChartData] = useState([]);
    const [popularData, setPopularData] = useState([]);
    const [upcomingReturns, setUpcomingReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [bookingsRes, utensilsRes] = await Promise.all([
                    axios.get('/bookings'),
                    axios.get('/utensils')
                ]);
                
                const bookings = bookingsRes.data;
                const utensils = utensilsRes.data;
                
                const revenue = bookings.reduce((sum, b) => b.paymentStatus === 'Completed' ? sum + b.totalPrice : sum, 0);
                const lowStock = utensils.filter(u => u.availableQuantity < 5).length;
                setStats({ bookings: bookings.length, revenue, utensils: utensils.length, lowStock });

                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return { date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), amount: 0 };
                });

                bookings.forEach(b => {
                    if(b.paymentStatus === 'Completed') {
                        const dateStr = new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                        const found = last7Days.find(d => d.date === dateStr);
                        if(found) found.amount += b.totalPrice;
                    }
                });
                setChartData(last7Days);

                const popularity = {};
                bookings.forEach(b => {
                    b.items.forEach(item => {
                        popularity[item.name] = (popularity[item.name] || 0) + item.quantity;
                    });
                });
                setPopularData(Object.entries(popularity).map(([name, value]) => ({ name, value })).slice(0, 5));

                const today = new Date();
                today.setHours(0,0,0,0);
                const returns = bookings.filter(b => {
                    const endDate = new Date(b.endDate);
                    endDate.setHours(0,0,0,0);
                    return endDate.getTime() >= today.getTime() && b.deliveryStatus !== 'Returned';
                });
                setUpcomingReturns(returns.slice(0, 5));

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 1. Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-blue-900 p-10 rounded-[2.5rem] text-white overflow-hidden relative group">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black tracking-tighter italic uppercase">Admin Command Center</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Dinesh Bartan Bhandar</span>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-[10px] font-black uppercase">Live Updates</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                        <input type="text" placeholder="Search operations..." className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:bg-white/20 outline-none transition-all placeholder:text-blue-300" />
                    </div>
                    <button className="bg-white/10 p-3.5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all relative">
                         <Bell size={20} />
                         <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-900"></span>
                    </button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-all duration-1000"></div>
                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-green-500 text-[10px] font-black bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Net Revenue</h3>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">₹{stats.revenue.toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <CalendarCheck size={24} />
                        </div>
                        <span className="text-blue-500 text-[10px] font-black bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-full">ACTIVE</span>
                    </div>
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Live Bookings</h3>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stats.bookings}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-slate-400 text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">CATALOG</span>
                    </div>
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Utensils</h3>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stats.utensils}</p>
                </div>

                <div className={`p-8 rounded-[2rem] border transition-all duration-500 group overflow-hidden relative ${stats.lowStock > 0 ? 'bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/40 shadow-red-100' : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800'}`}>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${stats.lowStock > 0 ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-50 text-slate-400'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        {stats.lowStock > 0 && <span className="text-red-500 text-[10px] font-black animate-pulse">ACTION REQUIRED</span>}
                    </div>
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Low Inventory</h3>
                    <p className={`text-3xl font-black tracking-tighter italic relative z-10 ${stats.lowStock > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{stats.lowStock} Items</p>
                    {stats.lowStock > 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>}
                </div>
            </div>

            {/* 3. Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Main Revenue Chart */}
                 <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3 italic">
                           <TrendingUp className="text-blue-900" /> Revenue Forecast
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-10 h-1 bg-blue-900 rounded-full"></span>
                            <span className="w-4 h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></span>
                        </div>
                    </div>
                    <div className="h-80 w-full relative z-10">
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'black', fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'black', fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px'}} />
                                <Area type="monotone" dataKey="amount" stroke="#1e3a8a" strokeWidth={5} fillOpacity={1} fill="url(#colorAmt)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Top Products */}
                 <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <h4 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-8 border-b border-white/10 pb-4 italic">Star Performing Items</h4>
                    <div className="space-y-6">
                        {popularData.length > 0 ? popularData.map((d, i) => (
                            <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-white/20 italic">0{i+1}</span>
                                    <div className="text-sm font-black uppercase tracking-tight group-hover:text-blue-400 transition-colors">{d.name.slice(0, 18)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black italic">{d.value}</div>
                                    <div className="text-[9px] font-black text-white/30 uppercase">Rentals</div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-white/30 italic">No data yet</div>
                        )}
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                 </div>
            </div>

            {/* 4. Operation Logs & Returns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Critical Deadlines</h3>
                        <button className="text-blue-900 text-[10px] font-black uppercase tracking-widest hover:underline">View All Schedule</button>
                    </div>
                    <div className="space-y-4">
                        {upcomingReturns.map(b => (
                            <div key={b._id} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:translate-x-3 transition-transform duration-300">
                                <div className="flex items-center gap-6">
                                    <div className={`w-3 h-3 rounded-full ${new Date(b.endDate) < new Date() ? 'bg-red-500 animate-pulse' : 'bg-blue-900'}`}></div>
                                    <div>
                                        <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{b.user?.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">{b.village} • ₹{b.totalPrice}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-blue-900 dark:text-blue-400 uppercase italic">Return Date</div>
                                    <div className="text-sm font-black text-slate-600 dark:text-slate-300">{new Date(b.endDate).toLocaleDateString('hi-IN')}</div>
                                </div>
                            </div>
                        ))}
                        {upcomingReturns.length === 0 && <p className="text-center py-10 text-slate-400 italic">No urgent schedules.</p>}
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/40 relative overflow-hidden group">
                     <h3 className="text-xl font-black text-amber-900 dark:text-amber-400 uppercase tracking-tighter mb-8 italic">Quick Access Tools</h3>
                     <div className="grid grid-cols-2 gap-4">
                         <button className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-amber-100/50 group-hover:-translate-y-2 duration-500">
                             <PackageCheck className="text-amber-600 mb-4" />
                             <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">Generate Report</span>
                         </button>
                         <button className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-amber-100/50 group-hover:translate-y-2 duration-500">
                             <TrendingUp className="text-emerald-600 mb-4" />
                             <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">Print Daily List</span>
                         </button>
                     </div>
                     <ArrowRight size={100} className="absolute -bottom-10 -right-10 text-amber-900/5 rotate-[-45deg] pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
