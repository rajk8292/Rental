import { useState, useEffect } from 'react';
import axios from '../api/axios';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('/bookings');
                setBookings(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const { data } = await axios.put(`/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b._id === id ? data : b));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handlePaymentStatusUpdate = async (id, paymentStatus) => {
        try {
            const { data } = await axios.put(`/bookings/${id}/payment-status`, { paymentStatus });
            setBookings(bookings.map(b => b._id === id ? data : b));
        } catch (error) {
            alert('Failed to update payment status');
        }
    };

    const handleDeliveryStatusUpdate = async (id, deliveryStatus) => {
        try {
            const { data } = await axios.put(`/bookings/${id}/delivery-status`, { deliveryStatus });
            setBookings(bookings.map(b => b._id === id ? data : b));
        } catch (error) {
            alert('Failed to update tracking status');
        }
    };

    const handleReportDamage = async (booking) => {
        const notes = window.prompt('Describe damages/missing icons (or leave empty):', booking.notes || '');
        if (notes === null) return;
        
        try {
            const { data } = await axios.put(`/bookings/${booking._id}/report-damage`, { notes });
            setBookings(bookings.map(b => b._id === booking._id ? data : b));
        } catch (error) {
            alert('Failed to update damage report');
        }
    };

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>;

    return (
        <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Bookings</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                                <th className="p-4 font-semibold">User Details</th>
                                <th className="p-4 font-semibold">Utensil</th>
                                <th className="p-4 font-semibold">Dates</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Total Price</th>
                                <th className="p-4 font-semibold">Approval Status</th>
                                <th className="p-4 font-semibold">Tracking Status</th>
                                <th className="p-4 font-semibold">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {bookings.map(booking => (
                                <tr key={booking._id} className="hover:bg-gray-50/50">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{booking.user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500 font-medium">{booking.user?.mobile || 'No Mobile'}</div>
                                    </td>
                                    <td className="p-4 font-medium text-indigo-700">
                                        {booking.items.map((item, idx) => (
                                            <div key={idx} className="whitespace-nowrap">
                                                {item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-400">to {new Date(booking.endDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{booking.village || 'Local'}</div>
                                        <div className="text-[10px] text-indigo-500 uppercase font-bold">{booking.district || 'Local'}</div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">₹{booking.totalPrice}</td>
                                    <td className="p-4">
                                        <select 
                                            value={booking.status} 
                                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                            className={`border rounded-lg px-3 py-1.5 text-sm outline-none shadow-sm focus:ring-2 appearance-none font-semibold ${
                                                booking.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-500' :
                                                booking.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200 focus:ring-yellow-500'
                                            }`}
                                        >
                                            <option value="Pending" className="text-gray-800 bg-white">⌛ Pending</option>
                                            <option value="Approved" className="text-gray-800 bg-white">✅ Approve</option>
                                            <option value="Rejected" className="text-gray-800 bg-white">❌ Reject</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            value={booking.deliveryStatus || 'Confirmed'} 
                                            onChange={(e) => handleDeliveryStatusUpdate(booking._id, e.target.value)}
                                            className={`border rounded-lg px-3 py-1.5 text-[10px] outline-none shadow-sm focus:ring-2 appearance-none font-bold uppercase tracking-wider ${
                                                booking.deliveryStatus === 'Returned' || booking.deliveryStatus === 'Checked' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                booking.deliveryStatus === 'Delivered' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}
                                        >
                                            <option value="Confirmed">📦 Confirmed</option>
                                            <option value="Packed">🎁 Packed</option>
                                            <option value="Shipped">🚚 Shipped</option>
                                            <option value="Delivered">🏠 At Venue</option>
                                            <option value="Returned">🔄 Returned</option>
                                            <option value="Checked">✨ Checked</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-2">
                                            <select 
                                                value={booking.paymentStatus} 
                                                onChange={(e) => handlePaymentStatusUpdate(booking._id, e.target.value)}
                                                className={`border rounded-lg px-2 py-1 text-[10px] outline-none shadow-sm focus:ring-2 font-bold uppercase tracking-wider ${
                                                    booking.paymentStatus === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    booking.paymentStatus === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-orange-50 text-orange-700 border-orange-200'
                                                }`}
                                            >
                                                <option value="Pending" className="text-gray-800 bg-white">Pending</option>
                                                <option value="Completed" className="text-gray-800 bg-white">Completed</option>
                                                <option value="Failed" className="text-gray-800 bg-white">Failed</option>
                                            </select>

                                            {(booking.deliveryStatus === 'Returned' || booking.deliveryStatus === 'Checked') && (
                                                <button 
                                                    onClick={() => handleReportDamage(booking)}
                                                    className="text-[10px] font-black text-red-500 hover:text-red-700 hover:underline uppercase tracking-tighter"
                                                >
                                                    {booking.notes ? '⚠️ Damage Listed' : '+ Report Damage'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
