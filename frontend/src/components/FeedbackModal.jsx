import { useState } from 'react';
import axios from '../api/axios';
import { Star, X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const FeedbackModal = ({ booking, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/feedback', {
                rating,
                comment,
                bookingId: booking?._id
            });
            setSubmitted(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                <div className="bg-white rounded-[32px] w-full max-w-md p-10 text-center animate-in zoom-in duration-300 shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-500 font-bold">Your feedback helps us improve our service.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 leading-none">Your Feedback</h3>
                        <p className="text-gray-500 mt-2 font-bold text-sm">How was your experience with Order #{booking?._id?.slice(-6)}?</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition text-gray-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Rating Stars */}
                    <div className="text-center">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Rate your experience</p>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="transition-all duration-200 transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        size={48}
                                        className={`transition-colors duration-200 ${
                                            star <= (hover || rating)
                                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                                : 'text-gray-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-indigo-600 font-black text-sm uppercase tracking-tighter">
                            {rating === 1 && 'Poor 😞'}
                            {rating === 2 && 'Fair 😐'}
                            {rating === 3 && 'Good 🙂'}
                            {rating === 4 && 'Very Good 😃'}
                            {rating === 5 && 'Excellent! 😍'}
                        </p>
                    </div>

                    {/* Comment Area */}
                    <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Tell us more</label>
                        <div className="relative">
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like or what can we improve?"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pt-4 min-h-[120px] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-800 outline-none resize-none"
                            ></textarea>
                            <MessageSquare size={20} className="absolute right-4 top-4 text-gray-300" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-base hover:bg-indigo-700 transition flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send size={20} /> SUBMIT FEEDBACK
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
