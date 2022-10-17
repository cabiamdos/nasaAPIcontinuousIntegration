const { parse } = require("csv-parse");
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

const habitablePlanet = [];

const isHabitablePlanet = planet => 
  planet['koi_disposition'] === 'CONFIRMED' 
  && planet['koi_insol'] > 0.36
  && planet['koi_insol'] < 1.11
  && planet['koi_prad'] < 1.6;

/*
const promise = new Promise((resolve, resject) => {
  resolve(42)
});
promise.then(result => {

});
const result = await promise
*/
const loadPlanetData = () => {
  return new Promise((resolve, reject) => {fs.createReadStream(path.join(__dirname,'../data','kepler_data.csv'), {
    encoding: 'utf-8'
  })
    .pipe(parse({
      comment: '#',
      columns: true
    }))
    .on('data', async(data) => {
      // results.push(data);
      // if (isHabitablePlanet(data)) habitablePlanet.push(data);
      if (isHabitablePlanet(data)) {
        // TODO: Replace below create with insert + update = upsert
        // insert + update = upsert
        savePlanet(data);
        // await planets.deleteMany({})
      };
    })
    .on('error', err => {
      console.log(err);
      reject(err);
    })
    .on('end', async() => {
      // console.log(habitablePlanet.map(p => p.kepler_name));
      // console.log(habitablePlanet.length);
      const countPlanetsFound = (await getAllPlanets()).length;
      console.log(countPlanetsFound);
      // console.log('done');
      resolve();
    })
  });
}

const getAllPlanets = async () => {
  // habitablePlanet
  // return await planets.find({
  //   keplerName: 'Kepler-62 f'
  // }, {
  //   'keplerName': 1
    // 'keplerName anotherField (without the object)'
  // });
  return await planets.find({},'-_id -__v')
};

const savePlanet = async (planet) => {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, { $set: {
      keplerName: planet.kepler_name
    }}, {
      upsert: true
    });
    // await planets.create({
    //   keplerName: planet.kepler_name
    // })
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }

}
module.exports = {
  loadPlanetData,
  getAllPlanets
};

