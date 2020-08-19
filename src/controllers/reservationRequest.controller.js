const ReservationRequestService = require('../services/reservationRequest.service');
const RoomsService = require('../services/rooms.service');
const roomsService = new RoomsService();
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
    Auxiliar Functions
*/
async function roomExist(roomId) {
  const room = await roomsService.getSala(roomId);
  if (room.rowCount == 1) {
    return true;
  } else {
    return false;
  }
}

/*
    Controller
*/

class ReservationRequestController {
  // GET information about reservation request
  async getReservationReq(req, res, next) {
    const solicitudId = req.params.solicitudId;
    try {
      const requestFromUser = await reservationRequestService.getRequest(
        solicitudId
      );
      res.status(200).send(requestFromUser.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // GET schedule of reservation request
  async getReservationReqSchedule(req, res, next) {
    const solicitudId = req.params.solicitudId;
    try {
      const schedule = await reservationRequestService.getScheduleFromRequest(
        solicitudId
      );
      res.json(schedule);
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // GET all reservations request made by USER
  async userReservationsReqs(req, res, next) {
    const userId = req.params.userId;
    try {
      const requestFromUser = await reservationRequestService.getRequestUser(
        userId
      );
      res.status(200).send(requestFromUser.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // GET all reservations request made to ADMIN_LAB
  async adminReservationsRequest(req, res, next) {
    const labId = req.params.labId;
    try {
      const requestFromUser = await reservationRequestService.getRequests(
        labId
      );
      res.status(200).send(requestFromUser.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // PUT accept or reject a reservation request made by an user (ONLY admin)
  async manageReservationReq(req, res, next) {
    const requestId = req.params.requestId;
    let { reason, status } = req.body;
    try {
      const solicitud = await reservationRequestService.getScheduleFromRequestForPut(
        requestId
      );
      if (solicitud.rowCount == 0) {
        res.status(400).json({ error: `La reserva no posee ningun horario` });
        return;
      }
      const result = solicitud.rows[0];
      let room = solicitud.rows[0].room_id;
      const checkSchedule = await reservationRequestService.checkIfExists(
        room,
        requestId
      );
      if (status == 'A') {
        // Existe un horario ya asignado en ese horario que se solicita
        if (checkSchedule.rowCount > 0) {
          res.status(403).json({
            error: `Ya existe una reserva en la sala ${room} con ese horario, Elimine la(s) Reservas en ese horario antes de aceptar esta solicitud`
          });
          return;
        } else {
          await reservationRequestService.createReservation(
            room,
            result.subject_id,
            result.trimester_id,
            result.send_time.toISOString().substring(0, 10),
            requestId
          );
          await reservationRequestService.updateRequest(
            requestId,
            'Aprobado',
            'A'
          );
          res.status(200).json({
            message: `Se creo exitosamente la reserva para la materia ${result.subject_id} en la sala ${room}`
          });
          return;
        }
      } else {
        if (!reason) {
          reason = 'Solicitud Rechazada';
          return;
        }
        await reservationRequestService.updateRequest(requestId, reason, 'R');
        res.status(200).json({ message: 'Solicitud rechazada correctamente' });
        return;
      }
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // DELETE user can delete the reservation request made by him
  async deleteReservationReq(req, res, next) {
    const requestId = req.params.idResquest;
    const deletedReservationReq = await reservationRequestService.deleteRequest(
      requestId
    );
    try {
      if (deletedReservationReq.rowCount == 1) {
        res
          .status(200)
          .json({ message: 'Solicitud eliminada satisfactoriamente' });
      } else {
        res
          .status(400)
          .json({ error: 'No existe ninguna solicitud a eliminar' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // POST create a reservation request
  // this function create a reservation request, so there are one thing:
  //      if dont have material, then default: No hay requerimientos
  // first we create the reservation request, after this we got the id of reservation req
  // and create the reservation request schedule
  async createReservationRequest(req, res, next) {
    let { requester, subject, room, quantity, material, semanas } = req.body[0]; //datos de la solicitud
    try {
      if (!roomExist(room)) {
        res.status(400).json({
          error: 'la sala en donde se solicita la reserva no existe '
        });
      }
      if (!req.body[1]) {
        res
          .status(403)
          .json({ error: 'Debe llenar un horario a solicitar reserva' });
      } else {
        if (isNaN(quantity) || quantity < 0) {
          res.status(403).json({
            error: 'La cantidad de estudiantes debe ser un numero positivo'
          });
        }
        if (!material) {
          material = 'No hay requerimientos';
        }
        const id = await reservationRequestService.createReservationRequest(
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
              id
            );
          }
        } else if (semanas == 'pares') {
          for (let index = 2; index < 13; index += 2) {
            await reservationRequestService.insertarhorario(
              index,
              req.body,
              id
            );
          }
        } else if (semanas == 'impares') {
          for (let index = 1; index < 13; index += 2) {
            await reservationRequestService.insertarhorario(
              index,
              req.body,
              id
            );
          }
        } else if (Number.isInteger(semanas) && semanas > 0 && semanas < 13) {
          await reservationRequestService.insertarhorario(
            semanas,
            req.body,
            id
          );
        } else {
          res.status(403).json({
            error: 'No se esta especificando un tipo de semana correctamente'
          });
        }
        res.status(201).json({ message: 'Se creo correctamente la solicitud' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }
}

module.exports = ReservationRequestController;
