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

function getAllLaunches() {
    return Array.from(launches.values());
}

module.exports = {
    launches,
    getAllLaunches
};