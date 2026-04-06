import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res) => {
    try {
        const { rating, comment, bookingId } = req.body;
        const feedback = new Feedback({
            user: req.user._id,
            rating,
            comment,
            booking: bookingId
        });
        const savedFeedback = await feedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'name mobile').populate('booking');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};

export const getFeedbackByUser = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ user: req.user._id });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user feedback', error: error.message });
    }
};

export const updateFeedbackStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback', error: error.message });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error: error.message });
    }
};
