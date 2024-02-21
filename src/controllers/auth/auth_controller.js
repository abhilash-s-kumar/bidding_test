const { hashPassword, verifyPassword, isPasswordHashed } = require('../../helpers/auth_helpers/password_hasing')
const { isAlreadyRegistered } = require('../../helpers/auth_helpers/auth_helpers')
const CustomError = require('../../handle/custom_error')
const { generateToken } = require('../../helpers/auth_helpers/jwt_helper')
const { v4: uuidv4 } = require('uuid');
var customerModel = require('../../models/usersDB/customer')

const login = async (password, mobile, email) => {
    try {
        // Ensure customerModel is available
        customerModel = await customerModel;

        // Find user by phone or email
        const user = await customerModel.findOne({ $or: [{ mobile: mobile }, { email: email }] });

        // If user not found, or error occurs, throw an error
        if (!user) {
            console.log('Invalid password or Invalid email/phone', 'INVALID_PASSWORD');
            throw new CustomError(400, 'Invalid password or Invalid email/phone', 'INVALID_PASSWORD');
        }

        // Verify password
        if (verifyPassword(password, user.password)) {
            // Generate token
            const token = generateToken(user);
            return { user, token };
        } else {
            console.log('Invalid password', 'INVALID_PASSWORD');
            throw new CustomError(400, 'Invalid password', 'INVALID_PASSWORD');
        }
    } catch (error) {
        throw error;
    }
};


const register = (customerModelData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const alreadyRegistered = await isAlreadyRegistered(customerModelData);

            if (alreadyRegistered) {
                console.log("User already registered");
                resolve({ message: "User is already registered." });
                return;
            }

            customerModelData.password = hashPassword(customerModelData.password);
            customerModelData.created_at = Date.now();
            customerModelData.updated_at = Date.now();
            customerModelData.id = uuidv4();

            customerModel = await customerModel;
            const result = await customerModel.create(customerModelData);

            resolve({ result });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};


module.exports = {
    login,
    register
}