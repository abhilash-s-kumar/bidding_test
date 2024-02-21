const mongoose = require('mongoose');
const moment = require('moment-timezone');
const { userDB } = require('../../db');

const createModel = async () => {
    const timeInKolkata = moment().tz("Asia/Kolkata").format();
    const Schema = mongoose.Schema;

    const customerModelSchema = new Schema({
        id: String,
        Name: String,
        address: String,
        status: String,
        mobile: String,
        email: String,
        profile_pic: String,
        reg_date: { type: Date, default: timeInKolkata },
    }, { collection: 'customer' });

    const userDBConnection = await userDB;
    return userDBConnection.model('customer', customerModelSchema);
};

module.exports = createModel();
