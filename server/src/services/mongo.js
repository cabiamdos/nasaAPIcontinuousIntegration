
const mongoose = require('mongoose');

mongoose.connection.once('open', () => {
  console.log('MongoDB connection Ready');
});
mongoose.connection.on('error', (err) => {
  console.error(err);
});



async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_LOCALHOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
};