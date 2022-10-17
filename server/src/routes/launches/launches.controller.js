const {getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById, scheduleNewLaunch} = require('../../models/launches.model');

const {
  getPagination
} = require('./../../services/query');

const httpGetAllLaunches = async (req, res) => {
  console.log(req.query);
  const {skip, limit} = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches);
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) return res.status(400).json({
    error: 'Missing required launch property',
  });

  // launch.launchDate.toString() === 'Invalid Date' || 
  // if (isNaN(launch.launchDate)) return res.status(400).json({
  //   error: 'Invalid launch date'
  // })
  launch.launchDate = new Date(launch.launchDate);
  
  // addNewLaunch(launch);
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}
const httpAbortLaunch = async (req, res) => {
  const launchId = +req.params.id;

  // if launch doesn't exist
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch not found'
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) return res.status(400).json({
    error: 'Launch not aborted'
  });
  // if launch does exists
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}