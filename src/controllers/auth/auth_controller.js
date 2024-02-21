const { hashPassword, verifyPassword, isPasswordHashed } = require('../../helpers/auth_helpers/password_hasing')
const { isAlreadyRegistered } = require('../../helpers/auth_helpers/auth_helpers')
const CustomError = require('../../handle/custom_error')
const { generateToken } = require('../../helpers/auth_helpers/jwt_helper')
const { v4: uuidv4 } = require('uuid');


const login = async (password, phone, email) => {
    return new Promise(async (resolve, reject) => {
        // Find the user with the phone number
        console.log("password = " + password);
        console.log("phone = " + phone);
        console.log("email = " + email);
        staffModel.findOne({ $or: [{ phone: phone }, { email: email }] }, (err, user) => {
            if (err || !user) {
                console.log(user);
                console.log('Invalid password or Invalid email', 'INVALID_PASSWORD');
                reject(new CustomError(400, 'Invalid password or Invalid email', 'INVALID_PASSWORD'));
            } else {
                // Check if the password is correct
                if (verifyPassword(password, user.password)) {
                    // Generate JWT token and send it back.
                    const token = generateToken(user);
                    resolve({ user, token });
                } else {
                    console.log('Invalid password', 'INVALID_PASSWORD');
                    reject(new CustomError(400, 'Invalid password', 'INVALID_PASSWORD'));
                }
            }
        })
    });
}

const register = (staffModelData) => {
    return new Promise(async (resolve, reject) => {
        if (await isAlreadyRegistered(staffModelData)) {

            // Means update the user
            // use id.
            staffModelData.updated_at = Date.now();
            // Check if the password is changed.
            if (isPasswordHashed(staffModelData.password) == false) {
                staffModelData.password = hashPassword(staffModelData.password);
            } else {
                delete staffModelData.password;
            }
            try {
                const result = await staffModel.updateOne({ uid: staffModelData.uid }, staffModelData);
                //* Generate JWT token and send it back.
                resolve({ result });
            } catch (error) {
                reject(error);
            }
        } else {
            staffModelData.password = hashPassword(staffModelData.password);
            staffModelData.created_at = Date.now();
            staffModelData.updated_at = Date.now();
            staffModelData.uid = uuidv4();
            try {
                const result = await staffModel.create(staffModelData);
                //* Generate JWT token and send it back.
                resolve({ result });
            } catch (error) {
                reject(error);
            }
        }
    });
}

// Get all staffs under a franchise (brid)
const getStaffs = async (query) => {
    return new Promise(async (resolve, reject) => {
        staffModel.find(query, (err, staffs) => {
            if (err) {
                reject(new CustomError(400, 'Error while fetching staffs', 'ERROR_FETCHING_STAFFS'));
            } else {
                resolve(staffs);
            }
        });
    });
}

// Delete a staff with id
const deleteStaff = async (uid) => {
    return new Promise(async (resolve, reject) => {
        staffModel.deleteOne({ "uid": uid }, (err, staff) => {
            if (err) {
                reject(new CustomError(400, 'Error while deleting staff', 'ERROR_DELETING_STAFF'));
            } else {
                resolve(staff);
            }
        });
    });

}


module.exports = {
    login,
    register,
    getStaffs,
    deleteStaff
}