var assert = require('assert');
var app = require('../src/server/server.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

describe('Server test', function() {
    // The function passed to before() is called before running the test cases.
    before(function() {
       app.listen(3000);
    });

    // The function passed to after() is called after running the test cases.
    after(function() {
        console.log("after test");
    });

    describe('/userFind', () => {
        it('it should GET all the users', (done) => {
            chai.request(app)
                .get('/userFind')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    // res.body.length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('/userInsert', () => {
        it('it should indert a doc', (done) => {
            chai.request(app).post('/userInsert').type('form').send({ 'username': 'Chai', 'password': '123', 'email': "Chai@tea.com", 'groups': [], 'roles':["superAdmin"] })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    res.body.should.have.property('email');
                    res.body.should.have.property('groups');
                    res.body.should.have.property('roles');
                    console.log(res.body);
                    done();
                });
        });
    });


});