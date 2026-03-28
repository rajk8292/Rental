import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
    const { name, mobile, password } = req.body;
    try {
        const userExists = await User.findOne({ mobile });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const role = name.toLowerCase().includes('admin') ? 'admin' : 'user';
        const user = await User.create({ name, mobile, password, role });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const authUser = async (req, res) => {
    const { mobile, password } = req.body;
    try {
        const user = await User.findOne({ mobile });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid mobile or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const findUserByMobile = async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.params.mobile }).select('name mobile');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
