import Booking from '../models/Booking.js';
import { sendBookingAlert } from '../utils/whatsappService.js';
import Utensil from '../models/Utensil.js';
import User from '../models/User.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const createBooking = async (req, res) => {
    const { items, startDate, endDate } = req.body;
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
        
        const totalPrice = items.reduce((acc, item) => {
            return acc + (item.pricePerDay * item.quantity * days);
        }, 0);

        const booking = new Booking({
            user: req.user._id,
            items,
            startDate,
            endDate,
            totalPrice
        });
        
        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createManualBooking = async (req, res) => {
    const { name, mobile, village, post, thana, district, items, startDate, endDate, paymentStatus, advance } = req.body;
    try {
        // Validation check
        if(!name || !mobile) {
            return res.status(400).json({ message: 'Name and Mobile are required' });
        }

        // 1. Find or Create User
        let user = await User.findOne({ mobile });
        if (!user) {
            user = new User({ 
                name, 
                mobile, 
                password: 'default_password' 
            });
            await user.save();
        }

        // 2. Pricing Logic
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
        
        const totalPrice = items.reduce((acc, item) => {
            return acc + (item.pricePerDay * item.quantity * days);
        }, 0);

        // 3. Create Booking
        const booking = new Booking({
            user: user._id,
            items,
            startDate,
            endDate,
            village: village || 'Local',
            post: post || '',
            thana: thana || '',
            district: district || 'Local',
            totalPrice,
            advance: advance || 0,
            status: 'Approved',
            paymentStatus: paymentStatus || 'Pending'
        });

        const createdBooking = await booking.save();
        
        // Return populated for receipt
        const populatedBooking = await Booking.findById(createdBooking._id).populate('user', 'name mobile');
        
        res.status(201).json(populatedBooking);
    } catch (error) {
        console.error('SERVER ERROR (Manual Booking):', error);
        res.status(500).json({ message: error.message || 'Server error creating manual booking' });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('items.utensil');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'name mobile').populate('items.utensil', 'name');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name mobile')
            .populate('items.utensil', 'name');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        booking.status = status;
        const updated = await booking.save();

        if (status === 'Approved') {
            await sendBookingAlert(updated, 'APPROVED');
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { paymentStatus } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.paymentStatus = paymentStatus;
            await booking.save();
            const populatedBooking = await Booking.findById(booking._id).populate('user', 'name mobile').populate('items.utensil', 'name');
            res.json(populatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPaymentOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const booking = await Booking.findById(bookingId);
            if(booking) {
                booking.paymentStatus = 'Completed';
                await booking.save();
            }
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateDeliveryStatus = async (req, res) => {
    const { deliveryStatus } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.deliveryStatus = deliveryStatus;
            await booking.save();
            const populatedBooking = await Booking.findById(booking._id).populate('user', 'name mobile').populate('items.utensil', 'name');
            res.json(populatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const reportDamage = async (req, res) => {
    const { damages, lostItems, notes } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.damages = damages;
            booking.lostItems = lostItems;
            booking.notes = notes;
            await booking.save();
            const populatedBooking = await Booking.findById(booking._id).populate('user', 'name mobile').populate('items.utensil', 'name');
            res.json(populatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
