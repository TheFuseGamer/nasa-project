const mongoose = require('mongoose');

const MONGO_CONNECTION_STRING = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('Connected to mongo');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function connectDb() {
    await mongoose.connect(MONGO_CONNECTION_STRING);
}

async function disconnectDb() {
    await mongoose.connection.close();
    await mongoose.disconnect();
}

module.exports = {
    connectDb,
    disconnectDb
};