import mongoose from 'mongoose';

const bookingItemSchema = new mongoose.Schema({
    utensil: { type: mongoose.Schema.Types.ObjectId, ref: 'Utensil', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true }
});

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [bookingItemSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    village: { type: String, default: 'Local' },
    post: { type: String },
    thana: { type: String },
    district: { type: String, default: 'Local' },
    totalPrice: { type: Number, required: true },
    advance: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    deliveryStatus: { 
        type: String, 
        enum: ['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Returned', 'Checked'],
        default: 'Confirmed'
    },
    damages: [{
        name: String,
        quantity: Number,
        cost: Number,
        description: String
    }],
    lostItems: [{
        name: String,
        quantity: Number,
        cost: Number
    }],
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
