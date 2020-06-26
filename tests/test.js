//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
var expect = chai.expect;


chai.use(chaiHttp);

// Subjects
describe('Subjects', () => {
    /*
     * Test the /GET subjects.
     */
    describe('GET /api/subjects', () => {
        it('it should GET all the subjects', (done) => {
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
