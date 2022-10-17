const http = require('http');
const app = require('./app.js');
// const mongoose = require('mongoose');
// we could set up environment variable in the terminal
// as 'set PORT=5000'

require('dotenv').config();
// this will populate our process.env OBJECT with the values in the environment variables.

const {mongoConnect} = require('./services/mongo');
const {loadPlanetData} = require('./models/planets.model');
const {loadLaunchData} = require('./models/launches.model');

const PORT = process.env.PORT || 8000;
// USERNAME: cabiamdos
// PASSWORD: IYl7qpQbXbDAIAUj
const MONGO_URL = process.env.MONGO_URL;

// we pass 'app' as a middleware.
// any middleware and routes that I pass to this 'app' object will respond to request comming in to our server. 
const server = http.createServer(app);

// mongoose.connection.once('open', () => {
//   console.log('MongoDB connection Ready');
// });
// mongoose.connection.on('error', (err) => {
//   console.error(err);
// });
async function startServer() {
  // await mongoose.connect('mongodb://localhost:27017/nasa', {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  //   // useFindAndModify: false,
  //   // useCreateIndex: true,
  // })

  
  await mongoConnect();
  console.log('server and mongo connected');
  await loadPlanetData();
  await loadLaunchData();
  
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
// we don't have to await this function because nothing happens after we await this server.
startServer();
// ....