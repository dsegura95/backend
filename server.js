// Init Server http
const express = require('express');
const app = express();

//////////////////////////////////////////////////////////
//                  CONFIGURATIONS
//////////////////////////////////////////////////////////

const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./middleware/errorHandler.js');
const notFoundHandler = require('./middleware/notFoundHandler');

//////////////////////////////////////////////////////////
//                  CRONJOBS
//////////////////////////////////////////////////////////

const generator = require('./scripts/generarSiguienteTrimestre.js');
const { setIntervalAsync } = require('set-interval-async/dynamic');
setIntervalAsync(generator, 350000);

//////////////////////////////////////////////////////////
//                  MIDDLEWARES
//////////////////////////////////////////////////////////

app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//////////////////////////////////////////////////////////
//                      ROUTES
//////////////////////////////////////////////////////////

const reservACapi = require('./routes/main.routes.js');
reservACapi(app);

//////////////////////////////////////////////////////////
//                  ERROR HANDLERS
//////////////////////////////////////////////////////////

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');
  next();
});

module.exports = app