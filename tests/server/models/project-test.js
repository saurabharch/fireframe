var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

// Require in all models.
require('../../../server/db/models');

var Project = mongoose.model('Project');
var Wireframe = mongoose.model('Wireframe');

describe('Project model', function() {

  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('methods', function() {
  
      var projOne, projTwo, projThree;
      beforeEach(function(done) {
        Promise.all([
          Project.create({name: "Creating a Test Project"})
          .then(function(project) {
            projOne = project;
          }),
          Project.create({name: "Another Test Project"})
          .then(function(project) {
            projTwo = project;
          }),
          Project.create({name: "And a third Test Project"})
          .then(function(project) {
            projThree = project;
          })
        ])
        .then(function(){done()}, function(err) {
          done(err);
        });
      });

      afterEach(function() {
        return Project.remove();
      });

    it('deletes a project', function(done) {
      projOne.deleteProject()
      .then(function(project) {
        console.log("this project should be the deleted one", project);
        expect(projOne).to.not.exist;
        done();
      })
      .then(function(){done()}, function(err) {
        done(err);
      });
    });

  });

});