const { getAllLaunches, addLaunch, abortLaunch, existsLaunchWithId } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: 'Invalid launch date' });
    }
    
    await addLaunch(launch);

    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    if (!launchId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const launchExists = await existsLaunchWithId(launchId);

    if (!launchExists) {
        return res.status(404).json({ error: 'Launch not found' });
    }

    const isAborted = await abortLaunch(launchId);

    if (!isAborted) {
        return res.status(400).json({ error: 'Failed to abort launch' });
    }

    return res.status(200).json( {
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddLaunch,
    httpAbortLaunch
};