const ReservationService = require('../services/reservations.service');
const ReservationRequestService = require('../services/reservationRequest.service');
const reservationService = new ReservationService();
const reservationRequestService = new ReservationRequestService();

/*
    Rules To Api Rest
    status code 200 = means everything its ok
    status code 201 = means the object/item was created succesfull
    status code 400 = means bad request from the input
    status code 404 = means bad request url
    status code 500 = means something explote on the bd
*/

/*
    Controller
*/
class ReservationController {
  // GET all asignations hours of ALL WEEKS reserved in room
  async HoursReservedByTypeWeek(req, res, next) {
    const salaId = req.params.roomId;
    const typeWeek = req.params.week;
    try {
      if (typeWeek == 'todas') {
        const salaHorasOcupadas = await reservationService.getSalaHorasOcupadasTodas(
          salaId
        );
        res.status(200).send(salaHorasOcupadas.rows);
      } else if (typeWeek == 'pares') {
        const salaHorasOcupadas = await reservationService.getSalaHorasOcupadasPares(
          salaId
        );
        res.status(200).send(salaHorasOcupadas.rows);
      } else if (typeWeek == 'impares') {
        const salaHorasOcupadas = await reservationService.getSalaHorasOcupadasImpares(
          salaId
        );
        res.status(200).send(salaHorasOcupadas.rows);
      } else if (!isNaN(typeWeek)) {
        const reservationsOnWeek = await reservationService.getReservationFromWeek(
          salaId,
          typeWeek
        );
        res.status(200).json(reservationsOnWeek.rows);
      } else {
        res.status(400).json({ error: 'Especifique una semana valida' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // GET all asignations from Room
  async asignationsFromRoom(req, res, next) {
    const room = req.params.roomId;
    try {
      const reservationsRoom = await reservationService.getReservationByRoom(
        room
      );
      res.json(reservationsRoom.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // GET an asignation schedule
  async asignationSchedule(req, res, next) {
    const id = req.params.reservaID;
    try {
      const asinationSchedule = await reservationService.getScheduleFromAsignation(
        id
      );
      res.json(asinationSchedule.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // POST create a new reservation (only admin) (in background this create a reservation request and automaticaly is accepted
  // this is because we need values to generate metrics/charts)
  async createNewReservation(req, res, next) {
    const {
      requester,
      subject,
      room,
      quantity,
      material,
      semanas
    } = req.body[0]; //datos de la solicitud
    try {
      if (!req.body[1]) {
        res
          .status(403)
          .json({ error: 'Debe llenar un horario a solicitar reserva' });
      } else {
        // creamos la solicitud de reserva, tomamos el id, verificamos el tipo de semana y crean los horarios de esa solicitud
        const idCreatedRequest = await reservationRequestService.createReservationAsAdmin(
          requester,
          subject,
          room,
          material,
          quantity
        );
        if (semanas == 'todas') {
          for (let index = 1; index < 13; index++) {
            await reservationRequestService.insertarhorario(
              index,
              req.body,
              idCreatedRequest
            );
          }
        } else if (semanas == 'pares') {
          for (let index = 2; index < 13; index += 2) {
            await reservationRequestService.insertarhorario(
              index,
              req.body,
              idCreatedRequest
            );
          }
        } else if (semanas == 'impares') {
          for (let index = 1; index < 13; index += 2) {
            await reservationRequestService.insertarhorario(
              index,
              req.body,
              idCreatedRequest
            );
          }
        } else if (Number.isInteger(semanas) && semanas > 0 && semanas < 13) {
          await reservationRequestService.insertarhorario(
            semanas,
            req.body,
            idCreatedRequest
          );
        } else {
          res.status(403).json({
            error: 'No se esta especificando un tipo de semana correctamente'
          });
        }
        // Se verifica que los datos del front son correctos, y se crea la reserva a partir de la solicitud
        // (Lo que se verifica es que el front por error de diseno haya mandado un dato que choque con un horario ya existente)
        const solicitud = await reservationRequestService.getScheduleFromRequestForPut(
          idCreatedRequest
        );
        const result = solicitud.rows[0];
        const checkSchedule = await reservationRequestService.checkIfExists(
          room,
          idCreatedRequest
        );
        if (checkSchedule.rowCount > 0) {
          res.status(403).json({
            error: `Ya existe una reserva en la sala ${room} con ese horario, Elimine la(s) Reservas en ese horario antes de aceptar esta solicitud (Comunicate con los administradores del ldac)`
          });
          return;
        } else {
          await reservationRequestService.createReservation(
            room,
            result.subject_id,
            result.trimester_id,
            result.send_time.toISOString().substring(0, 10),
            idCreatedRequest
          );
          await reservationRequestService.updateRequest(
            idCreatedRequest,
            'Aprobado',
            'A'
          );
          res.status(201).json({
            message: `Se creo exitosamente la reserva para la materia ${result.subject_id} en la sala ${room}`
          });
          return;
        }
      }
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }
}

module.exports = ReservationController;
