const axios = require('axios');

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
};

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
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function addLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('Target planet not found');
    }

    const latestFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['NASA', 'SPACEX'],
        upcoming: true,
        success: true
    });
    await saveLaunch(newLaunch);
}


async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
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

const SAPCEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    console.log('Downloading launch data');
    const response = await axios.post(SAPCEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) { 
        console.log("Error downloading SapceX launch data.");
        throw new Error('Loading SpaceX launch data failed.');
    }

    for (const launch of response.data.docs) {
        const mongoLaunch = {
            flightNumber: launch.flight_number,
            mission: launch.name,
            rocket: launch.rocket.name,
            launchDate: launch.date_local,
            upcoming: launch.upcoming,
            success: launch.success,
            customers: launch.payloads.map(payload => payload.customers).reduce((acc, customers) => acc.concat(customers), [])
        }
        console.log(`${mongoLaunch.flightNumber}: ${mongoLaunch.mission}`);
        await saveLaunch(mongoLaunch);
    }
}

async function loadLaunchesData() {
    const spaceXLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (spaceXLaunch) {
        console.log('Launch data already loaded!');
        return;
    }

    await populateLaunches();
}

module.exports = {
    launches,
    getAllLaunches,
    addLaunch,
    abortLaunch,
    existsLaunchWithId,
    loadLaunchesData
};