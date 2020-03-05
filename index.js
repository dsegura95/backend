const express = require('express');
const app = express();
const { config } = require('./config/index.js');
const reservACapi = require('./routes/reserva.js')

const {
    logErrors,
    wrapErrors,
    errorHandler
} = require('./middleware/errorHandler.js');

const notFoundHandler = require('./middleware/notFoundHandler');

const generator = require('./routes/generarSiguienteTrimestre.js');
const { setIntervalAsync } = require('set-interval-async/dynamic')

// setIntervalAsync(generator, 86400000)
setIntervalAsync(generator, 12000)

// const bodyParser = require('body-parser')
var path = require('path');
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// Body Parser middlewares

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// routes
reservACapi(app);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function () {
    (config.dev === 'development')
    ? console.log(`Listening in DEVELOPMENT http://localhost:${config.port}`)
    : console.log(`Listening http://localhost:${config.port}`)
});