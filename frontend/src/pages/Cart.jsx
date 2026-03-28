import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    
    const totalPrice = cartItems.reduce((acc, item) => {
        return acc + (item.pricePerDay * item.quantity * days);
    }, 0);

    const handleCheckout = async () => {
        if (!user) {
            alert('Please login to checkout');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const bookingData = {
                items: cartItems.map(item => ({
                    utensil: item.utensil,
                    name: item.name,
                    quantity: item.quantity,
                    pricePerDay: item.pricePerDay
                })),
                startDate,
                endDate
            };

            await axios.post('/bookings', bookingData);
            alert('Booking requested successfully!');
            clearCart();
            navigate('/my-bookings');
        } catch (error) {
            alert(error.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20 px-4">
                <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed text-lg">
                    Looks like you haven't added any utensils for your event yet. Browse our professional collection to get started!
                </p>
                <Link to="/utensils" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">
                    Browse Utensils <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <ShoppingBag className="text-indigo-600" /> Review Your Booking
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.utensil} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 group">
                            <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                            <div className="flex-grow">
                                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                <div className="text-indigo-600 font-bold mt-1">₹{item.pricePerDay} <span className="text-xs text-gray-400 font-normal">/ day</span></div>
                                <div className="text-sm text-gray-500 mt-2 font-medium">Quantity: {item.quantity}</div>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item.utensil)}
                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    
                    <button 
                        onClick={clearCart}
                        className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2 px-2"
                    >
                        <Trash2 size={16} /> Clear All Items
                    </button>
                </div>

                {/* Checkout Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-10">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
                            <Calendar className="text-indigo-600" size={20} /> Order Summary
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Event Start Date</label>
                                <DatePicker 
                                    selected={startDate} 
                                    onChange={date => setStartDate(date)} 
                                    minDate={new Date()}
                                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Event End Date</label>
                                <DatePicker 
                                    selected={endDate} 
                                    onChange={date => setEndDate(date)} 
                                    minDate={startDate}
                                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="pt-6 border-t space-y-3">
                                <div className="flex justify-between text-gray-500">
                                    <span>Duration</span>
                                    <span className="font-bold text-gray-900">{days} Day(s)</span>
                                </div>
                                <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl">
                                    <span className="font-bold text-indigo-900 text-lg">Grand Total</span>
                                    <span className="text-2xl font-black text-indigo-600">₹{totalPrice}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Request Booking Approval'}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed px-4">
                                Our team will verify utensil availability and approve your request within 2-4 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
