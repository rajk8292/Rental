import mongoose from 'mongoose';
import User from './models/User.js';

const MONGO_URI = 'mongodb+srv://kumarguptaraj825_db_user:MLbFHXfj6HolYli8@cluster0.8vvkdoh.mongodb.net/Rental?retryWrites=true&w=majority&appName=Cluster0';

const createAdmin = async () => {
    try {
        console.log('Connecting to:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const mobile = '1234567890';
        let user = await User.findOne({ mobile });
        
        if (user) {
            user.role = 'admin';
            user.password = 'adminpassword';
            await user.save();
            console.log('Existing user updated to Admin: 1234567890 / adminpassword');
        } else {
            await User.create({
                name: 'Dinesh Admin',
                mobile: mobile,
                password: 'adminpassword',
                role: 'admin'
            });
            console.log('Admin user created: 1234567890 / adminpassword');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error in script:', err);
        process.exit(1);
    }
};

createAdmin();
