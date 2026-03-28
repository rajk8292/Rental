import mongoose from 'mongoose';

const utensilSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    pricePerDay: { type: Number, required: true },
    availableQuantity: { type: Number, required: true },
    image: { type: String },
}, { timestamps: true });

export default mongoose.model('Utensil', utensilSchema);
