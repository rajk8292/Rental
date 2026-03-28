import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { 
    ChevronRight, 
    ChevronLeft, 
    Star, 
    ArrowRight, 
    ShoppingBag, 
    Truck, 
    Users, 
    MessageCircle 
} from 'lucide-react';

const homeImages = [
    '/images/wedding_bartan_set_1774705113403.png',
    '/images/catering_utensils_bulk_1774705388949.png',
    '/images/traditional_indian_dinnerware_1774705420850.png'
];

const Home = () => {
    const { t, lang } = useLanguage();
    const [current, setCurrent] = useState(0);
    const [utensils, setUtensils] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % homeImages.length);
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

    const categories = [
        { name: 'Dinner Plates', hi: 'भोजन की प्लेटें', icon: '🍽️', color: 'bg-blue-50 dark:bg-blue-900/10' },
        { name: 'Cooking Units', hi: 'खाना बनाने के देग', icon: '🥘', color: 'bg-amber-50 dark:bg-amber-900/10' },
        { name: 'Water Glass', hi: 'पानी के गिलास', icon: '🥤', color: 'bg-indigo-50 dark:bg-indigo-900/10' },
        { name: 'Full Sets', hi: 'पूरा केटरिंग सेट', icon: '✨', color: 'bg-emerald-50 dark:bg-emerald-900/10' },
        { name: 'Spoons/Forks', hi: 'चम्मच और कांटे', icon: '🍴', color: 'bg-rose-50 dark:bg-rose-900/10' },
        { name: 'Tandoor/Oven', hi: 'तंदूर और भट्टी', icon: '🔥', color: 'bg-orange-50 dark:bg-orange-900/10' }
    ];

    const feedbacks = [
        { name: 'Rahul Kumar', location: 'Rampur Village', comment: 'Best quality utensils in the area. Very shiny and well cleaned. Highly recommended for weddings!', rating: 5, initial: 'RK' },
        { name: 'Anita Singh', location: 'Chainpur Hata', comment: 'Dinesh ji ka vyavahar bahut accha hai. Delivery bilkul time par hui aur saman perfect tha.', rating: 5, initial: 'AS' },
        { name: 'Mohammed Imran', location: 'Rampur Gauv', comment: 'Hassle-free booking system. The online portal made it very easy to choose items and see rates.', rating: 4, initial: 'MI' }
    ];

    return (
        <div className="space-y-24 bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* 1. MAIN SLIDER SECTION */}
            <section className="relative h-[400px] sm:h-[600px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden group shadow-2xl">
                {homeImages.map((img, idx) => (
                    <div key={idx} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 invisible'}`}>
                        <img src={img} alt="Hero Slider" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent"></div>
                    </div>
                ))}
                
                {/* Fixed Slider Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-center px-10 sm:px-20 max-w-4xl text-white">
                    <span className="bg-blue-900 w-fit px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-xl">Premium Rentals</span>
                    <h1 className="text-4xl sm:text-7xl font-black mb-6 leading-[1.1] tracking-tight drop-shadow-lg italic">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-lg sm:text-2xl text-slate-200 mb-10 max-w-2xl font-medium drop-shadow-md">
                        {t('heroSub')}
                    </p>
                    <div className="flex flex-wrap gap-5">
                       <Link to="/utensils" className="bg-white text-blue-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2">
                           {t('exploreBtn')} <ArrowRight size={22} />
                       </Link>
                    </div>
                </div>

                {/* Slider Controls */}
                <div className="absolute bottom-10 right-10 z-20 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setCurrent(p => (p - 1 + homeImages.length) % homeImages.length)} className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={() => setCurrent(p => (p + 1) % homeImages.length)} className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-10 left-10 sm:left-20 z-20 flex gap-2">
                    {homeImages.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-10 bg-blue-900' : 'w-4 bg-white/40'}`}></div>
                    ))}
                </div>
            </section>

            {/* 2. CATEGORIES SECTION */}
            <section className="px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-blue-900 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-3 block italic">{t('quickCategories')}</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Choose From Categories</h2>
                    </div>
                    <Link to="/utensils" className="text-blue-900 dark:text-blue-400 font-bold hover:underline underline-offset-8 flex items-center gap-1 uppercase text-xs tracking-widest">
                        Show Full Catalog <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-10">
                    {categories.map((cat, i) => (
                        <Link to="/utensils" key={i} className={`group flex flex-col items-center text-center p-8 rounded-[2.5rem] ${cat.color} border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm`}>
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{lang === 'hi' ? cat.hi : cat.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Browse Stock</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Selected Items (Optional Showcase but needed for Marketplace look) */}
            <section className="px-6 max-w-7xl mx-auto py-10">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                      {utensils.slice(0, 4).map(u => (
                          <Link to="/utensils" key={u._id} className="group">
                               <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                   <img src={u.image} alt={u.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                   <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                                       <ShoppingBag size={18} className="text-blue-900" />
                                   </div>
                               </div>
                               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{u.name}</h3>
                               <p className="text-blue-900 dark:text-blue-400 font-black italic">₹{u.pricePerDay} / day</p>
                          </Link>
                      ))}
                 </div>
            </section>

            {/* 3. FEEDBACK / TESTIMONIALS SECTION */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-32 rounded-[4rem] px-6 mx-2">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <span className="text-blue-900 dark:text-blue-400 font-black uppercase text-[10px] tracking-[0.3em] bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 rounded-full italic">Happy Customers</span>
                        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Customer Feedback</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">See what our community in Chainpur Hata says about our rental service.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {feedbacks.map((fb, i) => (
                            <div key={i} className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 relative hover:-translate-y-2 transition-transform duration-500 group">
                                <div className="absolute -top-6 -left-2 text-blue-500/10 text-[10rem] italic font-black pointer-events-none select-none">“</div>
                                <div className="relative z-10">
                                    <div className="flex text-amber-500 gap-1 mb-6">
                                        {[...Array(fb.rating)].map((_, j) => <Star key={j} size={16} className="fill-current" />)}
                                    </div>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed mb-10">"{fb.comment}"</p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                                        <div className="w-14 h-14 bg-gradient-to-tr from-blue-900 to-blue-700 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/20">{fb.initial}</div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{fb.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{fb.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 flex flex-wrap justify-center gap-10 opacity-30 grayscale pointer-events-none">
                         <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic"><Truck size={30} /> FAST DELIVERY</div>
                         <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic"><Users size={30} /> 500+ HAPPY FAMILIES</div>
                         <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic"><MessageCircle size={30} /> 24/7 SUPPORT</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
