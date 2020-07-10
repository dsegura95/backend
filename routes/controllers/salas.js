const ReservacService = require('../../services/reserva');
const reservacService = new ReservacService

/*
    Rules To Api Rest
    status code 200 = means everything its ok
    status code 201 = means the object/item was created succesfull
    status code 400 = means bad request from the input
    status code 404 = means bad request url 
*/

/*
    Controller
*/
class salaController {

    // GET all rooms
    async allRooms(req, res, next) {
        try {
            const salas = await reservacService.getSalas()
            if (salas.rowCount > 0) {
                res.status(200).send(salas.rows);
            } else {
                res.status(200).json({ message: "No hay salas registradas" })
            }
        } catch (err) {
            next(err);
        }
    }

    // GET one specific room
    async specificRoom(req, res, next) {
        const { salaId } = req.params;
        try {
            const sala = await reservacService.getSala(salaId);
            if (sala.rowCount == 1) {
                res.status(200).send(sala.rows)
            } else {
                res.status(404).json({ message: `No existe la sala ${salaId}` })
            }
        } catch (err) {
            next(err);
        }
    }

    // GET all rooms owned by one admin
    async adminRooms(req, res, next) {
        const userId = req.params.userId;
        try {
            const adminSalas = await reservacService.getAdminSalas(userId);
            res.status(200).send(adminSalas.rows);
        } catch (err) {
            next(err);
        }
    }

}

module.exports = salaController