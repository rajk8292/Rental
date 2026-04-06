import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import utensilRoutes from './routes/utensilRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

// Connect Database
await connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/utensils', utensilRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/feedback', feedbackRoutes);

// __dirname fix for ES Modules
const __dirname = path.resolve();

// ✅ Production (Frontend serve)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

    // ✅ FINAL FIX (NO * , NO /*)
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// ✅ Optional 404 API handler (best practice)
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
