import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Utensil from './models/Utensil.js';

dotenv.config();

const categorization = {
    'Cooking': ['Dek (डेक)', 'Kadahi (कड़ाही)', 'Chulha (चूल्हा)', 'Tawa (तावा)'],
    'Serving': ['Kalchul (कलछुल)', 'Jag (जग)', 'Tray (ट्रे)', 'Panja (पंजा)', 'Chhanota (छनोटा)', 'Palta (पलटा)', 'Buffet Set (बफर सेट)'],
    'Utility': ['Kathvat (कठवत)', 'Gamla (गमला)', 'Balti (बाल्टी)', 'Nad (नाद)', 'Drum (ड्राम)'],
    'Extra': ['Pankha (पंखा)']
};

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        for (const [cat, items] of Object.entries(categorization)) {
             const res = await Utensil.updateMany({ name: { $in: items } }, { category: cat });
             console.log(`${cat}: ${res.modifiedCount} updated`);
        }
        
        // Also update any others to 'Other'
        const resOther = await Utensil.updateMany({ category: { $exists: false } }, { category: 'Other' });
        console.log(`Others: ${resOther.modifiedCount} updated`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
