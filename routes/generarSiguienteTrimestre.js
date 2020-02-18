const moment = require('moment');
const ReservacService = require('../services/reserva');
const reservacService = new ReservacService
//const express = require('express');
//const path = require("path");

class generator {
    async generarSiguienteTrimestre(){
        const temp = await reservacService.getActualTrim();
        const lasTrim = (temp.rows[0].finish).toISOString().substring(0, 10);

        if( !(moment().isAfter( moment(lasTrim).add(1, 'day') ) )){
        const lasTrimMonth = moment(lasTrim).month();
        const lasTrimYear = moment(lasTrim).year();

            if ( (2 <= lasTrimMonth) && (lasTrimMonth  <= 4) ){
                await reservacService.createTrim('ABR-JUL' + lasTrimYear,
                                                moment(lasTrim).add(2, 'week').add(3, 'day').toISOString().substring(0, 10),
                                                moment(lasTrim).add(2, 'week').add(3, 'day').add(3, 'month').toISOString().substring(0, 10),
                                                )
            }
            else if ( (5 <= lasTrimMonth) && (lasTrimMonth <= 9) ){
                await reservacService.createTrim('SEP-DIC' + lasTrimYear,
                                                moment(lasTrim).add(2, 'week').add(3, 'day'),
                                                moment(lasTrim).add(2, 'week').add(3, 'day').add(3, 'month'),
                                                )
            }
            else if ( (10 <= lasTrimMonth)  ){
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
        }
    }
}
module.exports = generator