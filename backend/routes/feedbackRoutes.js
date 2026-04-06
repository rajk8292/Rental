import express from 'express';
import { createFeedback, getAllFeedback, getFeedbackByUser, updateFeedbackStatus, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createFeedback)
    .get(protect, admin, getAllFeedback);

router.get('/user', protect, getFeedbackByUser);

router.route('/:id')
    .put(protect, admin, updateFeedbackStatus)
    .delete(protect, admin, deleteFeedback);

export default router;
