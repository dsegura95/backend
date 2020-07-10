//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
var expect = chai.expect;

chai.use(chaiHttp);

/*
SALAS
*/
describe('Rooms', () => {
    /*
     * Test the /GET subjects.
     */
    describe('GET /api/salas', () => {
        it('it should get all rooms', (done) => {
            chai.request(app)
                .get('/api/salas')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (spec)
                    // expect(res.body.length).be.eql(7);
                    done();
                });
        });
    });

    describe('GET /api/sala/MYS-018', () => {
        it('it should get Mys-018 room information', (done) => {
            chai.request(app)
                .get('/api/salas/MYS-018')
                .end((err, res) => {
                    const room = res.body[0]
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length 1
                    expect(res.body.length).be.eql(1);
                    // Values
                    expect(room.id).to.have.equal("MYS-018");
                    expect(room.name).to.have.equal('Sala F');
                    expect(room.owner_id).to.have.equal('cchang');
                    expect(room.manager_id).to.have.equal('ldac');
                    done();
                });
        });
    });

    describe('GET /api/salas/admin/ldac', () => {
        it('it should get all rooms owned by ldac', (done) => {
            chai.request(app)
                .get('/api/salas/admin/ldac')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (3)
                    expect(res.body.length).be.eql(3);
                    done();
                });
        });
    });
})
