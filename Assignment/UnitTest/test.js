var assert = require('assert'); //link in assertion library
var http = require('http');

var server = require('../src/server/server')


describe('db User Tests', function() {
    before(function() {
        server.listen(8888)
    })

    after(function() {
        server.close()
    })

    describe('/userFind', function() {
        it('Should list all users' , function(done) {
            http.get('http://localhost/8888', function(response) {
                console.log
            })
        })
    })
})


describe('Tests for function one', () => {
    describe('Test Case 1 #fnOne()',() => {
        it('should return -1 when the value is not present', () => {
            assert.equal([1,2,3].indexOf(4), -1);
        });
    });

    describe('Test Case #fnOne()', () => {
        it('should return 3 as the value is present', () => {
            assert.equal([1,2,3,4,5].indexOf(4), 3);
        });
    });
});