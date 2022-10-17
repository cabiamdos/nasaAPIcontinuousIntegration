const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();
// SECURITY MIDDLEWARE  
app.use(cors({
  origin: 'http://localhost:3000'
}));
// cors modifies the 'Access-Control-Allow-Origin: http://localhost:3000'
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);
// app.use('/v1', v2Router);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;


// whitelisting is the practice of explicitly allowing access to a particular privilege or service. It is the opposite of blacklisting.

// diapositiva 10 teoria