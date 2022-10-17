const API_URL = 'http://localhost:8000/v1'

// Load planets and reutrn as JSON.
async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const res = await fetch(`${API_URL}/planets`);
  const data = await res.json();
  console.log(data);
  return data
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(launch),
    })
  } catch(err) {
    return {
      ok: false
    }
  }

}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};