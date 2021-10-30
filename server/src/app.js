const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:3000',
}));

// Logging Middleware
app.use(morgan('combined'));

// Body Parser Middleware
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/v1', api);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;