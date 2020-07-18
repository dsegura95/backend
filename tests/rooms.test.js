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
     * Test the /GET rooms.
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
                    expect(res.body.length).be.eql(7);
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
                    expect(res.body.length).be.equal(3);
                    done();
                });
        });
    });

    describe('GET /api/salas/MYS-019/picture', () => {
        it('it should get an image of MYS-019 (or default)  ', (done) => {
            chai.request(app)
                .get('/api/salas/MYS-019/picture')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    done();
                });
        });
    });

    /*
     * Test the /POST
     */
    describe('POST /api/salas/crear', () => {
        it('it should create new room: TES-001', (done) => {
            let room = {
                id: "TES-001",
                name: "Sala de pruebas",
                owner_id: "cchang",
                manager_id: "ldac",
                is_active: true,
                description: "sala de pruebas del ldac para el backend",
                first_used: "2020-03-03"
            }
            chai.request(app)
                .post('/api/salas/crear')
                .send(room)
                .end((err, res) => {
                    // status: 201
                    expect(res).to.have.status(201)
                    // type: object message
                    expect(res.body).be.a('object');
                    // message: Sala <name> Creada
                    expect(res.body.message).to.have.equal( `Sala ${room.id} Creada`)
                    done();
                });
        });
    });

    /*
     * Test the /PUT
     */
    describe('PUT /api/salas/TES-001', () => {
        it('it should update last room:  Sala de pruebas to Saladepruebas', (done) => {
            let id = "TES-001"
            let roomUpdate = {
                name: "Saladepruebas",
                is_active: false,
                description: "sala de pruebas modificada",
            }
            chai.request(app)
                .put('/api/salas/' + id)
                .send(roomUpdate)
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: object
                    expect(res.body).be.a('object');
                    // message: Item <name> actualizado
                    expect(res.body.message).to.have.equal(`Sala Actualizada`)
                    done();
                });
        });
    });

})


/*
ITEMS EN LAS SALAS
*/
describe('Items in room', () => {
    /*
     * Testing /GETs
     */
    describe('GET /api/salas/MYS-019/items', () => {
        it('it should get all room items from MYS-019 ', (done) => {
            chai.request(app)
                .get('/api/salas/MYS-019/items')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (3)
                    expect(res.body.length).be.eql(5);
                    done();
                });
        });
    });

    describe('GET /api/not/items/MYS-019', () => {
        it('it should get all room items not owned by MYS-019 ', (done) => {
            chai.request(app)
                .get('/api/not/items/MYS-019')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length (3)
                    expect(res.body.length).be.eql(6);
                    done();
                });
        });
    });

    /*
     * Test the /POST
     */
    describe('POST /api/salas/MYS-019/8', () => {
        it('it should add new item: Mesas x 12', (done) => {
            let item = {
                quantity: 12,
            }
            chai.request(app)
                .post('/api/salas/MYS-019/8')
                .send(item)
                .end((err, res) => {
                    // status: 201
                    expect(res).to.have.status(201)
                    // type: object message
                    expect(res.body).be.a('object');
                    // message: <quantity> items asignados a Sala <room_id>
                    expect(res.body.message).to.have.equal( item.quantity + ' items asignados a Sala MYS-019')
                    done();
                });
        });
    });

    /*
     * Test the /PUT
     */
    describe('PUT /api/salas/MYS-019/8', () => {
        it('it should update item Mesas quantity to 24', (done) => {
            let id = 8
            let itemUpdate = {
                quantity: 24
            }
            chai.request(app)
                .put('/api/salas/MYS-019/' + id)
                .send(itemUpdate)
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: object
                    expect(res.body).be.a('object');
                    // message: Item <name> actualizado
                    expect(res.body.message).to.have.equal(`Item actualizado en Sala MYS-019`)
                    done();
                });
        });
    });

    /*
     * Test the /DELETE
     */
    describe('DELETE /api/salas/MYS-019/8', () => {
        it('it should delete last item created: Mesas x 24 ', (done) => {
            chai.request(app)
                .delete('/api/salas/MYS-019/8')
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: array
                    expect(res.body).be.a('array');
                    // need length (3)
                    expect(res.body.length).be.eql(5);
                    done();
                });
        });
    });


})

