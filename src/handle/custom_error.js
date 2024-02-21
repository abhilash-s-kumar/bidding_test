// customError.js
function CustomError(code, message, name) {
    this.code = code || 'GENERIC_ERROR';
    this.message = message || 'An error occurred';
    this.name = name || 'CustomError';
}

module.exports = CustomError;
