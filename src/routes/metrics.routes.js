const { Router } = require('express');
const router = Router();

const MetricsController = require('../controllers/metric.controller');
const metricController = new MetricsController;

/*
 ***************************************************************
                        METRICS ROUTES
 *******************************************************************
 */

/* Obtener el numero de estudiantes que ha usado la sala hasta la actualidad */
router.get('/metrics/usodesala/:RoomId', metricController.roomUsage);

/* Obtener el numero de reservas que ha tenido la sala desde una fecha de inicio hasta una fecha final */
router.get('/metrics/totalreservas', metricController.getReservationsQuantity);

/* Obtener la variaciones de los items desde un trimestre a otro especificado */
router.get(
  '/metrics/variacionitems/:RoomId',
  metricController.getItemsVarations
);

module.exports = router;