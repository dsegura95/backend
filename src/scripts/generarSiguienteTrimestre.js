const moment = require('moment');
const RoomsService = require('../services/rooms.service');
const TrimestersService = require('../services/trimesters.service');
const ReservationRequestService = require('../services/reservationRequest.service');
const reservationRequestService = new ReservationRequestService();
const trimestersService = new TrimestersService();
const roomsService = new RoomsService();

// Daemon to Auto Update Trimesters
// Explanation: Obtiene el trimestre actual obtiene su fecha de culminacion y la compara con la fecha actual
// Dependiendo de la fecha en la que se cumple que la fecha actual > fecha de culmunacion, elige la nueva fecha
// del proximo trimestre. los rangos creo que son:
// - Si termina entre FEB-ABRIL, crea ABR-JUL
// - Si termina entre JUN-AGOSTO, crea SEP-DEC
// - Si termina entre SEP-ENE, crea ENE-MAR

async function generarSiguienteTrimestre() {
  const temp = await trimestersService.getActualTrim();
  const lasTrim = temp.rows[0].finish.toISOString();

  if (moment().isAfter(moment(lasTrim).add(1, 'day'))) {
    const lasTrimMonth = moment(lasTrim).month();
    const lasTrimYear = moment(lasTrim).year();

    //Marzo, Abril, Mayo
    if (2 <= lasTrimMonth && lasTrimMonth <= 4) {
      // console.log('ABR-JUL' + lasTrimYear, lasTrimMonth);
      await trimestersService.createTrim(
        'ABR-JUL' + lasTrimYear,
        moment(lasTrim)
          .add(3, 'day')
          .toISOString(),
        moment(lasTrim)
          .add(3, 'month')
          .toISOString()
      );
    }
    //Junio, Julio
    else if (5 <= lasTrimMonth && lasTrimMonth <= 6) {
      // console.log('JUL-AGO' + lasTrimYear, lasTrimMonth);
      await trimestersService.createTrim(
        'JUL-AGO' + lasTrimYear,
        moment(lasTrim)
          .add(3, 'day')
          .toISOString(),
        moment(lasTrim)
          .add(10, 'week')
          .toISOString()
      );
    }
    //Septiembre, Octubre
    else if (8 <= lasTrimMonth && lasTrimMonth <= 9) {
      //console.log('SEP-DIC' + lasTrimYear, lasTrimMonth);
      await trimestersService.createTrim(
        'SEP-DIC' + lasTrimYear,
        moment(lasTrim)
          .add(3, 'day')
          .toISOString(),
        moment(lasTrim)
          .add(3, 'month')
          .toISOString()
      );
    }
    //Diciembre
    else if (11 <= lasTrimMonth) {
      // console.log('ENE-MAR' + lasTrimYear, lasTrimMonth);
      await trimestersService.createTrim(
        'ENE-MAR' +
          moment(lasTrim)
            .add(1, 'year')
            .year(),
        moment(lasTrim)
          .add(3, 'day')
          .toISOString(),
        moment(lasTrim)
          .add(4, 'month')
          .toISOString()
      );
    }
    //Enero, Febrero
    else if (lasTrimMonth <= 1) {
      // console.log('ENE-MAR' + lasTrimYear, lasTrimMonth);
      await trimestersService.createTrim(
        'ENE-MAR' + lasTrimYear,
        moment(lasTrim)
          .add(3, 'day')
          .toISOString(),
        moment(lasTrim)
          .add(3, 'month')
          .toISOString()
      );
    }
    //
    mantenerItemDeSalaDeTrimestreAnterior(temp);
    rechazarSolicitudesPendientesDeTrimestreAnterior(temp);
  }
}

async function mantenerItemDeSalaDeTrimestreAnterior(pastTrim) {
  try {
    const Salas = await roomsService.getSalasActivas();
    const idSalas = Salas.rows;
    for (let elem of idSalas) {
      const itemsSala = await roomsService.getSalaItemsByTrim(
        elem.id,
        pastTrim.rows[0].id
      );
      const salaItems = itemsSala.rows;
      for (let item of salaItems) {
        await roomsService.createSalaItem(elem.id, item.id, item.quantity);
      }
    }
  } catch (err) {
    // console.log(err);
  }
}

async function rechazarSolicitudesPendientesDeTrimestreAnterior(pastTrim) {
  try {
    const reservation_request_id = await reservationRequestService.getAllPendingRequestOfLastTrim(
      pastTrim.rows[0].id
    );
    const idRR = reservation_request_id.rows;
    for (let elem of idRR) {
      await reservationRequestService.updateRequest(
        elem.id,
        'Trimestre Solicitado Termino',
        'R'
      );
    }
  } catch (err) {
    // console.log(err);
  }
}

module.exports = generarSiguienteTrimestre;
