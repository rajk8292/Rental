import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Star, MessageSquare, User, Calendar, Trash2, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const { data } = await axios.get('/feedback');
            setFeedbacks(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch feedback', err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/feedback/${id}`, { status });
            fetchFeedback();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await axios.delete(`/feedback/${id}`);
                fetchFeedback();
            } catch (err) {
                alert('Failed to delete feedback');
            }
        }
    };

    const filteredFeedback = feedbacks.filter(f => {
        const matchesSearch = f.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             f.comment?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 'all' || f.rating === parseInt(filterRating);
        return matchesSearch && matchesRating;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">User Feedback</h2>
                    <p className="text-slate-500 font-bold text-sm mt-1">Manage and respond to customer reviews</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search feedback..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-bold text-sm w-64"
                        />
                    </div>
                    
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="pl-12 pr-8 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-200 flex items-center justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2">Total Reviews</p>
                        <h4 className="text-4xl font-black italic">{feedbacks.length}</h4>
                    </div>
                    <MessageSquare size={64} className="text-blue-500/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl shadow-slate-200 flex items-center justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Average Rating</p>
                        <h4 className="text-4xl font-black italic">
                            {feedbacks.length > 0 
                                ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
                                : '0.0'}
                        </h4>
                    </div>
                    <Star size={64} className="text-slate-800 absolute -right-4 -bottom-4 group-hover:rotate-12 transition-transform" />
                </div>

                <div className="bg-amber-400 p-8 rounded-[32px] text-amber-950 shadow-xl shadow-amber-100 flex items-center justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-amber-800/60 text-[10px] font-black uppercase tracking-widest mb-2">Pending Approval</p>
                        <h4 className="text-4xl font-black italic">
                            {feedbacks.filter(f => f.status === 'pending').length}
                        </h4>
                    </div>
                    <CheckCircle size={64} className="text-amber-500/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
                </div>
            </div>

            {/* Feedback Table / List */}
            <div className="grid gap-6">
                {filteredFeedback.length === 0 ? (
                    <div className="bg-white p-20 rounded-[32px] text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold">No feedback found matching your criteria.</p>
                    </div>
                ) : (
                    filteredFeedback.map((feedback) => (
                        <div key={feedback._id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 hover:border-blue-100 hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Side: User & Meta */}
                                <div className="md:w-64 space-y-4 border-r border-slate-100 pr-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-lg font-black italic">
                                            {feedback.user?.name?.charAt(0) || <User size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 leading-tight truncate w-32">{feedback.user?.name || 'Unknown User'}</h4>
                                            <p className="text-xs font-bold text-slate-400">{feedback.user?.mobile}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Calendar size={12} /> {new Date(feedback.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-md w-fit">
                                            Order ID: {feedback.booking?._id?.slice(-6) || 'Manual'}
                                        </div>
                                    </div>

                                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${
                                        feedback.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        feedback.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {feedback.status}
                                    </div>
                                </div>

                                {/* Right Side: Content & Actions */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                size={18} 
                                                className={star <= feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                                            />
                                        ))}
                                    </div>
                                    
                                    <p className="text-slate-700 font-bold text-lg leading-relaxed italic">
                                        "{feedback.comment}"
                                    </p>

                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {feedback.status !== 'approved' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(feedback._id, 'approved')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                            )}
                                            {feedback.status !== 'rejected' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(feedback._id, 'rejected')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDelete(feedback._id)}
                                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-100 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
