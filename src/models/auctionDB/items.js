const mongoose = require('mongoose');

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
    owner_id: String,
    current_status: String,
    bidding_history: [BiddingHistorySchema],
    image: [String],
    price: Number,
    deadline: Date,
}, { collection: 'items' });

module.exports = mongoose.model('items', ItemsSchema);
