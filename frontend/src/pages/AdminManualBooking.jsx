import { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import DatePicker from 'react-datepicker';
import { UserPlus, ShoppingCart, Calendar, CheckCircle, Trash2, Printer, X, Smartphone, QrCode } from 'lucide-react';
import { PAYMENT_CONFIG } from '../constants/payment.js';

const AdminManualBooking = () => {
    const [utensils, setUtensils] = useState([]);
    const [customer, setCustomer] = useState({ name: '', mobile: '', village: '', post: '', thana: '', district: '' });
    const [advance, setAdvance] = useState(0);
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
                paymentStatus,
                advance: Number(advance)
            });
            
            console.log('Booking Created:', data);
            setLastBooking(data);
            setShowReceipt(true);
            
            // Clean up form
            setCustomer({ name: '', mobile: '', village: '', post: '', thana: '', district: '' });
            setSelectedItems([]);
            setAdvance(0);
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
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Village (ग्राम)</label>
                                <input required type="text" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={customer.village} onChange={e => setCustomer({...customer, village: e.target.value})} placeholder="e.g. Rampur" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Post (पोस्ट)</label>
                                <input required type="text" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={customer.post} onChange={e => setCustomer({...customer, post: e.target.value})} placeholder="e.g. Post Office Name" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Police Station (थाना)</label>
                                <input required type="text" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={customer.thana} onChange={e => setCustomer({...customer, thana: e.target.value})} placeholder="e.g. PS Location" />
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
                                <div className="pt-4 border-t border-dashed">
                                    <label className="block text-[10px] font-black text-indigo-600 uppercase mb-2 tracking-widest">Advance Payment (अग्रिम)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-indigo-400">₹</span>
                                        <input 
                                            type="number" 
                                            className="w-full p-4 pl-8 border-2 border-indigo-100 rounded-2xl bg-indigo-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-black text-indigo-700" 
                                            value={advance} 
                                            onChange={e => setAdvance(e.target.value)} 
                                            placeholder="0" 
                                        />
                                    </div>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border-[16px] border-white ring-1 ring-black/5 flex flex-col max-h-[95vh]">
                        <button onClick={() => setShowReceipt(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-full z-[60]">
                            <X size={24} />
                        </button>

                        <div ref={receiptRef} className="p-8 flex-grow overflow-y-auto bg-[#fff0f3]" id="printable-receipt">
                            {/* Header - Matching Image */}
                            <div className="text-center border-b-2 border-black pb-4 mb-6 relative text-black">
                                <span className="absolute top-0 right-0 text-[10px] font-bold text-gray-400 font-serif lowercase">Mob: 9546052856</span>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-1 font-serif tracking-tighter">दिनेश बर्तन भण्डार</h1>
                                <p className="text-sm font-bold text-gray-800 mb-1">प्रो. : दिनेश साह</p>
                                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                                    ग्राम- चैनपुर ( बीच टोला ), पो. : चैनपुर हाता, जिला : गोपालगंज ( बिहार )
                                </p>
                            </div>

                            {/* Customer Detail Lines - Matching Image Lines */}
                            <div className="space-y-4 mb-8 text-[13px] font-bold text-gray-800">
                                <div className="flex gap-2 items-end">
                                    <span className="shrink-0">साटाधारी का नाम</span>
                                    <div className="flex-grow border-b border-black border-dotted pb-0.5 px-4 font-black text-indigo-700 italic">{lastBooking.user?.name}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 items-end">
                                        <span className="shrink-0">ग्राम</span>
                                        <div className="flex-grow border-b border-black border-dotted pb-0.5 px-4">{lastBooking.village}</div>
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <span className="shrink-0">पोस्ट</span>
                                        <div className="flex-grow border-b border-black border-dotted pb-0.5 px-4">{lastBooking.post}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex gap-2 items-end">
                                        <span className="shrink-0">थाना</span>
                                        <div className="flex-grow border-b border-black border-dotted pb-0.5 px-4">{lastBooking.thana}</div>
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <span className="shrink-0">जिला</span>
                                        <div className="flex-grow border-b border-black border-dotted pb-0.5 px-4">{lastBooking.district}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>के रहने वाला हूँ।</span>
                                </div>
                                <div className="flex gap-2 items-baseline">
                                    <span>मैं इनको अपना</span>
                                    <div className="flex-grow border-b border-black border-dotted max-w-[100px] text-center italic text-indigo-600">बर्तन</div>
                                    <span>का साटा दिनांक</span>
                                    <div className="flex-grow border-b border-black border-dotted px-2 text-center text-indigo-600 underline">{new Date(lastBooking.startDate).toLocaleDateString()}</div>
                                </div>
                                <div className="flex gap-2 items-baseline">
                                    <span>से दिनांक</span>
                                    <div className="flex-grow border-b border-black border-dotted px-2 text-center text-indigo-600 underline">{new Date(lastBooking.endDate).toLocaleDateString()}</div>
                                    <span>को / तक के लिए तय करता हूँ।</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                    <div className="flex gap-2 items-center">
                                         <span className="text-gray-500 text-[11px] uppercase tracking-widest">साटाधारी का मो.</span>
                                         <span className="font-black text-indigo-600 underline">{lastBooking.user?.mobile}</span>
                                    </div>
                                    <div className="text-[10px] font-black italic opacity-60">ID: {lastBooking._id.slice(-8).toUpperCase()}</div>
                                </div>
                            </div>

                            {/* Table - Matching Image Grid */}
                            <table className="w-full border-2 border-black mb-6 text-[12px]">
                                <thead>
                                    <tr className="border-b-2 border-black divide-x-2 divide-black bg-gray-50">
                                        <th className="w-12 p-1 text-center font-black">क्र.सं.</th>
                                        <th className="p-1 px-4 text-left font-black">सामान का विवरण</th>
                                        <th className="w-20 p-1 text-center font-black">तायदाद</th>
                                        <th className="w-20 p-1 text-center font-black">रू०</th>
                                        <th className="w-12 p-1 text-center font-black">पै०</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black">
                                    {lastBooking.items.map((item, idx) => (
                                        <tr key={idx} className="divide-x-2 divide-black">
                                            <td className="p-2 text-center font-bold">{idx + 1}.</td>
                                            <td className="p-2 px-4 font-black text-gray-900 uppercase italic tracking-tighter">{item.name}</td>
                                            <td className="p-2 text-center font-black text-indigo-700">{item.quantity}</td>
                                            <td className="p-2 text-right font-black px-3">{item.pricePerDay * item.quantity}</td>
                                            <td className="p-2 text-center font-bold text-gray-400">00</td>
                                        </tr>
                                    ))}
                                    {/* Fill empty rows for aesthetic if needed, but here we just show what exists */}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-black divide-x-2 divide-black">
                                        <td colSpan="3" rowSpan={3} className="p-4 text-[10px] font-bold text-gray-500 leading-relaxed align-top italic">
                                            १. हमारे यहाँ हर प्रकार का बर्तन किराये पर उपलब्ध है। सामान ले जाने और ले आने की जिम्मेदारी साटाधारक की होगी। कोई भी सामान गुम होने पर भी उसकी जिम्मेदारी साटाधारक की ही होगी।
                                        </td>
                                        <td className="p-2 font-black bg-gray-50">टोटल</td>
                                        <td className="p-2 text-right font-black px-3 underline decoration-double">{lastBooking.totalPrice}</td>
                                    </tr>
                                    <tr className="border-t-2 border-black divide-x-2 divide-black">
                                        <td className="p-2 font-black bg-gray-100">अग्रिम</td>
                                        <td className="p-2 text-right font-black px-3 bg-gray-50">-{lastBooking.advance || 0}</td>
                                    </tr>
                                    <tr className="border-t-2 border-black divide-x-2 divide-black bg-indigo-50/50">
                                        <td className="p-2 font-black text-indigo-700">बाकी</td>
                                        <td className="p-2 text-right font-black px-3 text-indigo-900 text-lg italic">₹{lastBooking.totalPrice - (lastBooking.advance || 0)}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* Signatures */}
                            <div className="flex justify-between items-end mt-12 px-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                <div className="text-center group">
                                     <div className="w-32 h-0.5 bg-black mb-2 opacity-20 group-hover:opacity-100"></div>
                                     <span>साटाधारी का ह०</span>
                                </div>
                                <div className="text-center group">
                                     <div className="w-32 h-0.5 bg-black mb-2 opacity-20 group-hover:opacity-100"></div>
                                     <span>गवाह का ह०</span>
                                </div>
                                <div className="text-center group">
                                     <div className="w-32 h-0.5 bg-black mb-2 opacity-20 group-hover:opacity-100"></div>
                                     <span className="text-gray-900">मालिक का ह०</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 border-t flex gap-4 no-print">
                            <button onClick={handlePrint} className="flex-grow bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-gray-200">
                                <Printer size={20} /> प्रिंट निकालें (Print Receipt)
                            </button>
                            <button onClick={() => setShowReceipt(false)} className="px-10 border-2 border-gray-200 text-gray-900 font-black py-5 rounded-2xl hover:bg-white transition uppercase text-xs tracking-widest block md:hidden lg:block">
                                बंद करें
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
