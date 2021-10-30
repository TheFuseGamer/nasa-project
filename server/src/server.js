const http = require('http');

const mongoose = require('mongoose');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model')

const PORT = process.env.PORT || 8000;

const MONGO_CONNECTION_STRING = 'mongodb+srv://nasa-api:AC8S8Je9EYsJYqeS@nasa-cluster.9cow8.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('Connected to mongo');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function start() {
    await mongoose.connect(MONGO_CONNECTION_STRING);
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

start();