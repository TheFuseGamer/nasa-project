const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

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
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;