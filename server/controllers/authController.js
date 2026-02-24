const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─── Email transporter ───
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'This email is already registered. Please login instead.' });
        }

        const user = await User.create({
            username,
            email,
            passwordHash: password,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'Account not found. Please register first.',
                code: 'USER_NOT_FOUND',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Incorrect password. Please enter correct credentials.',
                code: 'WRONG_PASSWORD',
            });
        }

        const token = generateToken(user._id);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            createdAt: req.user.createdAt,
        },
    });
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.passwordHash = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────
// PASSWORD RESET FLOW
// ─────────────────────────────────────────────

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address.' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Hash OTP before storing (secure)
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        user.resetOtp = hashedOtp;
        user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        // Send email
        const mailOptions = {
            from: `"DocuMind" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'DocuMind — Password Reset Code',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0F172A; border-radius: 16px;">
                    <h1 style="color: #F8FAFC; text-align: center; margin-bottom: 8px;">DocuMind</h1>
                    <p style="color: #94A3B8; text-align: center; font-size: 14px; margin-bottom: 24px;">Password Reset Verification</p>
                    <div style="background: #1E293B; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <p style="color: #94A3B8; font-size: 13px; margin-bottom: 16px;">Your verification code is:</p>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #F8FAFC; background: #1F2937; border-radius: 8px; padding: 16px; display: inline-block;">${otp}</div>
                    </div>
                    <p style="color: #64748B; font-size: 12px; text-align: center;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Verification code sent to your email.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        next(error);
    }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetOtp: hashedOtp,
            resetOtpExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        // Generate a one-time reset token (so user can't reuse OTP)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Reuse resetOtp field to store the token, keep expiry
        user.resetOtp = hashedToken;
        await user.save();

        res.json({ message: 'OTP verified successfully.', resetToken });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await User.findOne({
            email,
            resetOtp: hashedToken,
            resetOtpExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token. Please restart the process.' });
        }

        // Update password and clear reset fields
        user.passwordHash = newPassword;
        user.resetOtp = null;
        user.resetOtpExpires = null;
        await user.save();

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        next(error);
    }
};
