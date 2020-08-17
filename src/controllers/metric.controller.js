const MetricsService = require('../services/metrics.service');
const metricsService = new MetricsService();

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
class MetricsController {
  // GET room usages: number of students that used until now
  async roomUsage(req, res, next) {
    const room_id = req.params.RoomId;
    const fechaInicio = req.body.fechaInicio;
    if (fechaInicio == undefined) {
      res.status(403).json({ error: `No se ha introducido ninguna fecha` });
      return;
    }
    try {
      const result = await metricsService.usoDesdeFecha(room_id, fechaInicio);
      if (result != null) {
        res
          .status(200)
          .send(
            `La sala ha sido utilizada por ${result} estudiantes desde la fecha ${fechaInicio} hasta la fecha actual`
          );
      } else {
        res
          .status(200)
          .send(
            `La sala no ha sido utilizada por ningun estudiante desde la fecha ${fechaInicio} hasta la fecha actual`
          );
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  //GET total numbers of reservations {Accepted | Rejected | Pending}
  async getReservationsQuantity(req, res, next) {
    const modo = req.body.modo;
    let result;
    try {
      result = await metricsService.numeroDeReservas(modo);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
    if (modo == 'A') {
      res
        .status(200)
        .send(`Existen un total de ${result} reservas aprobadas en el sistema`);
    } else if (modo == 'P') {
      res
        .status(200)
        .send(`Existen un total de ${result} reservas en espera en el sistema`);
    } else if (modo == 'R') {
      res
        .status(200)
        .send(
          `Existen un total de ${result} reservas rechazadas en el sistema`
        );
    } else if (modo == 'T') {
      res
        .status(200)
        .send(`Existen un total de ${result} reservas en el sistema`);
    } else {
      res.status(403).json({ error: `El filtro seleccionado no es valido` });
    }
  }

  // GET items owned by the room between trimesterStart until trimesterX
  async getItemsVarations(req, res, next) {
    const room_id = req.params.RoomId;
    const trimestreInicio = req.body.trimestreInicio;
    const trimestreFinal = req.body.trimestreFinal;
    if (trimestreInicio == undefined || trimestreFinal == undefined) {
      res.status(403).json({
        error: `No se ha introducido el trimestre inicio o trimestre final`
      });
      return;
    }
    try {
      const result = await metricsService.variacionItems(
        room_id,
        trimestreInicio,
        trimestreFinal
      );
      if (result == 0) {
        res.status(404).json({
          error: `El trimestre de inicio o trimestre final introducidos no existen en el sistema o son iguales`
        });
      } else {
        res.status(200).send(result.rows);
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }
}

module.exports = MetricsController;
