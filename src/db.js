const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async (databaseURI) => {
  try {
    const connection = await mongoose.createConnection(databaseURI);
    console.log('Connected to database...');
    return connection;
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

const userDB = connectToDatabase(process.env.USER_DB_URI);
const auctionDB = connectToDatabase(process.env.AUCTION_DB_URI);

module.exports = { userDB, auctionDB };