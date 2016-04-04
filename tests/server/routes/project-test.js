// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Project = mongoose.model('Project');
var User = mongoose.model('User');
var http = require('http')

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
  describe('/api/projects/ URI', function() {
    var userInfo = {
        firstName: "Test",
        lastName: "McTest",
        email: "test@test.com",
        password: "test",
      };

    var loggedInAgent;
    beforeEach(function(done) {
      User.create(userInfo, done);
    });

    beforeEach('Create loggedIn user agent and authenticate', function (done) {
      loggedInAgent = supertest.agent(app);
      loggedInAgent.post('/login').send(userInfo).end(done);
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

    it('CREATES a project', function(done) {
      loggedInAgent
      .post('/api/projects/')
      .send({name:"Fake project"})
      .expect(201)
      .end(done);
    });

    it('READS a project', function(done){
      loggedInAgent
      .get('/api/projects/'+newProject._id)
      .end(function(err,res){
        if(err) return done(err);
        expect(res.body.name).to.equal(newProject.name);
        done();
      });
    });

    it('UPDATES a project', function(done) {
      loggedInAgent
      .put('/api/projects/'+newProject._id)
      .send({name:"Changed test name"})
      .end(function(err,res){
        if(err) return done(err);
        expect(res.body.name).to.equal("Changed test name");
        done();
      });
    });

    it('DELETES a project', function(done) {
      loggedInAgent
      .delete('/api/projects/' + newProject._id)
      .expect(204)
      .end(done);
    });
    
});


})
