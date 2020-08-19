const TrimestersService = require('../services/trimesters.service');
const trimestersService = new TrimestersService();

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
    Controller
*/
class TrimesterController {
  /*
        /GET
    */

  //  This endpoint is only to test and show where is the next trimester
  async autoUpdateTrim(req, res, next) {
    const temp = await trimestersService.getActualTrim();
    const lasTrim = temp.rows[0].finish.toISOString().substring(0, 10);
    try {
      if (moment().isAfter(moment(lasTrim).add(1, 'day'))) {
        const lasTrimMonth = moment(lasTrim).month();
        const lasTrimYear = moment(lasTrim).year();

        if (2 <= lasTrimMonth && lasTrimMonth <= 4) {
          await trimestersService.createTrim(
            'ABR-JUL' + lasTrimYear,
            moment(lasTrim)
              .add(2, 'week')
              .add(3, 'day')
              .toISOString()
              .substring(0, 10),
            moment(lasTrim)
              .add(2, 'week')
              .add(3, 'day')
              .add(3, 'month')
              .toISOString()
              .substring(0, 10)
          );
        } else if (5 <= lasTrimMonth && lasTrimMonth <= 9) {
          await trimestersService.createTrim(
            'SEP-DIC' + lasTrimYear,
            moment(lasTrim)
              .add(2, 'week')
              .add(3, 'day'),
            moment(lasTrim)
              .add(2, 'week')
              .add(3, 'day')
              .add(3, 'month')
          );
        } else if (10 <= lasTrimMonth) {
          await trimestersService.createTrim(
            'ENE-MAR' +
              moment(lasTrim)
                .add(1, 'year')
                .year(),
            moment(lasTrim)
              .add(1, 'week')
              .add(3, 'day'),
            moment(lasTrim)
              .add(1, 'week')
              .add(3, 'day')
              .add(3, 'month')
          );
        } else {
          await trimestersService.createTrim(
            'ENE-MAR' + lasTrimYear,
            moment(lasTrim)
              .add(1, 'week')
              .add(3, 'day')
              .toISOString()
              .substring(0, 10),
            moment(lasTrim)
              .add(1, 'week')
              .add(3, 'day')
              .add(3, 'month')
              .toISOString()
              .substring(0, 10)
          );
        }
        res.status(200).json({ message: 'El trimestre termino bicho' });
      } else {
        res.status(200).json({ message: 'El trimestre no ha terminado bicho' });
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  async getLastTrimester(req, res, next) {
    try {
      const trimestreUltimo = await trimestersService.getActualTrim();
      res.status(200).send(trimestreUltimo.rows);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
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
      const response = await trimestersService.updateTrim(
        idParam,
        start,
        finish
      );
      if (!response) {
        res.status(403).json({ message: 'Fecha Invalida' });
      } else {
        res.status(200).json({ message: 'Trimestre actualizado' });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TrimesterController;
