import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Utensil from './models/Utensil.js';

dotenv.config();

const utensils = [
    { name: 'Dek (डेक)', description: 'बड़े पैमाने पर पकाने के लिए बड़ा पतीला (Large cooking pot)', pricePerDay: 50, availableQuantity: 20, category: 'Cooking' },
    { name: 'Kadahi (कड़ाही)', description: 'तलने और ग्रेवी बनाने के लिए मजबूत कड़ाही (Deep frying pan)', pricePerDay: 40, availableQuantity: 15, category: 'Cooking' },
    { name: 'Kathvat (कठवत)', description: 'आटा गूंधने के लिए बड़ा बर्तन (Large kneading bowl)', pricePerDay: 30, availableQuantity: 10, category: 'Extra' },
    { name: 'Gamla (गमला)', description: 'सामान रखने या सजाने के लिए (Serving or storage bowl)', pricePerDay: 25, availableQuantity: 25, category: 'Utility' },
    { name: 'Balti (बाल्टी)', description: 'पानी या दाल परोसने के लिए (Heavy duty bucket)', pricePerDay: 15, availableQuantity: 50, category: 'Utility' },
    { name: 'Kalchul (कलछुल)', description: 'परोसने वाला बड़ा चमचा (Serving ladle)', pricePerDay: 10, availableQuantity: 40, category: 'Utility' },
    { name: 'Jag (जग)', description: 'पानी परोसने के लिए जग (Standard service jug)', pricePerDay: 10, availableQuantity: 50, category: 'Serving' },
    { name: 'Nad (नाद)', description: 'पशुओं या बड़े काम के लिए बड़ा पात्र (External large tub)', pricePerDay: 60, availableQuantity: 5, category: 'Extra' },
    { name: 'Drum (ड्राम)', description: 'पानी या अनाज भंडारण के लिए (Storage drum)', pricePerDay: 100, availableQuantity: 10, category: 'Extra' },
    { name: 'Tray (ट्रे)', description: 'नाश्ता या पानी परोसने के लिए (Standard serving tray)', pricePerDay: 15, availableQuantity: 30, category: 'Serving' },
    { name: 'Panja (पंजा)', description: 'सफाई या विशेष उपयोग के लिए (Utility panja)', pricePerDay: 10, availableQuantity: 40, category: 'Utility' },
    { name: 'Chulha (चूल्हा)', description: 'भारी खाना पकाने के लिए भट्टी (Heavy-duty stove/hearth)', pricePerDay: 150, availableQuantity: 5, category: 'Cooking' },
    { name: 'Chhanota (छनोटा)', description: 'तलने वाली छननी (Perforated ladle/skimmer)', pricePerDay: 10, availableQuantity: 40, category: 'Cooking' },
    { name: 'Palta (पलटा)', description: 'समतल कलछुल (Flat turner/spatula)', pricePerDay: 10, availableQuantity: 40, category: 'Cooking' },
    { name: 'Pankha (पंखा)', description: 'बड़ी सभाओं के लिए कूलर/पंखा (Large event fan)', pricePerDay: 200, availableQuantity: 5, category: 'Utility' },
    { name: 'Tawa (तावा)', description: 'रोटी बनाने के लिए बड़ा तवा (Commercial flat griddle)', pricePerDay: 20, availableQuantity: 20, category: 'Cooking' },
    { name: 'Buffet Set (बफर सेट)', description: 'विपुल भोज के लिए पूरा सर्विंग सेट (Full buffet catering set)', pricePerDay: 500, availableQuantity: 2, category: 'Serving' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check for duplicates before insertion (optional but recommended)
        for (const item of utensils) {
            const exists = await Utensil.findOne({ name: item.name });
            if (!exists) {
                await Utensil.create(item);
                console.log(`Added: ${item.name}`);
            } else {
                console.log(`Skipped (already exists): ${item.name}`);
            }
        }

        console.log('Database seeding complete');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
