const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendOTP = require('../utils/emailService');


const enable2FA = async (req, res) => {
    const user = await User.findById(req.user._id);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.twoFactorCode = code;
    user.twoFactorExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    await sendOTP(user.email, code);

    res.json({ message: 'OTP sent to email. Verify to enable 2FA.' });
};

const verify2FA = async (req, res) => {
    const { code } = req.body;
    const user = await User.findById(req.user._id);

    if (user.twoFactorCode === code && user.twoFactorExpires > Date.now()) {
        user.is2FAEnabled = true;
        user.twoFactorCode = undefined;
        user.twoFactorExpires = undefined;
        await user.save();
        res.json({ message: '2FA Enabled Successfully' });
    } else {
        res.status(400).json({ message: 'Invalid or expired code' });
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            portfolio: user.portfolio,
            preferences: user.preferences,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.portfolio = req.body.portfolio || user.portfolio;
        user.preferences = req.body.preferences || user.preferences;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            bio: updatedUser.bio,
            portfolio: updatedUser.portfolio,
            preferences: updatedUser.preferences,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, enable2FA, verify2FA };