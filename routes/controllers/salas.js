const ReservacService = require('../../services/reserva');
const reservacService = new ReservacService

/*
    Rules To Api Rest
    status code 200 = means everything its ok
    status code 201 = means the object/item was created succesfull
    status code 400 = means bad request from the input
*/

/*
    Controller
*/
class salaController {

    // GET all rooms
    async  allRooms(req, res, next) {
        try {
            const salas = await reservacService.getSalas()
            if (salas.rowCount > 0) {
                res.status(200).send(salas.rows);
            } else {
                res.status(200).json({ message: "No hay salas registradas" })
            }
            res.status(200).send(salas.rows);
        } catch (err) {
            next(err);
        }
    }

}

module.exports = salaController