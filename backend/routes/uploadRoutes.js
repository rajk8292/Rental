import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(500).json({ message: 'Cloudinary config missing' });
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Use stream to upload buffer directly
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'bartan-rental' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                stream.end(req.file.buffer);
            });
        };

        const result = await streamUpload(req);
        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload Error', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

export default router;
