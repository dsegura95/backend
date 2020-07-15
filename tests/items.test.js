//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
var expect = chai.expect;


chai.use(chaiHttp);

/*
SUBJECTS
*/
describe('Subjects', () => {
    /*
     * Test the /GET subjects.
     */
    describe('GET /api/subjects', () => {
        it('it should get 21 subjects', (done) => {
            chai.request(app)
                .get('/api/subjects')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length 21
                    expect(res.body.length).be.eql(21);
                    done();
                });
        });
    });
});

/*
ITEMS
*/
describe('Items', () => {
    /*
     * Test the /GET items
     */
    describe('GET /api/items', () => {
        it('it should get 11 items', (done) => {
            chai.request(app)
                .get('/api/items')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length 21
                    expect(res.body.length).be.eql(11);
                    done();
                });
        });
    });

    describe('GET /api/items/1', () => {
        it('it should get specific item: Mouse', (done) => {
            chai.request(app)
                .get('/api/items/1')
                .end((err, res) => {
                    const element = res.body[0]
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // need length 1
                    expect(res.body.length).be.eql(1);
                    // Values => id: 1, name: Mouse, description: null
                    expect(element.id).to.have.equal("1");
                    expect(element.name).to.have.equal('Mouse');
                    expect(element.description).to.have.equal(null);
                    done();
                });
        });
    });

    describe('POST /api/item', () => {
        it('it should create new item ItemPrueba', (done) => {
            let item = {
                name: "ItemPrueba",
                description: "descriptionPrueba"
            }
            chai.request(app)
                .post('/api/item')
                .send(item)
                .end((err, res) => {
                    // status: 201
                    expect(res).to.have.status(201)
                    // type: object
                    expect(res.body).be.a('object');
                    // message: Item <name> creado
                    expect(res.body.message).to.have.equal('Item ' + item.name + ' creado')
                    done();
                });
        });
    });

    describe('PUT /api/items/12', () => {
        it('it should update last item: ItemPrueba to ItemPrueba2', (done) => {
            let id = 12
            let itemUpdate = {
                name: "ItemPrueba2",
                description: "descriptionPrueba2"
            }
            chai.request(app)
                .put('/api/items/' + id)
                .send(itemUpdate)
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: object
                    expect(res.body).be.a('object');
                    // message: Item <name> actualizado
                    expect(res.body.message).to.have.equal(`Item ${id} actualizado`)
                    done();
                });
        });
    });

    describe('DELETE /api/items/12', () => {
        it('it should delete last item created: ItemPrueba ', (done) => {
            let id = 12
            chai.request(app)
                .delete('/api/items/' + id)
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: object
                    expect(res.body).be.a('object');
                    // message: Item Id: <id> Eliminado correctamente
                    expect(res.body.message).to.have.equal('Item Id: ' + id + ' Eliminado correctamente')
                    done();
                });
        });
    });
});
