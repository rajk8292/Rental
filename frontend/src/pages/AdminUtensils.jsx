import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';

const AdminUtensils = () => {
    const [utensils, setUtensils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingUtensil, setEditingUtensil] = useState(null);
    const [newUtensil, setNewUtensil] = useState({
        name: '', description: '', pricePerDay: '', availableQuantity: '', image: '', category: 'Cooking'
    });
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUtensils = utensils.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            const utensilData = {
                ...newUtensil,
                pricePerDay: Number(newUtensil.pricePerDay),
                availableQuantity: Number(newUtensil.availableQuantity)
            };

            if (editingUtensil) {
                console.log('Sending Update Request:', editingUtensil._id, utensilData);
                const { data } = await axios.put(`/utensils/${editingUtensil._id}`, utensilData);
                setUtensils(prev => prev.map(u => u._id === data._id ? data : u));
                alert('Utensil updated successfully');
            } else {
                const { data } = await axios.post('/utensils', utensilData);
                setUtensils(prev => [...prev, data]);
                alert('Utensil created successfully');
            }
            setNewUtensil({ name: '', description: '', pricePerDay: '', availableQuantity: '', image: '', category: 'Cooking' });
            setShowForm(false);
            setEditingUtensil(null);
        } catch (error) {
            console.error('SERVER SAVE ERROR:', error.response?.data || error);
            alert(`Save Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleEditUtensil = (u) => {
        setEditingUtensil(u);
        setNewUtensil({
            name: u.name,
            description: u.description || '',
            pricePerDay: u.pricePerDay,
            availableQuantity: u.availableQuantity,
            image: u.image || '',
            category: u.category || 'Cooking'
        });
        setShowForm(true);
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
        <div className="bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-10 rounded-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Bartan Inventory</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Total Items: {utensils.length}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64 group">
                        <input 
                            type="text" 
                            placeholder="Find by name or type..." 
                            className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            if (showForm) {
                                setEditingUtensil(null);
                                setNewUtensil({ name: '', description: '', pricePerDay: '', availableQuantity: '', image: '', category: 'Cooking' });
                            }
                            setShowForm(!showForm);
                        }}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-blue-100 dark:shadow-none hover:-translate-y-1 active:translate-y-0"
                    >
                        {showForm ? 'Close Editor' : <><Plus size={20} /> Add New Item</>}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="mb-10 bg-white rounded-2xl shadow-sm border-2 border-blue-500/20 p-8 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between gap-2 border-b pb-4">
                        <div className="flex items-center gap-2">
                            <Package className={editingUtensil ? 'text-amber-500' : 'text-indigo-600'} /> 
                            {editingUtensil ? `EDITING: ${editingUtensil.name}` : 'Create New Catalog Entry'}
                        </div>
                        {editingUtensil && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-black px-3 py-1 rounded-full">Edit Mode</span>}
                    </h3>
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

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category (श्रेणी)</label>
                            <select 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                value={newUtensil.category}
                                onChange={e => setNewUtensil({...newUtensil, category: e.target.value})}
                            >
                                <option value="Cooking">Cooking (पकाना)</option>
                                <option value="Serving">Serving (परोसना)</option>
                                <option value="Utility">Utility (सुविधा)</option>
                                <option value="Extra">Extra (अन्य)</option>
                            </select>
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
                            <button type="submit" disabled={uploading} className={`w-full md:w-auto font-black flex justify-center py-4 px-12 rounded-2xl transition-all uppercase text-xs tracking-widest shadow-xl ${editingUtensil ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100 text-white' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 text-white'}`}>
                                {editingUtensil ? 'Update Item Info' : 'Create Catalog Entry'}
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
                            <th className="p-4">Category</th>
                            <th className="p-4">Pricing</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700">
                        {filteredUtensils.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50/50">
                                <td className="p-4 flex items-center gap-4">
                                    {u.image ? (
                                        <img src={u.image} alt={u.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center"><Package className="text-gray-400" /></div>
                                    )}
                                    <div className="font-semibold">{u.name}</div>
                                </td>
                                <td className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{u.category || 'General'}</td>
                                <td className="p-4 font-medium">₹{u.pricePerDay} <span className="text-xs text-gray-400 font-normal">/ day</span></td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.availableQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {u.availableQuantity} left
                                        </span>
                                        {u.availableQuantity < 5 && u.availableQuantity > 0 && (
                                            <span className="text-[9px] font-black text-amber-600 uppercase animate-pulse">⚠️ Low Stock</span>
                                        )}
                                        {u.availableQuantity === 0 && (
                                            <span className="text-[9px] font-black text-red-600 uppercase animate-pulse">🚨 Out of Stock</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleEditUtensil(u)} 
                                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
                                            title="Edit Item"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUtensil(u._id)} 
                                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
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
