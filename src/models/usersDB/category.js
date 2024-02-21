const mongoose = require('mongoose');
const { userDB } = require('../../db');

const createModel = async () => {
    const Schema = mongoose.Schema;


    const CategorySchema = new Schema({
        uid: String,
        name: String,
        description: String,
        image: [String],
    }, { collection: 'category' });

    const userDBConnection = await userDB;
    return userDBConnection.model('category', CategorySchema);
};

module.exports = createModel();
