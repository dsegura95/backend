const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const options = require('../swagger/swaggerDef');
const swaggerSpec = swaggerJSDoc(options);

/* Routes */
const trimesterRoutes = require('./trimester.routes');
const itemRoutes = require('./items.routes');
const roomRoutes = require('./rooms.routes');
const reservationRoutes = require('./reservations.routes');
const reservationRequestRoutes = require('./reservationRequest.routes');
const roomRequestRoutes = require('./roomRequest.routes');
const userRoutes = require('./user.routes');
const subjectRoutes = require('./subjects.routes');
const metricRoutes = require('./metrics.routes');

function reservACapi(app) {
  // Prefix Route
  const router = express.Router();
  app.use('/api/', router);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /*
    ***************************************************************
                            TRIMESTER ROUTES
    *******************************************************************
*/

  router.use(trimesterRoutes);
  /*
    ***************************************************************
                            ITEMS ROUTES
    *******************************************************************
*/

  router.use(itemRoutes);

  /*
    ***************************************************************
                            ROOMS ROUTES
    *******************************************************************
*/

  router.use(roomRoutes);

  /*
    ***************************************************************
                            RESERVATIONS ROUTES
    *******************************************************************
*/

  router.use(reservationRoutes);

  /*
    ***************************************************************
                            RESERVATIONS REQUEST ROUTES
    *******************************************************************
*/

  router.use(reservationRequestRoutes);

  /*
    ***************************************************************
                            ROOM REQUEST ROUTES
    *******************************************************************
*/

  router.use(roomRequestRoutes);

  /*
    ***************************************************************
                            USERS ROUTES
    *******************************************************************
*/

  router.use(userRoutes);

  /*
    ***************************************************************
                            SUBJECTS ROUTES
    *******************************************************************
*/

  router.use(subjectRoutes);

  /*
    ***************************************************************
                            METRICS ROUTES
    *******************************************************************
*/

  router.use(metricRoutes);
}

module.exports = reservACapi;
