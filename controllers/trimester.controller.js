const ReservacService = require('../services/reserva');
const reservacService = new ReservacService

// Time/Date Module
const moment = require('moment');

// validations module boom
const boom = require('@hapi/boom');

/*
    Rules To Api Rest
    status code 200 = means everything its ok
    status code 201 = means the object/item was created succesfull
    status code 400 = means bad request from the input
    status code 404 = means bad request url
    status code 500 = means something explote on the bd
*/

/*
    Auxiliar functions
*/

// Check if quantity is valid


/*
    Controller
*/
class TrimesterController {
    /*
        /GET
    */

    // Daemon to AutoUpdate Trimesters
    // Explanation: Obtiene el trimestre actual obtiene su fecha de culminacion y la compara con la fecha actual
    // Dependiendo de la fecha en la que se cumple que la fecha actual > fecha de culmunacion, elige la nueva fecha
    // del proximo trimestre. los rangos creo que son:
    // - Si termina entre FEB-ABRIL, crea ABR-JUL
    // - Si termina entre JUN-AGOSTO, crea SEP-DEC
    // - Si termina entre SEP-ENE, crea ENE-MAR
    async autoUpdateTrim(req, res, next) {
        const temp = await reservacService.getActualTrim();
        const lasTrim = (temp.rows[0].finish).toISOString().substring(0, 10);
        try {
            if (!(moment().isAfter(moment(lasTrim).add(1, 'day')))) {
                const lasTrimMonth = moment(lasTrim).month();
                const lasTrimYear = moment(lasTrim).year();

                if ((2 <= lasTrimMonth) && (lasTrimMonth <= 4)) {
                    await reservacService.createTrim('ABR-JUL' + lasTrimYear,
                        moment(lasTrim).add(2, 'week').add(3, 'day').toISOString().substring(0, 10),
                        moment(lasTrim).add(2, 'week').add(3, 'day').add(3, 'month').toISOString().substring(0, 10),
                    )
                }
                else if ((5 <= lasTrimMonth) && (lasTrimMonth <= 9)) {
                    await reservacService.createTrim('SEP-DIC' + lasTrimYear,
                        moment(lasTrim).add(2, 'week').add(3, 'day'),
                        moment(lasTrim).add(2, 'week').add(3, 'day').add(3, 'month'),
                    )
                }
                else if ((10 <= lasTrimMonth)) {
                    await reservacService.createTrim('ENE-MAR' + moment(lasTrim).add(1, 'year').year(),
                        moment(lasTrim).add(1, 'week').add(3, 'day'),
                        moment(lasTrim).add(1, 'week').add(3, 'day').add(3, 'month'),
                    )
                }
                else {
                    await reservacService.createTrim('ENE-MAR' + lasTrimYear,
                        (moment(lasTrim).add(1, 'week').add(3, 'day')).toISOString().substring(0, 10),
                        (moment(lasTrim).add(1, 'week').add(3, 'day').add(3, 'month')).toISOString().substring(0, 10),
                    )
                }
                res.json('el trimestre termino bicho')
            } else {
                res.json('El trimestre no ha terminado bicho')
            }
        } catch (err) {
            res.status(500).json({ Error: `Hubo un error en el servidor` });
            next(err);
        }
    }

    async getLastTrimester(req, res, next) {
        try {
            const trimestreUltimo = await reservacService.getActualTrim()
            res.status(200).send(trimestreUltimo.rows);
        } catch (err) {
            res.status(500).json({ Error: `Hubo un error en el servidor` });
            next(err);
        }
    }

    /*
        /PUT
    */
    async updateTrimester(req, res, next) {
        const { start, finish } = req.body;
        if (!start && !finish) {
            res.json(boom.badRequest('invalid query').output.payload);
        }
        const idParam = req.params.Id;
        try {
            const response = await reservacService.updateTrim(idParam, start, finish);
            if (!response){
                res.status(403).json({message: 'Fecha Invalida'});
            }
            else{
                res.status(200).json({message: 'Trimestre actualizado'});
            }
        } catch (err) {
            next(err);
        };
    }
}

module.exports = TrimesterController