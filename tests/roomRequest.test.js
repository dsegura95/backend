//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Room Requests', () => {
    /*
     * Test the /GET rooms.
     */
    describe('GET /api/labf/solicitudes', () => {
        it('it should get all room Request', (done) => {
            chai.request(app)
                .get('/api/labf/solicitudes')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (spec)
                    expect(res.body.length).be.eql(3);
                    done();
                });
        });
    });

    describe('GET /api/sala/solicitudes/crear/ldac', () => {
        it('it should get all room request by ldac', (done) => {
            chai.request(app)
                .get('/api/sala/solicitudes/crear/ldac')
                .end((err, res) => {
                    const roomRequest = res.body[0]
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (spec)
                    expect(res.body.length).be.eql(1);
                    // body values
                    expect(roomRequest.id).to.have.equal('2');
                    expect(roomRequest.room_id).to.have.equal('MYS-006');
                    expect(roomRequest.owner_id).to.have.equal('cchang');
                    expect(roomRequest.trimester_id).to.have.equal('ENE-MAR2020');
                    expect(roomRequest.status).to.have.equal('P');
                    done();
                });
        });
    });

    /*
     * Test the /GET rooms.
     */
    describe('PUT /api/sala/solicitudes/2', () => {
        it('it should update last room:  Sala de pruebas to Saladepruebas', (done) => {
            let roomReqUpdate = {
                status: "R",
            }
            chai.request(app)
                .put('/api/sala/solicitudes/2')
                .send(roomReqUpdate)
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: object
                    expect(res.body).be.a('object');
                    // message: Solicitud de agregar sala Atendida
                    expect(res.body.message).to.have.equal(`Solicitud de agregar sala Atendida`)
                    done();
                });
        });
    });

    /*
     * Test the /POST
     */
    describe('POST /api/sala/solicitudes/crear/ldac', () => {
        it('it should create a new room request', (done) => {
            let roomRequest = {
                room_id: 'MYS-123',
            }
            chai.request(app)
                .post('/api/sala/solicitudes/crear/ldac')
                .send(roomRequest)
                .end((err, res) => {
                    // status: 201
                    expect(res).to.have.status(201)
                    // type: object message
                    expect(res.body).be.a('object');
                    // message: <quantity> items asignados a Sala <room_id>
                    expect(res.body.message).to.have.equal( `Solicitud de sala ${roomRequest.room_id} creada exitosamente`)
                    done();
                });
        });
    });


})
