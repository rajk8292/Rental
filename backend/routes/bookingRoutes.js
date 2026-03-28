import express from 'express';
import { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    updateBookingStatus, 
    updatePaymentStatus,
    updateDeliveryStatus,
    reportDamage,
    createPaymentOrder, 
    verifyPayment,
    createManualBooking 
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/ping', (req, res) => res.send('Booking API Alive'));

// Public/Protected Routes
router.post('/payment/order', protect, createPaymentOrder);
router.post('/payment/verify', protect, verifyPayment);
router.get('/mybookings', protect, getMyBookings);
router.post('/', protect, createBooking);

// Admin Routes
router.get('/', protect, admin, getAllBookings);
router.post('/manual', protect, admin, createManualBooking);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.put('/:id/payment-status', protect, admin, updatePaymentStatus);
router.put('/:id/delivery-status', protect, admin, updateDeliveryStatus);
router.put('/:id/report-damage', protect, admin, reportDamage);

export default router;
