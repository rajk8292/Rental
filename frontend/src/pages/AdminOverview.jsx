import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { DollarSign, ShoppingBag, CalendarCheck } from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState({ bookings: 0, revenue: 0, utensils: 0 });
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

                const today = new Date();
                today.setHours(0,0,0,0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const returns = bookings.filter(b => {
                    const endDate = new Date(b.endDate);
                    endDate.setHours(0,0,0,0);
                    return (endDate.getTime() === today.getTime() || endDate.getTime() === tomorrow.getTime()) && b.deliveryStatus !== 'Returned' && b.deliveryStatus !== 'Checked';
                });

                setUpcomingReturns(returns);
                setStats({ bookings: bookings.length, revenue, utensils: utensils.length });
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>;

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-extrabold text-gray-900">System Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1 shrink-0">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-full text-green-600">
                        <DollarSign size={32} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Active Bookings</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.bookings}</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                        <CalendarCheck size={32} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Inventory Size</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.utensils}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-full text-orange-600">
                        <ShoppingBag size={32} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                        Return Reminders (Today/Tomorrow)
                    </h3>
                    <div className="space-y-4">
                        {upcomingReturns.length > 0 ? upcomingReturns.map(b => (
                            <div key={b._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition border border-transparent hover:border-orange-200">
                                <div>
                                    <div className="font-bold text-gray-800">{b.user?.name}</div>
                                    <div className="text-xs text-gray-500">{b.village} | Ending: {new Date(b.endDate).toLocaleDateString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold uppercase text-orange-600">{b.deliveryStatus || 'At Venue'}</div>
                                    <div className="text-[10px] text-gray-400">₹{b.totalPrice}</div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-center py-4">No returns due today or tomorrow.</p>
                        )}
                    </div>
                </div>

                <div className="bg-indigo-900 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Logistics Tip</h3>
                        <p className="text-indigo-200 text-lg leading-relaxed mb-6">
                            Make sure to mark items as "Returned" as soon as they reach the warehouse. This will automatically update your available inventory for new bookings.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold border border-white/20">Check Damages</div>
                            <div className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold border border-white/20">Print List</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
