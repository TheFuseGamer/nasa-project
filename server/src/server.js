const http = require('http');

const app = require('./app');

const { connectDb } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function start() {
    await connectDb();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

start();