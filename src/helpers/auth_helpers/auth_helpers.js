const customerModel = require('../../models/usersDB/customer')

const isAlreadyRegistered = async (customerModelData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (customerModelData.uid == undefined) {
                resolve(false);
            } else {
                const result = await customerModel.findOne({ uid: customerModelData.uid });
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