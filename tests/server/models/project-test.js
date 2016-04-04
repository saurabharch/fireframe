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
  
      var projOne, projTwo, projThree, wf;

      beforeEach(function(done) {
        Promise.all([
          Project.create({
            name: "Creating a Test Project"
          })
          .then(function(project) {
            projOne = project;
          }),

          Project.create({
            name: "Another Test Project"
          })
          .then(function(project) {
            project.wireframes = [];
            projTwo = project;
            return Wireframe.create({master:false})
          })
          .then(function(newWireframe) {
            wf = newWireframe;
            projTwo.wireframes.push(newWireframe._id);
            return Wireframe.create({master:true})
          })
          .then(function(newMasterWireframe) {
            projTwo.wireframes.push(newMasterWireframe._id);
            projTwo.save();
          }),

          Project.create({
            name: "And a third Test Project"
          })
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

    it('sets a master wireframe', function(done) {
      Project.setMaster(projTwo.wireframes[0], projTwo._id)
      .then(function(newMasterWireframe) {
        expect(newMasterWireframe._id.toString()).to.be.equal(projTwo.wireframes[0].toString());
        expect(newMasterWireframe.master).to.be.true;
        done();
      })
      .then(null, function(err) {
        done(err);
      });
    });

    it('deletes a project', function(done) {
      projOne.deleteProject()
      .then(function(deletedProject) {
        return Project.findById(deletedProject._id);
        })
      .then(function(project){
        expect(project).to.be.null;
        done();
      })
      .then(null, function(err) {
        done(err);
      });
    });

  });

});