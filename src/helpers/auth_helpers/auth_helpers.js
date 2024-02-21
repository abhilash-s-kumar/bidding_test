var customerModel = require('../../models/usersDB/customer')
const isAlreadyRegistered = async (customerModelData) => {
    return new Promise(async (resolve, reject) => {
        customerModel = await customerModel;
        try {
            if (customerModelData.id == undefined) {
                resolve(false);
            } else {
                const result = await customerModel.findOne({ id: customerModelData.id });
                if (result) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }

        } catch (error) {
            console.log(error);
            reject(false);
        }
    });
}

module.exports = {
    isAlreadyRegistered
}