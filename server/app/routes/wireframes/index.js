/* Wireframe Routes */
'use strict';
var router = require('express').Router();
module.exports = router;

var Promise = require('bluebird');
var Readable = require('stream').Readable;
var webshot = Promise.promisifyAll(require('webshot'));
var image = require('../imageUpload.js');
var Firebase = require('firebase');

var mongoose = require('mongoose');
var Wireframe = mongoose.model('Wireframe');
var Project = mongoose.model('Project');
var auth = require('../authentication');

router.use(auth.ensureTeamMemberOrAdmin);

//find wireframe and populate it with its components
router.param('id', function(req, res, next, id) {
	Wireframe.findById(id)
	.then(wireframe => {
		if (wireframe) {
      req.wireframe = wireframe;
      next();
    } else {
      var err = new Error('Something went wrong.');
      err.status = 404;
      next(err);
    }
	})
	.then(null, next)
});

//save new wireframe
router.post('/', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  Wireframe.create(req.body)
  .then(() => {
    res.sendStatus(201);
  })
  .then(null, next)
});

//get single wireframe
router.get('/:id', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  console.log(req.wireframe)
  //return wireframe with components
  res.json(req.wireframe);
});


//edit current wireframe

router.put('/:id', function(req, res, next) {
  var options = {
    windowSize: {
      width: 1024,
      height: 768
    },
    renderDelay: 2000
  };

  //Save wireframe with components to DB before capturing screen
  req.wireframe.saveWithComponents(req.body)
  .then(function() {
    /**
     * Webshot (phantomJS wrapper) goes to '/phantom/:id',
     * components are loaded from DB, and webshot
     * captures screen
     */ 
    return webshot("http://www.firefra.me/phantom/"+req.params.id, options);
  })
  .then(function(stream) {
    return new Readable().wrap(stream);
  })
  .then(function(imageData) {
    //Image is uploaded to AWS S3
    return image.upload(req.params.id, imageData);
  })
  .then(function(imageUrl) {
    //Image url is saved to respective wireframe in DB
    req.wireframe.set({ screenshotUrl: imageUrl });
    return req.wireframe.save();
  })
  .then(function(wireframe) {
    res.json(wireframe);
  })
  .then(null, next);
});

router.post('/:id/upload', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  var imageUpload = req.body.imageData.split(',');
  var imageData = new Buffer(imageUpload[1], 'base64');
  var imageName = req.body.componentId + Math.round(Math.random()*10000);
  image.upload(imageName, imageData)
  .then(imageUrl => {
    var firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" +
                                req.body.projectId + "/wireframes/" + req.params.id + 
                                "/components/" + req.body.componentId);    
    return firebase.child('style').update({"background-image": "url(" + imageUrl + ")"});
  })
  .then(function() {
    res.sendStatus(201);
  })
  .then(null, next);

});

//delete single wireframe
//do we want to remove this? only able to delete whole projects, thus saving all versions
router.delete('/:id', auth.ensureTeamAdmin, function(req, res, next) {
  req.wireframe.remove()
  .then(function() {
    res.sendStatus(204)
  })
  .then(null, next);
});

//fork a wireframe
router.post('/:id/fork', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  //returns new wireframe, with new instances of all components
  Project.findById(req.body.id)
  .then(function(project){
    return req.wireframe.clone(project)
  })
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
})

//set wireframe as new master
router.put('/:id/master', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  Project.setMaster(req.wireframe, req.body.id)
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
})