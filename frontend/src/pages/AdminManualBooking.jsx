import { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import DatePicker from 'react-datepicker';
import { UserPlus, ShoppingCart, Calendar, CheckCircle, Trash2, Printer, X, Smartphone, QrCode } from 'lucide-react';
import { PAYMENT_CONFIG } from '../constants/payment.js';

const AdminManualBooking = () => {
    const [utensils, setUtensils] = useState([]);
    const [customer, setCustomer] = useState({ name: '', mobile: '', village: '', district: '' });
    const [selectedItems, setSelectedItems] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Receipt State
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastBooking, setLastBooking] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const receiptRef = useRef();

    useEffect(() => {
        const fetchUtensils = async () => {
            const { data } = await axios.get('/utensils');
            setUtensils(data);
        };
        fetchUtensils();
    }, []);

    // Customer Auto-fill Logic
    useEffect(() => {
        const searchCustomer = async () => {
            if (customer.mobile.length === 10) {
                try {
                    setSearching(true);
                    const { data } = await axios.get(`/auth/mobile/${customer.mobile}`);
                    if (data) {
                        setCustomer(prev => ({ ...prev, name: data.name }));
                    }
                } catch (err) {
                    console.log('New customer');
                } finally {
                    setSearching(false);
                }
            }
        };
        searchCustomer();
    }, [customer.mobile]);

    const addItem = (uId) => {
        const utensil = utensils.find(u => u._id === uId);
        if (selectedItems.find(i => i.utensil === uId)) return;
        setSelectedItems([...selectedItems, { 
            utensil: uId, 
            name: utensil.name, 
            quantity: 1, 
            pricePerDay: utensil.pricePerDay 
        }]);
    };

    const updateQty = (id, q) => {
        setSelectedItems(selectedItems.map(i => i.utensil === id ? { ...i, quantity: Number(q) } : i));
    };

    const removeItem = (id) => {
        setSelectedItems(selectedItems.filter(i => i.utensil !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedItems.length === 0) return alert('Add at least one item');
        
        try {
            setLoading(true);
            const { data } = await axios.post('/bookings/manual', {
                ...customer,
                items: selectedItems,
                startDate,
                endDate,
                paymentStatus
            });
            
            setLastBooking(data);
            setShowReceipt(true);
            
            // Clean up form
            setCustomer({ name: '', mobile: '', village: '', district: '' });
            setSelectedItems([]);
        } catch (error) {
            console.error('Booking Error:', error);
            alert(`Booking Failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printContent = receiptRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        
        // Use a temporary window approach for cleaner printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Receipt - दिनेश बर्तन भंडार</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('</head><body class="bg-white p-10 font-sans">');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    const total = selectedItems.reduce((acc, i) => acc + (i.pricePerDay * i.quantity * days), 0);

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <UserPlus className="text-indigo-600" /> Administrative Entry Panel
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-4">
                             कस्टमर और स्थान की जानकारी (Customer & Location)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Mobile No (मोबाइल)</label>
                                <div className="relative">
                                    <input 
                                        required 
                                        type="text" 
                                        maxLength="10"
                                        className={`w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold ${searching ? 'animate-pulse' : ''}`} 
                                        value={customer.mobile} 
                                        onChange={e => setCustomer({...customer, mobile: e.target.value.replace(/\D/g, '')})} 
                                        placeholder="9876543210" 
                                    />
                                    {searching && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 text-[10px] font-black animate-bounce">SEARCHING...</div>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Customer Name (नाम)</label>
                                <input required type="text" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} placeholder="Rahul Sharma" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Village / Area (गाँव / इलाका)</label>
                                <input required type="text" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={customer.village} onChange={e => setCustomer({...customer, village: e.target.value})} placeholder="e.g. Rampur" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">District (जिला)</label>
                                <input required type="text" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={customer.district} onChange={e => setCustomer({...customer, district: e.target.value})} placeholder="e.g. Patna" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <ShoppingCart size={20} className="text-indigo-600" /> बर्तन का चयन (Select Bartan)
                            </h3>
                            <select onChange={(e) => addItem(e.target.value)} className="p-3 text-sm border-2 border-indigo-100 rounded-xl bg-indigo-50 font-bold text-indigo-700 outline-none hover:bg-indigo-100 transition">
                                <option value="">+ Add to Bill</option>
                                {utensils.map(u => (
                                    <option key={u._id} value={u._id}>{u.name} (₹{u.pricePerDay})</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            {selectedItems.map(item => (
                                <div key={item.utensil} className="flex items-center gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                                    <div className="flex-grow font-black text-gray-800 tracking-tight">{item.name}</div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Qty</span>
                                        <input type="number" min="1" className="w-20 p-2 border-2 rounded-xl text-center font-black text-indigo-600" value={item.quantity} onChange={(e) => updateQty(item.utensil, e.target.value)} />
                                    </div>
                                    <div className="text-lg font-black text-indigo-700 w-24 text-right italic">₹{item.pricePerDay * item.quantity}</div>
                                    <button type="button" onClick={() => removeItem(item.utensil)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            ))}
                            {selectedItems.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-bold opacity-60 italic">No Bartan selected.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 sticky top-10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0 opacity-50"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 border-b pb-4">
                                <Calendar size={22} className="text-indigo-600" /> Summary
                            </h3>

                            <div className="space-y-6 text-sm font-semibold">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">कब से (Start Date)</label>
                                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="w-full p-4 border rounded-2xl bg-gray-50 font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">कब तक (End Date)</label>
                                    <DatePicker selected={endDate} onChange={date => setEndDate(date)} minDate={startDate} className="w-full p-4 border rounded-2xl bg-gray-50 font-bold" />
                                </div>
                                
                                <div className="pt-8 border-t border-dashed">
                                    <div className="flex justify-between items-center mb-6 bg-indigo-50 p-5 rounded-2xl">
                                        <span className="font-black text-indigo-400 uppercase text-[10px]">कुल रकम (Total)</span>
                                        <span className="text-3xl font-black text-indigo-800 italic tracking-tighter">₹{total}</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button disabled={loading} className="w-full bg-indigo-700 text-white font-black py-5 rounded-2xl hover:bg-gray-900 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                                            {loading ? 'Processing...' : <><CheckCircle size={20} /> बिल बनाएँ (Create Bill)</>}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowQR(true)}
                                            className="w-full bg-[#6739B7] text-white font-black py-4 rounded-2xl hover:bg-[#5c33a3] transition shadow-lg shadow-[#6739B7]/10 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                        >
                                            <Smartphone size={18} /> <QrCode size={18} /> क्यूआर कोड दिखाएं (Direct Pay)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Hindi Receipt Modal */}
            {showReceipt && lastBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative border-[12px] border-white ring-1 ring-gray-200 flex flex-col max-h-[90vh]">
                        <button onClick={() => setShowReceipt(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-full z-10">
                            <X size={24} />
                        </button>

                        <div ref={receiptRef} className="p-10 flex-grow overflow-y-auto bg-white" id="printable-receipt">
                            <div className="text-center pb-8 mb-8">
                                <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-2">दिनेश बर्तन भंडार</h1>
                                <p className="text-sm font-bold text-indigo-600 tracking-[0.3em] uppercase mb-4">किराये (Rental) की पक्की रसीद</p>
                                <div className="h-1.5 w-40 bg-gray-900 mx-auto rounded-full mb-6"></div>
                                <div className="text-[12px] font-black text-gray-500 uppercase flex flex-col gap-1 items-center">
                                    <span>📞 संपर्क: +91 95460 52856</span>
                                    <span>📍 पता: चैनपुर हाटा, बिहार (Chainpur Hata, Bihar)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10 text-xs mb-10 pb-10 border-b border-gray-100 border-dashed">
                                <div className="space-y-3">
                                    <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">ग्राहक की जानकारी (Customer Information)</p>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-black text-gray-900 leading-none">{lastBooking.user?.name}</p>
                                        <p className="font-bold text-gray-500 text-sm">मो: {lastBooking.user?.mobile}</p>
                                        <p className="font-bold text-gray-500 text-sm leading-tight text-indigo-600">पता: {lastBooking.village}, {lastBooking.district}</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-3 border-l pl-10">
                                    <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">रसीद विवरण (Receipt Details)</p>
                                    <div className="space-y-1">
                                        <p className="font-black text-gray-900 uppercase text-lg">रसीद सं: {lastBooking._id.slice(-6)}</p>
                                        <p className="font-bold text-gray-500">तिथि (Date): {new Date().toLocaleDateString()}</p>
                                        <p className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mt-2">स्थिति: {lastBooking.paymentStatus === 'Completed' ? 'भुगतान सफल' : 'भुगतान बाकी'}</p>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-left mb-10 text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-400">
                                        <th className="p-5 font-black uppercase text-[11px] tracking-widest first:rounded-l-2xl">विवरण (Particulars)</th>
                                        <th className="p-5 font-black uppercase text-[11px] tracking-widest text-center">मात्रा (Qty)</th>
                                        <th className="p-5 font-black uppercase text-[11px] tracking-widest text-right">दर (Rate)</th>
                                        <th className="p-5 font-black uppercase text-[11px] tracking-widest text-right last:rounded-r-2xl">कुल (Total)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {lastBooking.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                                            <td className="p-5 font-black text-gray-900">{item.name}</td>
                                            <td className="p-5 text-center font-bold text-gray-500 bg-gray-50/20">{item.quantity}</td>
                                            <td className="p-5 text-right font-bold text-gray-500 underline decoration-indigo-200">₹{item.pricePerDay}</td>
                                            <td className="p-5 text-right font-black text-indigo-600 text-lg">₹{item.pricePerDay * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-10 bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                                <div className="space-y-2 relative z-10 max-w-sm">
                                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">शर्तें (Notice)</p>
                                    <p className="text-[12px] font-bold text-gray-400 italic leading-relaxed">
                                        साफ-सफाई (Cleaning) हमारी जिम्मेदारी है। कृपया बर्तन सुरक्षित लौटाएँ। टूट-फूट का हर्जाना अलग से देना होगा।
                                    </p>
                                </div>
                                <div className="text-right relative z-10">
                                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-1">कुल भुगतान (Net Total)</p>
                                    <p className="text-6xl font-black italic tracking-tighter">₹{lastBooking.totalPrice}</p>
                                </div>
                            </div>
                            
                            {lastBooking.paymentStatus !== 'Completed' && (
                                <div className="mt-10 p-8 border-2 border-dashed border-indigo-100 rounded-[2rem] flex items-center justify-between bg-indigo-50/30">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">फोन-पे द्वारा भुगतान करें (Pay via PhonePe)</p>
                                        <p className="text-[10px] font-bold text-gray-400">स्कैन करें या UPI ID: <span className="text-gray-900 font-black">{PAYMENT_CONFIG.upiID}</span> पर ₹{lastBooking.totalPrice} का भुगतान करें</p>
                                    </div>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=${PAYMENT_CONFIG.upiID}%26pn=${PAYMENT_CONFIG.upiName}%26am=${lastBooking.totalPrice}%26cu=INR`}
                                        alt="UPI QR"
                                        className="w-20 h-20 rounded-xl border-4 border-white shadow-sm"
                                    />
                                </div>
                            )}

                            <div className="mt-16 text-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-2 font-serif">धन्यवाद! दोबारा पधारें</p>
                            </div>
                            
                            <div className="mt-16 flex justify-between items-end border-t border-gray-100 pt-12">
                                <div className="text-center group">
                                    <div className="w-40 h-0.5 bg-gray-200 mb-4 group-hover:bg-indigo-600 transition"></div>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">कस्टमर के हस्ताक्षर</p>
                                </div>
                                <div className="text-center group">
                                    <div className="w-40 h-0.5 bg-gray-200 mb-4 group-hover:bg-indigo-600 transition"></div>
                                    <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">दिनेश बर्तन भंडार (हस्ताक्षर)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 border-t flex gap-4">
                            <button onClick={handlePrint} className="flex-grow bg-indigo-700 text-white font-black py-5 rounded-[2rem] hover:bg-gray-900 transition flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-2xl shadow-indigo-200">
                                <Printer size={20} /> प्रिंट निकालें (Print Receipt)
                            </button>
                            <button onClick={() => setShowReceipt(false)} className="px-10 border-2 border-gray-200 text-gray-900 font-black py-5 rounded-[2rem] hover:bg-white transition uppercase text-xs tracking-widest">
                                बंद करें (Close)
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* PhonePe QR Modal for Admin */}
            {showQR && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center relative">
                        <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-full">
                            <X size={24} />
                        </button>
                        
                        <div className="mb-8">
                            <div className="bg-[#6739B7]/10 w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center mb-6 border-2 border-[#6739B7]/20">
                                <QrCode size={54} className="text-[#6739B7]" />
                            </div>
                            <h4 className="text-3xl font-black text-gray-900 italic tracking-tighter">PhonePe Payment</h4>
                            <p className="text-gray-500 font-bold mt-2 uppercase text-[10px] tracking-widest opacity-60">Dinesh Bartan Bhandar</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-[2.5rem] border-2 border-dashed border-gray-200 mb-8 flex flex-col items-center">
                            <div className="bg-white p-4 rounded-3xl shadow-inner border border-gray-100 mb-4">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${PAYMENT_CONFIG.upiID}%26pn=${PAYMENT_CONFIG.upiName}%26am=${total}%26cu=INR`}
                                    alt="Payment QR" 
                                    className="w-48 h-48 object-contain"
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to Pay (जमा करने योग्य)</p>
                                <p className="text-4xl font-black text-[#6739B7] italic tracking-tighter">₹{total}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">UPI ID:</p>
                                <p className="font-bold text-gray-800 text-sm">{PAYMENT_CONFIG.upiID}</p>
                            </div>
                        </div>

                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <CheckCircle size={12} className="text-[#6739B7]" /> 
                            Secure Direct Transfer
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManualBooking;
