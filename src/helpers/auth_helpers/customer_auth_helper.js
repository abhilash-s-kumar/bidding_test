const customerModel = require('../../models/usersDB/customer')

const isAlreadyRegistered = async (customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (customer.mobile == undefined) {
                resolve(false);
            } else {
                const result = await customerModel.findOne({ mobile: customer.mobile });
                if (result) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }

        } catch (error) {
            reject(false);
        }
    });
}




module.exports = {
    isAlreadyRegistered
}