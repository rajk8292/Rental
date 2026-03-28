import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Calendar, Repeat, Smartphone, QrCode, X, CheckCircle2, FileText } from 'lucide-react';
import { PAYMENT_CONFIG } from '../constants/payment.js';
import { QRCodeCanvas } from 'qrcode.react';
import { generateReceipt } from '../utils/generateReceipt';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null); // 'razorpay' or 'phonepe'

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('/bookings/mybookings');
                setBookings(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch bookings');
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleRazorpayPayment = async (booking) => {
        try {
            const { data: order } = await axios.post('/bookings/payment/order', {
                amount: booking.totalPrice
            });

            const options = {
                key: "your_key_id", // Replace with real Razorpay Key ID
                amount: order.amount,
                currency: "INR",
                name: "Bartan Rental System",
                description: `Payment for Order #${booking._id.slice(-6)}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        await axios.post('/bookings/payment/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: booking._id
                        });
                        alert('Payment Successful!');
                        window.location.reload();
                    } catch (err) {
                        alert('Payment Verification Failed');
                    }
                },
                theme: { color: "#4f46e5" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Failed to initiate payment');
        }
    };

    const handlePaymentSelect = (booking) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    const upiID = PAYMENT_CONFIG.upiID;
    const upiName = PAYMENT_CONFIG.upiName;

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>;
    if (error) return <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg max-w-lg mx-auto mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="text-center bg-gray-50 py-16 rounded-2xl border border-gray-100">
                    <p className="text-xl text-gray-500">You have no bookings.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white border rounded-3xl shadow-sm hover:shadow-lg transition p-8 flex flex-col border-gray-100 relative overflow-hidden group">
                            <div className="flex justify-between items-start border-b border-dashed border-gray-200 pb-6 mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order ID: {booking._id.slice(-6)}</h3>
                                        <button 
                                            onClick={() => generateReceipt(booking)}
                                            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter bg-indigo-50 px-2 py-1 rounded-md"
                                        >
                                            <FileText size={12} /> Receipt
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {booking.items.map((item, idx) => (
                                            <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                                                {item.name} x {item.quantity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${booking.status === 'Approved' ? 'bg-green-500 text-white' :
                                        booking.status === 'Rejected' ? 'bg-red-500 text-white' :
                                            'bg-amber-400 text-white'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="flex-grow space-y-4">
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                                    <div className="text-sm">
                                        <span className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Start Date</span>
                                        <span className="font-bold text-gray-800 flex items-center gap-2"><Calendar size={14} className="text-indigo-400" /> {new Date(booking.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-sm border-l pl-4 border-gray-200">
                                        <span className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">End Date</span>
                                        <span className="font-bold text-gray-800 flex items-center gap-2"><Calendar size={14} className="text-indigo-400" /> {new Date(booking.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                {booking.status === 'Approved' && (
                                    <div className="py-4 border-t border-dashed border-gray-100 mt-2">
                                        <div className="flex justify-between items-center relative mb-2">
                                            {/* Line */}
                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                                            <div className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
                                                style={{
                                                    width: `${booking.deliveryStatus === 'Confirmed' ? '0%' :
                                                            booking.deliveryStatus === 'Packed' ? '25%' :
                                                            booking.deliveryStatus === 'Shipped' ? '50%' :
                                                            booking.deliveryStatus === 'Delivered' ? '75%' :
                                                                booking.deliveryStatus === 'Returned' || booking.deliveryStatus === 'Checked' ? '100%' : '0%'
                                                        }`
                                                }}></div>

                                            {[
                                                { name: 'Confirmed', icon: '📦' },
                                                { name: 'Shipped', icon: '🚚' },
                                                { name: 'Delivered', icon: '🏠' },
                                                { name: 'Returned', icon: '🔄' }
                                            ].map((step, idx) => {
                                                const isActive = [
                                                    'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Returned', 'Checked'
                                                ].indexOf(booking.deliveryStatus) >= [
                                                    'Confirmed', 'Shipped', 'Delivered', 'Returned'
                                                ].indexOf(step.name);

                                                const isCurrent = booking.deliveryStatus === step.name || (step.name === 'Shipped' && booking.deliveryStatus === 'Packed') || (step.name === 'Returned' && booking.deliveryStatus === 'Checked');

                                                return (
                                                    <div key={idx} className="relative z-10 flex flex-col items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm transition-all duration-300 border-2 ${isActive ? 'bg-indigo-600 border-indigo-600 text-white scale-110' : 'bg-white border-gray-300 text-gray-400'
                                                            } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}>
                                                            {step.icon}
                                                        </div>
                                                        <span className={`text-[8px] font-black uppercase mt-1 tracking-tighter ${isActive ? 'text-indigo-700' : 'text-gray-400'}`}>
                                                            {step.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center bg-indigo-900 text-white p-5 rounded-2xl shadow-indigo-200 shadow-md">
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-indigo-300 tracking-widest">Total Valuation</p>
                                        <p className="text-3xl font-black">₹{booking.totalPrice}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black uppercase tracking-tighter block mb-1 ${booking.paymentStatus === 'Completed' ? 'text-green-400' : 'text-amber-400'
                                            }`}>
                                            Payment {booking.paymentStatus}
                                        </span>
                                        <div className="flex gap-2 justify-end">
                                            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
                                            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse delay-75"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {booking.paymentStatus !== 'Completed' && booking.status !== 'Rejected' && (
                                <button
                                    onClick={() => handlePaymentSelect(booking)}
                                    className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
                                >
                                    <CreditCard size={20} /> PAY NOW
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Method Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-none">Choose Payment</h3>
                                <p className="text-gray-500 mt-2 font-bold text-sm">Amount to pay: <span className="text-indigo-600">₹{selectedBooking?.totalPrice}</span></p>
                            </div>
                            <button
                                onClick={() => { setShowPaymentModal(false); setPaymentMethod(null); }}
                                className="p-2 hover:bg-white rounded-full transition text-gray-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {!paymentMethod ? (
                            <div className="p-8 space-y-4">
                                <button
                                    onClick={() => handleRazorpayPayment(selectedBooking)}
                                    className="w-full flex items-center justify-between p-6 rounded-3xl border-2 border-indigo-50 hover:border-indigo-600 hover:bg-indigo-50/30 transition group"
                                >
                                    <div className="flex items-center gap-5 text-left">
                                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                            <CreditCard size={32} />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg text-gray-900">Razorpay Secure</p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Debit/Credit Cards, NetBanking</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-indigo-600 flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition shadow-sm"></div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('phonepe')}
                                    className="w-full flex items-center justify-between p-6 rounded-3xl border-2 border-[#6739B7]/10 hover:border-[#6739B7] hover:bg-[#6739B7]/5 transition group"
                                >
                                    <div className="flex items-center gap-5 text-left">
                                        <div className="w-16 h-16 bg-[#6739B7] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#6739B7]/20">
                                            <Smartphone size={32} />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg text-gray-900">PhonePe / UPI</p>
                                            <p className="text-xs font-bold text-[#6739B7] uppercase tracking-tighter">Direct Transfer via PhonePe</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-[#6739B7] flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-[#6739B7] opacity-0 group-hover:opacity-100 transition shadow-sm"></div>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="p-10 text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <div className="mb-8">
                                    <div className="bg-[#6739B7]/10 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-[#6739B7]/20">
                                        <QrCode size={40} className="text-[#6739B7]" />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900">Scan to Pay</h4>
                                    <p className="text-gray-500 font-bold mt-2">Dinesh Bartan Bhandar</p>
                                </div>

                                {/* UPI QR Generator */}
                                <div className="bg-gray-50 p-6 rounded-[32px] border-2 border-dashed border-gray-200 mb-8 relative group">
                                    <div className="aspect-square bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                                        <QRCodeCanvas 
                                            value={`upi://pay?pa=${upiID}&pn=${upiName}&am=${selectedBooking?.totalPrice}&cu=INR`}
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Transfer Exactly</p>
                                        <p className="text-3xl font-black text-[#6739B7]">₹{selectedBooking?.totalPrice}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">UPI ID:</p>
                                        <p className="font-bold text-gray-800 text-sm select-all">{upiID}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <a
                                        href={`upi://pay?pa=${upiID}&pn=${upiName}&am=${selectedBooking?.totalPrice}&cu=INR`}
                                        className="w-full bg-[#6739B7] text-white py-5 rounded-3xl font-black text-base hover:bg-[#5c33a3] transition flex items-center justify-center gap-3 shadow-xl shadow-[#6739B7]/20"
                                    >
                                        <Smartphone size={20} /> OPEN IN PHONEPE
                                    </a>
                                    <button
                                        onClick={() => {
                                            alert('Please send the screenshot to our Whatsapp number for verification.');
                                            setShowPaymentModal(false);
                                            setPaymentMethod(null);
                                        }}
                                        className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition"
                                    >
                                        I've already paid →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
