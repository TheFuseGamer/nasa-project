const launches = new Map();

const launch = {
    flightNumber: 0,
    mission: 'Kepler Exploration',
    rocket: 'OSF 1',
    launchDate: new Date('July 23, 2025'),
    target: 'Kepler-442 b',
    customer: ['NASA', 'NOAA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch);

let latestFlightNumber = launch.flightNumber;

function getAllLaunches() {
    return Array.from(launches.values());
}

function addLaunch(launch) {
    launches.set(++latestFlightNumber, Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customer: ['NASA', 'SPACEX'],
        upcoming: true,
        success: true
    }));
}

module.exports = {
    launches,
    getAllLaunches,
    addLaunch
};