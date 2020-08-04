const { Router } = require('express');
const router = Router();

const ReservationController = require('../controllers/reservations.controller');
const reservationController = new ReservationController;

/*
 ***************************************************************
                            RESERVATIONS ROUTES
 *******************************************************************
*/

/* [TESTED] Obtener los horarios reservados para el tipo de semanas: week = { 'todas', 'pares', 'impares', [1...12]} */
router.get("/reservas/:roomId/semana/:week", reservationController.HoursReservedByTypeWeek);

/* [TESTED] Obtener todas las reservas de una sala */
router.get("/reservas/:roomId", reservationController.asignationsFromRoom);

/* [TESTED] Obtener el horario de una reserva */
router.get("/reservas/:reservaID/horario", reservationController.asignationSchedule);

/* [TESTED] Crear una reserva (se crea por debajo la solicitud y se acepta automaticamente para ser una reserva) */
router.post("/crear/reserva", reservationController.createNewReservation);

module.exports = router