import { useState, useEffect } from 'react';
import axios from '../api/axios';
import UtensilCard from '../components/UtensilCard';

const Utensils = () => {
    const [utensils, setUtensils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchUtensils = async () => {
            try {
                const { data } = await axios.get('/utensils');
                setUtensils(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch utensils');
                setLoading(false);
            }
        };
        fetchUtensils();
    }, []);

    const filteredUtensils = utensils.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = category === 'All' || u.category === category;
        return matchesSearch && matchesCat;
    });

    const categories = ['All', 'Cooking', 'Serving', 'Utility', 'Extra'];

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>;
    if (error) return <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg max-w-lg mx-auto mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2 italic tracking-tight underline decoration-indigo-200">BARTAN CATALOG</h2>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Explore our premium event collections</p>
                </div>
                <div className="w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search Bartan (जैसे: Plate)..." 
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-12">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                            category === cat 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200 hover:text-indigo-600'
                        }`}
                    >
                        {cat === 'All' ? 'Sabhi (सभी)' : 
                         cat === 'Cooking' ? 'Pakana (पकाना)' :
                         cat === 'Serving' ? 'Parosna (परोसना)' :
                         cat === 'Utility' ? 'Bhandaran (भंडारण)' : 
                         cat === 'Extra' ? 'Extra (अन्य)' : cat}
                    </button>
                ))}
            </div>
            
            {filteredUtensils.length === 0 ? (
                <div className="text-center bg-gray-50 py-20 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <p className="text-2xl font-black text-gray-300 mb-4 italic uppercase">Is category mein kuch nahi mila!</p>
                    <button onClick={() => {setCategory('All'); setSearchTerm('');}} className="text-indigo-600 font-black underline decoration-indigo-200 hover:text-indigo-800 uppercase text-xs tracking-widest">Wapas Jayein (Reset)</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                    {filteredUtensils.map(utensil => (
                        <UtensilCard key={utensil._id} utensil={utensil} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Utensils;
