import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Package, Plus } from 'lucide-react';

const AdminUtensils = () => {
    const [utensils, setUtensils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    const [newUtensil, setNewUtensil] = useState({
        name: '', description: '', pricePerDay: '', availableQuantity: '', image: ''
    });

    useEffect(() => {
        const fetchUtensils = async () => {
            try {
                const { data } = await axios.get('/utensils');
                setUtensils(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchUtensils();
    }, []);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/upload', formData, config);
            setNewUtensil({ ...newUtensil, image: data.url });
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image Upload Failed');
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/utensils', newUtensil);
            setUtensils([...utensils, data]);
            setNewUtensil({ name: '', description: '', pricePerDay: '', availableQuantity: '', image: '' });
            setShowForm(false);
            alert('Utensil created successfully');
        } catch (error) {
            console.error('Failed to create utensil', error.response?.data || error);
            alert(`Failed to create utensil: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteUtensil = async (id) => {
        if(window.confirm('Delete this utensil completely from inventory?')) {
            try {
                await axios.delete(`/utensils/${id}`);
                setUtensils(utensils.filter(u => u._id !== id));
            } catch (error) {
                alert('Failed to delete utensil');
            }
        }
    };

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Manage Inventory</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow"
                >
                    {showForm ? 'Close Form' : <><Plus size={20} /> Add Utensil</>}
                </button>
            </div>

            {showForm && (
                <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Package className="text-indigo-600" /> New Catalog Entry</h3>
                    <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Utensil Name</label>
                            <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.name} onChange={e => setNewUtensil({...newUtensil, name: e.target.value})} />
                        </div>
                        
                        <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day (₹)</label>
                                <input type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.pricePerDay} onChange={e => setNewUtensil({...newUtensil, pricePerDay: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Qty</label>
                                <input type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.availableQuantity} onChange={e => setNewUtensil({...newUtensil, availableQuantity: e.target.value})} />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.description} onChange={e => setNewUtensil({...newUtensil, description: e.target.value})} />
                        </div>

                        <div className="col-span-2 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Upload Cover Image</label>
                            <input 
                                type="file" 
                                onChange={uploadFileHandler}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                            />
                            {uploading && <p className="mt-3 text-sm text-indigo-500 animate-pulse font-medium">Uploading to Cloudinary...</p>}
                            
                            <div className="mt-4 pt-4 border-t flex items-center gap-4">
                                <span className="text-gray-400 text-sm font-bold">OR</span>
                                <input 
                                    type="text" 
                                    placeholder="Paste External Image URL" 
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                    value={newUtensil.image} 
                                    onChange={e => setNewUtensil({...newUtensil, image: e.target.value})} 
                                />
                            </div>
                            
                            {newUtensil.image && (
                                <div className="mt-4">
                                    <p className="text-xs text-green-600 font-bold mb-2">Image Preview:</p>
                                    <img src={newUtensil.image} alt="Preview" className="h-32 rounded-lg border object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="col-span-2 pt-4">
                            <button type="submit" disabled={uploading} className="w-full md:w-auto bg-indigo-600 text-white font-semibold flex justify-center py-3 px-8 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                                Save Catalog Entry
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Pricing</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                        {utensils.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50/50">
                                <td className="p-4 flex items-center gap-4">
                                    {u.image ? (
                                        <img src={u.image} alt={u.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center"><Package className="text-gray-400" /></div>
                                    )}
                                    <div className="font-semibold">{u.name}</div>
                                </td>
                                <td className="p-4 font-medium">₹{u.pricePerDay} <span className="text-xs text-gray-400 font-normal">/ day</span></td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.availableQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {u.availableQuantity} left
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDeleteUtensil(u._id)} className="text-sm font-semibold text-red-500 hover:text-red-700 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUtensils;
