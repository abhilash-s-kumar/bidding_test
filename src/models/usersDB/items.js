const mongoose = require('mongoose');
const { userDB } = require('../../db');

const createModel = async () => {
    const Schema = mongoose.Schema;

    const BiddingHistorySchema = new Schema({
        id: String,
        status: String,
        amount: Number,
        time: Date,
        user_id: String
    });

    const ItemsSchema = new Schema({
        uid: String,
        name: String,
        description: String,
        category: String,
        owner_id: String,
        current_status: { type: String, default: 'onSale' },
        bidding_history: [BiddingHistorySchema],
        image: [String],
        price: Number,
        added_date: Date,
        start_date: Date,
        deadline: Date,
    }, { collection: 'items' });

    const userDBConnection = await userDB;
    return userDBConnection.model('items', ItemsSchema);
};

module.exports = createModel();
