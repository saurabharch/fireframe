// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Project = mongoose.model('Project');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');
var agent = supertest.agent(app);

describe('Projects Route', function() {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });
  var user;
  describe('`/` URI', function() {
    beforeEach(function(done) {
      User.create({
        firstName: "Test",
        lastName: "McTest",
        email: "test@test.com",
        password: "test",
      }, function(err, u) {
        if (err) return done(err);
        user = u;
        done();
      })
    });

    var newProject;
    beforeEach(function(done) {
      Project.create({
        name: "Test Project Posting"
      }, function(err, p) {
        if (err) return done(err);
        newProject = p;
        done();
      });
    });

    // var newProj;
    // it('POST creates a new project and a new wireframe for that project', function(done) {
    //   agent
    //   .post('/')
    //   .send({
    //     name: "Test Post project"
    //   })
    //   .expect(201)
    //   .end(function(err, res) {
    //     if (err) return done(err);
    //     newProj = res.body;
    //     console.log(newProj, "the res in the post test???");
    //     done();
    //   });
    // });

    it('DELETES a project', function(done) {
      agent
      .delete('/' + newProject._id)
      .expect(404)
      .end(done);
    })
    
});


})
