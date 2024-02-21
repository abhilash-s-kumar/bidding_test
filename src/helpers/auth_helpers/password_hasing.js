// A password hashing helper function

const passwordHash = require('password-hash');

// Hash password
const hashPassword = (password) => {
    return passwordHash.generate(password);
}

// Verify password
const verifyPassword = (password, hashedPassword) => {
    return passwordHash.verify(password, hashedPassword);
}

// Check if passowrd is already hashed
const isPasswordHashed = (password) => {
    return passwordHash.isHashed(password);
}

module.exports = {
    hashPassword,
    verifyPassword,
    isPasswordHashed,
}