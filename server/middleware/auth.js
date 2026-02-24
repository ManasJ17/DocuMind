const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header first
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Fallback: check query param (for iframe/file requests that can't send headers)
        if (!token && req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-passwordHash');

        if (!req.user) {
            return res.status(401).json({ message: 'User not found, token may be invalid' });
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please login again' });
        }
        return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};

module.exports = auth;

