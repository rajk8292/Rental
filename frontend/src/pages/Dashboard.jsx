import { useState, useEffect } from 'react';
import axios from '../api/axios';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [utensils, setUtensils] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newUtensil, setNewUtensil] = useState({
        name: '', description: '', pricePerDay: '', availableQuantity: '', image: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, utensilsRes] = await Promise.all([
                    axios.get('/bookings'),
                    axios.get('/utensils')
                ]);
                setBookings(bookingsRes.data);
                setUtensils(utensilsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const [uploading, setUploading] = useState(false);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
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

    // Replace the specific submit logic with a corrected robust array updater:
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/utensils', newUtensil);
            setUtensils([...utensils, data]);
            setNewUtensil({ name: '', description: '', pricePerDay: '', availableQuantity: '', image: '' });
            alert('Utensil created successfully');
        } catch (error) {
            alert('Failed to create utensil');
        }
    };

    const handleDeleteUtensil = async (id) => {
        if(window.confirm('Are you sure?')) {
            try {
                await axios.delete(`/utensils/${id}`);
                setUtensils(utensils.filter(u => u._id !== id));
            } catch (error) {
                alert('Failed to delete utensil');
            }
        }
    };

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div></div>;

    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'Completed' ? sum + b.totalPrice : sum, 0);

    return (
        <div className="max-w-7xl mx-auto py-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h2>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 font-medium mb-2">Total Bookings</h3>
                    <p className="text-4xl font-bold text-indigo-700">{bookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
                    <p className="text-4xl font-bold text-green-600">₹{totalRevenue}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 font-medium mb-2">Inventory Items</h3>
                    <p className="text-4xl font-bold text-orange-500">{utensils.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Bookings Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm">
                                        <th className="p-4 border-b">User</th>
                                        <th className="p-4 border-b">Utensil</th>
                                        <th className="p-4 border-b">Dates</th>
                                        <th className="p-4 border-b">Amount</th>
                                        <th className="p-4 border-b">Status</th>
                                        <th className="p-4 border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking._id} className="hover:bg-gray-50">
                                            <td className="p-4 border-b">
                                                <div className="font-medium text-sm text-gray-900">{booking.user?.name}</div>
                                                <div className="text-xs text-gray-500">{booking.user?.mobile}</div>
                                            </td>
                                            <td className="p-4 border-b text-sm text-gray-700">{booking.utensil?.name} ({booking.quantity})</td>
                                            <td className="p-4 border-b">
                                                <div className="text-xs text-gray-600">{new Date(booking.startDate).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-600">{new Date(booking.endDate).toLocaleDateString()}</div>
                                            </td>
                                            <td className="p-4 border-b text-sm font-semibold text-gray-800">₹{booking.totalPrice}</td>
                                            <td className="p-4 border-b">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                                                    booking.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b">
                                                <select 
                                                    value={booking.status} 
                                                    onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approve</option>
                                                    <option value="Rejected">Reject</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Add Utensil */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Utensil</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.name} onChange={e => setNewUtensil({...newUtensil, name: e.target.value})} />
                            <textarea placeholder="Description" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.description} onChange={e => setNewUtensil({...newUtensil, description: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Price/Day" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.pricePerDay} onChange={e => setNewUtensil({...newUtensil, pricePerDay: e.target.value})} />
                                <input type="number" placeholder="Qty" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={newUtensil.availableQuantity} onChange={e => setNewUtensil({...newUtensil, availableQuantity: e.target.value})} />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                                <input 
                                    type="file" 
                                    onChange={uploadFileHandler}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {uploading && <p className="text-xs text-indigo-500 animate-pulse">Uploading Image...</p>}
                                <input 
                                    type="text" 
                                    placeholder="Or paste an Image URL" 
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm mt-2" 
                                    value={newUtensil.image} 
                                    onChange={e => setNewUtensil({...newUtensil, image: e.target.value})} 
                                />
                            </div>

                            <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white font-semibold flex justify-center py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:bg-indigo-400">
                                Add Utensil
                            </button>
                        </form>
                    </div>

                    {/* Manage Utensils List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-h-96 overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Inventory List</h3>
                        <div className="space-y-3">
                            {utensils.map(u => (
                                <div key={u._id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        {u.image && <img src={u.image} alt={u.name} className="w-10 h-10 object-cover rounded" />}
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">{u.name}</p>
                                            <p className="text-xs text-gray-500">₹{u.pricePerDay}/day | Qty: {u.availableQuantity}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteUtensil(u._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
