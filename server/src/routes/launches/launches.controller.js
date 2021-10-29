const { getAllLaunches, addLaunch, abortLaunch, existsLaunchWithId } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: 'Invalid launch date' });
    }
    addLaunch(launch);

    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    if (!launchId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({ error: 'Launch not found' });
    }

    const launch = abortLaunch(launchId);

    return res.status(200).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddLaunch,
    httpAbortLaunch
};