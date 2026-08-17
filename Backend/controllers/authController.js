const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const genarateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

const clearExpiredOtps = async () => {
    const result = await User.updateMany(
        {
            otp: { $ne: null },
            otpExpires: { $ne: null, $lte: new Date() },
        },
        {
            $set: {
                otp: null,
                otpExpires: null,
            },
        }
    );

    return result.modifiedCount || 0;
};

const sendOTPEmail = async (user) => {
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    user.verified = false;
    user.varified = false;
    await user.save();

    const message = `Hi ${user.name}, Your OTP is ${otp}. Please use this to verify your account.`;
    await sendEmail(user.email, message);
    return otp;
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser && (existingUser.verified || existingUser.varified)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUser) {
            existingUser.name = name;
            existingUser.password = hashedPassword;
            await sendOTPEmail(existingUser);

            return res.status(200).json({
                message: 'OTP resent to your email. Please verify your account.',
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                },
            });
        }

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            verified: false,
            varified: false,
        });

        const otp = await sendOTPEmail(newUser);

        return res.status(201).json({
            message: 'OTP sent to your email. Please verify your account.',
            otp,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires && user.otpExpires < Date.now()) {
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        user.verified = true;
        user.varified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return res.status(200).json({
            message: 'Account verified successfully. You can now login.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified || user.varified) {
            return res.status(400).json({ message: 'This account is already verified.' });
        }

        const otp = await sendOTPEmail(user);

        return res.status(200).json({
            message: 'New OTP sent to your email.',
            otp,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!(user.verified || user.varified)) {
            return res.status(403).json({ message: 'Please verify your account with OTP before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.otp || user.otpExpires) {
            user.otp = null;
            user.otpExpires = null;
            await user.save();
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: genarateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const user = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, verifyOTP, resendOTP, loginUser, user, clearExpiredOtps };
