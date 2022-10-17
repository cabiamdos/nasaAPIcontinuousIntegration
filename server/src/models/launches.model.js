const axios = require('axios');

const launchesDatabases = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

// let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   flightNumber: 100, // flight_number
//   mission: 'Kepler Exploration X', // name
//   rocket: 'Explore IS1', // rocket.name
//   launchDate: new Date('December 27, 2030'), // date_local
//   target: 'Kepler-442 b', // not applicable
//   customers: ['ZTM', 'NASA'], // payload.customers for each payload
//   upcoming: true, // upcoming
//   success: true // success
// };

// saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
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
    console.log('Problem downloading launch data');
    throw new Error('launch data failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap((payload) => payload['customers']); 

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers: customers
    };

    console.log(`${launch.flightNumber}, ${launch.mission}`);

    // TODO:
    // populate launches collection
    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if (firstLaunch) {
    console.log('launch data alreaddy loaded');
    return;
  }
  await populateLaunches();
}

// MONGO DB:
// USERNAME: cabiamdos
// PASSWORD: IYl7qpQbXbDAIAUj

// launches.set(launch.flightNumber, launch);
// launches.get(100);

async function findLaunch(filter) {
  return await launchesDatabases.findOne(filter);
}

const existsLaunchWithId = async (launchId) => {
  // console.log(launches.has(+launchId));
  // return launches.has(+launchId);
  return await findLaunch({
    flightNumber: launchId
  });
}

const getLatestFlightNumber = async() => {
  // .sort() returns in ascending order
  const latestLaunch = await launchesDatabases
    .findOne()
    .sort('-flightNumber');
  
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

const getAllLaunches = async(skip, limit) => {
  // we could also pass an object {flightNumber: 1}
  return await launchesDatabases
    .find({}, '-_id -__v')
    .sort('flightNumber')
    .skip(skip)
    .limit(limit);
  // Array.from(launches.values())
};

async function saveLaunch(launch) {
  // const planet = await planets.findOne({
  //   keplerName: launch.target
  // });

  // if (!planet) {
  //   throw new Error('no matching planet found')
  // }

    // updateOne gives $setOnInsert: {__v: 0}
  await launchesDatabases.findOneAndUpdate({
    // if it finds an existing flightNumber it will
    flightNumber: launch.flightNumber,
  }, 
  launch, 
  {
    upsert: true
  });
}

const scheduleNewLaunch = async (launch) => {

  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('no matching planet found')
  }

  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zerto to Mastery', 'Nasa'],
    flightNumber: newFlightNumber
  });

  await saveLaunch(newLaunch);
}

// object.assign will return all the properties from the launch + the flightNumber we set.
// const addNewLaunch = (launch) => {
//   latestFlightNumber++;
//   launches.set(launch.flightNumber, Object.assign(launch, {
//     success: true,
//     upcoming: true,
//     customers: ['Zero To Mastery', 'Nasa'],
//     flightNumber: latestFlightNumber,
//   }));
// }

const abortLaunchById = async (launchId) => {
  // launch.delete(launchId);
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
  const aborted = await launchesDatabases.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false
  });

  console.log(aborted);
  // return aborted.ok === true && aborted.nModified === 1;
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  // addNewLaunch,
  scheduleNewLaunch,
  abortLaunchById,
}