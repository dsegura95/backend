const RoomRequestService = require('../services/roomRequest.service');
const roomRequestService = new RoomRequestService();

// Time/Date module
const moment = require('moment');

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
class RoomRequestController {
  // GET all room requests made by an adminLab
  async getRoomReqFromAdminLab(req, res, next) {
    const userId = req.params.userId;
    try {
      const result = await roomRequestService.getRoomRequestFromUser(userId);
      res.status(200).send(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ocurrio un error en el servidor' });
      next(err);
    }
  }

  // GET all room request to LABF
  async getAllRoomRequest(req, res, next) {
    try {
      const requests = await roomRequestService.getRoomRequest();
      res.status(200).send(requests.rows);
    } catch (err) {
      next(err);
    }
  }

  // PUT accept or reject a room request (ONLY LABF)
  async manageRoomRequest(req, res, next) {
    const id = req.params.roomRequestId;
    const status = req.body.status;
    const result = await roomRequestService.updateRoomRequest(id, status);
    let date = moment().format('YYYY-MM-DD');
    if (!result) {
      res.status(403).json({
        error: `La sala ya ha sido asignada previamente a un laboratorio y se encuentra activa`
      });
    } else {
      try {
        if (status == 'A') {
          try {
            await roomRequestService.createSalaFromRequest(id, date);
          } catch (err) {
            next(err);
          }
        }
        res.status(200).json({ message: `Solicitud de agregar sala Atendida` });
      } catch (err) {
        res.status(500).json({ error: 'Ocurrio un error en el servidor' });
        next(err);
      }
    }
  }

  // POST create a room request (ONLY ADMIN_LABS)
  async createRoomRequest(req, res, next) {
    const userId = req.params.userId;
    const room_id = req.body.room_id;
    let date = moment().format('YYYY-MM-DD');
    const result = await roomRequestService.createRoomRequest(
      room_id,
      userId,
      date
    );
    if (result == null) {
      res.status(403).json({
        error: `El usuario no esta autorizado a reservar salas o no se ha introducido el id de la sala`
      });
    } else if (room_id.length > 7) {
      res.status(403).json({ error: `El nombre a solicitar es incorrecto` });
    } else {
      try {
        res.status(201).json({
          message: `Solicitud de sala ${room_id} creada exitosamente`
        });
      } catch (err) {
        res.status(500).json({ error: 'Ocurrio un error en el servidor' });
        next(err);
      }
    }
  }
}

module.exports = RoomRequestController;
