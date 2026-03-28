import { useState, useEffect } from 'react';
import axios from '../api/axios';
import UtensilCard from '../components/UtensilCard';

const Utensils = () => {
    const [utensils, setUtensils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>;
    if (error) return <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg max-w-lg mx-auto mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Available Utensils</h2>
            <p className="text-gray-600 mb-8">Browse our collection of high-quality utensils for your events.</p>
            
            {utensils.length === 0 ? (
                <div className="text-center bg-gray-50 py-16 rounded-2xl border border-gray-100">
                    <p className="text-xl text-gray-500">No utensils found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {utensils.map(utensil => (
                        <UtensilCard key={utensil._id} utensil={utensil} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Utensils;
