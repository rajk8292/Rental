import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ChevronRight, ChevronLeft, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070',
        title: 'Premium Wedding Bartan',
        sub: 'Apni shadi ko yaadgar banayein hamare elite collection aur naye bartano ke saath.'
    },
    {
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=2070',
        title: 'Bulk Catering Bartan',
        sub: 'Professional catering teams ke liye badi deg aur bhattiyan available hain.'
    },
    {
        image: 'https://images.unsplash.com/photo-1478144592103-2582190700d3?auto=format&fit=crop&q=80&w=2070',
        title: 'Glassware & Crokery',
        sub: 'Crystal-clear glassware aur premium crokery aapki party ki shaan badhane ke liye.'
    },
    {
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069',
        title: 'Complete Bartan Sets',
        sub: 'Sab kuch ek hi jagah—event ke liye poora bartan set delivery ke saath.'
    }
];

const Home = () => {
    const [current, setCurrent] = useState(0);
    const [utensils, setUtensils] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 5000);

        const fetchUtensils = async () => {
            try {
                const { data } = await axios.get('/utensils');
                setUtensils(data);
            } catch (err) {
                console.error('Failed to fetch utensils');
            }
        };
        fetchUtensils();

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Carousel */}
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                {slides.map((s, idx) => (
                    <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}>
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                        <img src={s.image} alt="Hero" className="w-full h-full object-cover" />
                        
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 sm:p-12">
                            <h1 className="text-4xl sm:text-7xl font-black text-white mb-6 drop-shadow-lg tracking-tight leading-tight max-w-4xl">
                                {s.title}
                            </h1>
                            <p className="text-lg sm:text-2xl text-white/90 mb-10 max-w-2xl drop-shadow-md font-medium leading-relaxed">
                                {s.sub}
                            </p>
                            <div className="flex gap-4">
                                <Link to="/utensils" className="bg-white text-indigo-700 font-black py-4 px-10 rounded-2xl hover:bg-indigo-50 transition shadow-xl text-lg flex items-center gap-2">
                                    Bartan Dekhein <ArrowRight size={20} />
                                </Link>
                                <Link to="/register" className="bg-indigo-600/20 backdrop-blur-md text-white border-2 border-white/50 font-bold py-4 px-10 rounded-2xl hover:bg-indigo-600 transition text-lg">
                                    Register Karein
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slider Controls */}
                <button onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-2xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={() => setCurrent(p => (p + 1) % slides.length)} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-2xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                    <ChevronRight size={32} />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)} className={`h-3 rounded-full transition-all duration-300 ${i === current ? 'w-10 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'}`}></button>
                    ))}
                </div>
            </div>

            {/* Quick Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><ShoppingBag size={32} /></div>
                    <h3 className="text-xl font-bold mb-3">Bulk Bartan</h3>
                    <p className="text-gray-500 text-sm font-medium">Shaadi (शादी) ya grand party—hamare paas sab ke liye bartan hain.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group"><CheckCircle size={32} className="group-hover:scale-110 transition"/></div>
                    <h3 className="text-xl font-bold mb-3">Saaf-Suthre Sets</h3>
                    <p className="text-gray-500 text-sm font-medium">Har bartan sanitize (साफ़) kiya jata hai delivery se pehle.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><ArrowRight size={32} /></div>
                    <h3 className="text-xl font-bold mb-3">Home Delivery</h3>
                    <p className="text-gray-500 text-sm font-medium">City ke kisi bhi kone mein loading aur delivery available.</p>
                </div>
            </div>

            {/* Featured Collection Section */}
            <div className="py-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 italic tracking-tight uppercase">Hamara Bartan Collection</h2>
                        <p className="text-gray-500 font-semibold uppercase text-xs tracking-widest italic">Behtareen quality ke bartan kiraye par</p>
                    </div>
                    <Link to="/utensils" className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                        Poora Catalog Dekhein <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {utensils.slice(0, 4).map(u => (
                        <div key={u._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative">
                            <div className="h-72 overflow-hidden relative">
                                <img src={u.image} alt={u.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-700 shadow-sm uppercase tracking-tighter">
                                    Top Quality
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{u.name}</h3>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-2xl font-black text-indigo-600 italic">₹{u.pricePerDay}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">/ per day</span>
                                </div>
                                <Link to="/utensils" className="block w-full text-center bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-600 transition shadow-lg shadow-gray-200">
                                    DETAILS DEKHEIN
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                    {utensils.length === 0 && Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-gray-50 border-2 border-dashed border-gray-200 h-[450px] rounded-[2rem] flex items-center justify-center p-10 text-center">
                           <div className="space-y-4 w-full">
                               <div className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
                               <div className="h-6 bg-gray-200 rounded-full w-3/4 mx-auto animate-pulse"></div>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
