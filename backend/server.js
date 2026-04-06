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

// __dirname setup (ES Module fix)
const __dirname = path.resolve();

// ✅ Production Setup (Frontend serve)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    // ✅ FIXED LINE (IMPORTANT)
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// ❌ 404 fallback (optional but best practice)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});