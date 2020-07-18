//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
var expect = chai.expect;

chai.use(chaiHttp);

/*
RESERVATIONS REQUESTS
*/
describe('Reservations requests', () => {
    /*
     * Test the /GET info about reservation request
     */
    describe('GET /api/solicitudes/1', () => {
        it('it should get an information about one reservation request', (done) => {
            chai.request(app)
                .get('/api/solicitudes/1')
                .end((err, res) => {
                    const reservationRequest = res.body[0]
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (1)
                    expect(res.body.length).be.eql(1);
                    // Values
                    expect(reservationRequest.id).to.have.equal('1');
                    expect(reservationRequest.room_id).to.have.equal('MYS-019');
                    expect(reservationRequest.requester_id).to.have.equal('15-10611');
                    expect(reservationRequest.trimester_id).to.have.equal('ENE-MAR2020');
                    done();
                });
        });
    });

    describe('GET /api/solicitudes/1/horario', () => {
        it('it should get the shedule of reservation request 1', (done) => {
            chai.request(app)
                .get('/api/solicitudes/1/horario')
                .end((err, res) => {
                    const schedule = res.body.shedule
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('object');
                    // need length (1)
                    expect(schedule.length).be.eql(12);
                    // Values
                    expect(res.body.typeWeek).to.have.equal('pares');
                    expect(schedule[0].day).to.have.equal('Lunes');
                    expect(schedule[0].hour).to.have.equal(1);
                    expect(schedule[0].week).to.have.equal(2);
                    done();
                });
        });
    });

    describe('GET /solicitudes/usuario/12-10273', () => {
        it('it should get the 4 reservations request in ENE-MAR2020',(done) => {
            chai.request(app)
                .get('/api/solicitudes/usuario/12-10273')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (4)
                    expect(res.body.length).be.eql(4);
                    done();
                });
        });
    });

    describe('GET /solicitudes/admin/ldac', () => {
        it('it should get all reservations request to ldac in ENE-MAR2020',(done) => {
            chai.request(app)
                .get('/api/solicitudes/admin/ldac')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (13)
                    expect(res.body.length).be.eql(13);
                    done();
                });
        });
    });

    /*
     * Test the /POST
     */
    describe('POST /api/crear/solicitudes/reserva', () => {
        it('it should create new reservation request', (done) => {
            let request = [{
                "requester": "ldac",
                "subject": "PS1115",
                "room": "MYS-019",
                "quantity": 30,
                "material": "Debian 10 y GCC",
                "semanas": "impares"
            },{
                "dia": "miercoles",
                "hora": 1
            }]
            chai.request(app)
                .post('/api/crear/solicitudes/reserva')
                .send(request)
                .end((err, res) => {
                    // status: 201
                    expect(res).to.have.status(201)
                    // type: object message
                    expect(res.body).be.a('object');
                    // message: se creo correctamente la solicitud
                    expect(res.body.message).to.have.equal( `Se creo correctamente la solicitud`)
                    done();
                });
        });
    });

    /*
     * Test the /PUT
     */
    describe('PUT /api/solicitudes/reserva/16', () => {
        it('it should aproved the last request', (done) => {
            let aprovedReq = {
                status: "A"
            }
            chai.request(app)
                .put('/api/solicitudes/reserva/16')
                .send(aprovedReq)
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: object
                    expect(res.body).be.a('object');
                    done();
                });
        });
    });

    /*
     * Test the /DELETE
     */
    describe('DELETE /api/eliminar/solicitud/reserva/15', () => {
        it('it should delete the pending request (15)', (done) => {
            chai.request(app)
                .delete('/api/eliminar/solicitud/reserva/15')
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: array
                    expect(res.body).be.a('object');
                    // message: Solicitud eliminada satisfactoriamente
                    expect(res.body.message).to.have.equal( `Solicitud eliminada satisfactoriamente`)
                    done();
                });
        });
    });

});
