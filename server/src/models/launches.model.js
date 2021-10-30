const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 1;

const launch = {
    flightNumber: 1,
    mission: 'Kepler Exploration',
    rocket: 'OSF 1',
    launchDate: new Date('July 23, 2025'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'NOAA'],
    upcoming: true,
    success: true
}

saveLaunch(launch);

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launches.find({}, {
        '_id': 0,
        '__v': 0
    });
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('Target planet not found');
    }

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function addLaunch(launch) {
    const latestFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['NASA', 'SPACEX'],
        upcoming: true,
        success: true
    });
    await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
    return await launches.exists({
        flightNumber: launchId
    });
}

async function abortLaunch(launchId) {
    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    console.log(aborted);
    return aborted.modifiedCount === 1 && aborted.acknowledged === true;
}

module.exports = {
    launches,
    getAllLaunches,
    addLaunch,
    abortLaunch,
    existsLaunchWithId
};