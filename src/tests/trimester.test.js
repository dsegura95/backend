//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
var expect = chai.expect;

chai.use(chaiHttp);

/*
TRIMESTER
*/
describe('Trimester', () => {
    /*
     * Test the /GET info about reservation request
     */
    describe('GET /api/trimestre/ultimo', () => {
        it('it should get the actual trimester or last trimester', (done) => {
            chai.request(app)
                .get('/api/trimestre/ultimo')
                .end((err, res) => {
                    // need status 200
                    expect(res).to.have.status(200)
                    // need type array
                    expect(res.body).be.a('array');
                    // Values (last trimester in qa db)
                    expect(res.body[0].id).to.have.equal('ENE-MAR2020');
                    done();
                });
        });
    })

    /*
     * Test the /PUT
     */
    describe('PUT /api/trimestre/ENE-MAR2020', () => {
        it('it should update date of ENE-MAR2020', (done) => {
            let updatedDate = {
                start: "2020-01-2",
                finish: "2020-05-13"
            }
            chai.request(app)
                .put('/api/trimestre/ENE-MAR2020')
                .send(updatedDate)
                .end((err, res) => {
                    // status: 200
                    expect(res).to.have.status(200)
                    // type: object
                    expect(res.body).be.a('object');
                    // message: Item <name> actualizado
                    expect(res.body.message).to.have.equal(`Trimestre actualizado`)
                    done();
                });
        });
    });
});