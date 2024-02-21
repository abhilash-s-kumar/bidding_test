const jwt = require('jsonwebtoken');
const CustomError = require('../../handle/custom_error');

const generateToken = (customerModelData) => {
    return jwt.sign({ customerModelData }, process.env.JWT_SECRET_KEY, { expiresIn: '1d', algorithm: 'HS256' });
}


// Middleware for verifying token
// Middleware to check for a valid JWT on protected routes
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log("token = " + token);
    if (!token) {
        // Custom error handler
        console.log("Access denied. No token provided.");
        return next(new CustomError(401, 'Access denied. No token provided.', 'ACCESS_DENIED'));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            // Custom error handler
            return next(new CustomError(401, 'Access denied. Invalid token provided.', 'ACCESS_DENIED'));
        }
        req.user = user;
        next();
    });
};


module.exports = {
    generateToken,
    authenticateToken
}