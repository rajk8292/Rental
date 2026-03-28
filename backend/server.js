import express from 'express';
import dotenv from 'dotenv'; // Server restart trigger
import cors from 'cors';
import path from 'path';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import utensilRoutes from './routes/utensilRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/utensils', utensilRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
