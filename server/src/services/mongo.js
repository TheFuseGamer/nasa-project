const mongoose = require('mongoose');

const MONGO_CONNECTION_STRING = 'mongodb+srv://nasa-api:AC8S8Je9EYsJYqeS@nasa-cluster.9cow8.mongodb.net/nasa?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('Connected to mongo');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function connectDb() {
    await mongoose.connect(MONGO_CONNECTION_STRING);
}

module.exports = {
    connectDb
};