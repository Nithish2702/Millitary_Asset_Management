const jwt = require('jsonwebtoken');
const User = require('../models/User');

const logger = async (req, res, next) => {
    const timestamp = new Date().toISOString();
    let username = 'Anonymous';
    
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                username = user.username;
            }
        }
    } catch (error) {
        // Token invalid or expired, keep as Anonymous
    }
    
    console.log(`[${timestamp}] ${req.method} ${req.path} - User: ${username}`);
    next();
};

module.exports = logger;
