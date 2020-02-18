const moment = require('moment');
const ReservacService = require('../services/reserva');
const reservacService = new ReservacService

async function generarSiguienteTrimestre(){
    const temp = await reservacService.getActualTrim();
    const lasTrim = (temp.rows[0].finish).toISOString().substring(0, 10);

    if( (moment().isAfter( moment(lasTrim).add(1, 'day') ) )){
    const lasTrimMonth = moment(lasTrim).month();
    const lasTrimYear = moment(lasTrim).year();

        //Marzo, Abril, Mayo
        if ( (2 <= lasTrimMonth) && (lasTrimMonth  <= 4) ){
            // console.log('ABR-JUL' + lasTrimYear, lasTrimMonth);
            await reservacService.createTrim('ABR-JUL' + lasTrimYear,
                                            moment(lasTrim).add(3, 'day').toISOString().substring(0, 10),
                                            moment(lasTrim).add(3, 'month').toISOString().substring(0, 10),
                                            )
        }
        //Junio, Julio
        else if ( (5 <= lasTrimMonth) && (lasTrimMonth <= 6) ){
            // console.log('JUL-AGO' + lasTrimYear, lasTrimMonth);
            await reservacService.createTrim('JUL-AGO' + lasTrimYear,
                                            moment(lasTrim).add(3, 'day').toISOString().substring(0, 10),
                                            moment(lasTrim).add(10, 'week').toISOString().substring(0, 10),
                                            )
        }
        //Septiembre, Octubre
        else if ( (8 <= lasTrimMonth) && (lasTrimMonth <= 9) ){
            //console.log('SEP-DIC' + lasTrimYear, lasTrimMonth);            
            await reservacService.createTrim('SEP-DIC' + lasTrimYear,
                                            moment(lasTrim).add(3, 'day').toISOString().substring(0, 10),
                                            moment(lasTrim).add(3, 'month').toISOString().substring(0, 10),
                                            )
        }
        //Diciembre
        else if ( (11 <= lasTrimMonth)  ){
            // console.log('ENE-MAR' + lasTrimYear, lasTrimMonth);            
            await reservacService.createTrim('ENE-MAR' + moment(lasTrim).add(1, 'year').year(),
                                            moment(lasTrim).add(3, 'day').toISOString().substring(0, 10),
                                            moment(lasTrim).add(4, 'month').toISOString().substring(0, 10),
                                            )
        }
        //Enero, Febrero
        else if ( (lasTrimMonth <= 1 ) ) {
            // console.log('ENE-MAR' + lasTrimYear, lasTrimMonth);
            await reservacService.createTrim('ENE-MAR' + lasTrimYear,
                                            (moment(lasTrim).add(3, 'day')).toISOString().substring(0, 10),
                                            (moment(lasTrim).add(3, 'month')).toISOString().substring(0, 10),
                                            )
        }
    }
}
module.exports = generarSiguienteTrimestre