//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
var expect = chai.expect;

chai.use(chaiHttp);

/*
SALAS
*/
describe('Reservations', () => {
    /*
     * Test the /GET rooms.
     */
    describe('GET /api/reservas/MYS-019/semana/pares', () => {
        it('it should get 4 reservations in MYS-019 by Type week: pares', (done) => {
            chai.request(app)
                .get('/api/reservas/MYS-019/semana/pares')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (4)
                    expect(res.body.length).be.above(1);
                    done();
                });
        });
    });

    describe('GET /api/reservas/MYS-019/semana/todas', () => {
        it('it should get 4 reservations in MYS-019 by Type week: todas', (done) => {
            chai.request(app)
                .get('/api/reservas/MYS-019/semana/todas')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (4)
                    expect(res.body.length).be.above(1);
                    done();
                });
        });
    });

    describe('GET /api/reservas/MYS-019/semana/impares', () => {
        it('it should get 0 reservations in MYS-019 by Type week: impares', (done) => {
            chai.request(app)
                .get('/api/reservas/MYS-019/semana/impares')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (0)
                    expect(res.body.length).be.equal(0);
                    done();
                });
        });
    });

    describe('GET /api/reservas/MYS-019', () => {
        it('it should get 2 reservations in MYS-019', (done) => {
            chai.request(app)
                .get('/api/reservas/MYS-019')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (2)
                    expect(res.body.length).be.equal(2);
                    done();
                });
        });
    });

    describe('GET /api/reservas/1/horario', () => {
        it('it should get the 12 schedule of reservation with id 1', (done) => {
            chai.request(app)
                .get('/api/reservas/1/horario')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (12)
                    expect(res.body.length).be.eql(12);
                    done();
                });
        });
    });

    /*
     * Test the /POST
     */
    describe('POST /api/crear/reserva', () => {
        it('it should create a new reservation', (done) => {
            let reservation = [{
                "requester": "ldac",
                "subject": "PS1111",
                "room":"MYS-019",
                "quantity": 10,
                "material": "NADA",
                "semanas": "impares"
            },
            {
                "dia": "jueves",
                "hora": 3
            }]
            chai.request(app)
                .post('/api/crear/reserva')
                .send(reservation)
                .end((err, res) => {
                    // status: 201
                    expect(res).to.have.status(201)
                    // type: object message
                    expect(res.body).be.a('object');
                    // message: Se creo exitosamente la reserva para la materia PS1111 en la sala MYS-019
                    expect(res.body.message).to.have.equal( `Se creo exitosamente la reserva para la materia PS1111 en la sala MYS-019`)
                    done();
                });
        });
    });
});
