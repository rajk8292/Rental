import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Info, Check } from 'lucide-react';

const UtensilCard = ({ utensil }) => {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addToCart } = useContext(CartContext);

    const handleAdd = () => {
        addToCart(utensil, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
                <img 
                    src={utensil.image || 'https://via.placeholder.com/400x300?text=Utensil'} 
                    alt={utensil.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-indigo-700 shadow-sm">
                    ₹{utensil.pricePerDay}/day
                </div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{utensil.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{utensil.description || 'Premium quality utensil for your event.'}</p>
                
                <div className="mt-auto mb-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Info size={16} className="text-indigo-500"/> Available: <span className="font-semibold text-gray-800">{utensil.availableQuantity} units</span>
                </div>

                <div className="flex gap-2 items-center mb-4">
                    <label className="text-xs text-gray-500 font-bold">Qty:</label>
                    <input 
                        type="number" 
                        min="1" 
                        max={utensil.availableQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-20 p-2 border rounded-lg text-sm bg-white"
                    />
                </div>

                <button 
                    onClick={handleAdd}
                    className={`w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 ${added ? 'bg-green-600 shadow-inner' : 'hover:bg-indigo-700 shadow'}`}
                >
                    {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
                </button>
            </div>
        </div>
    );
};

export default UtensilCard;
