/* wireframe route */
'use strict';
var router = require('express').Router();
module.exports = router;

var webshot = require('webshot');
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
router.post('/', function(req, res, next) {
  Wireframe.create(req.body)
  .then(() => {
    res.sendStatus(201);
  })
  .then(null, next)
});

//get single wireframe
router.get('/:id', function(req, res, next) {
  console.log(req.wireframe)
  //return wireframe with components
  res.json(req.wireframe);
});

//edit current wireframe
router.put('/:id', function(req, res, next) {
  var w;
  var options = {
    windowSize: {
      width: 1024,
      height: 768
    },
    renderDelay: 2000,
    //takeShotOnCallback: true
  };

  req.wireframe.saveWithComponents(req.body)
  .then(function(wireframe) {
    w = wireframe;
    //Screen capture
    webshot("http://localhost:1337/phantom/"+req.params.id, req.params.id+".png", options, function(err){});
  })
  .then(function() {
    res.json(w);
  })
  .then(null, next);
});

router.post('/:id/upload', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  var imageUpload = req.body.imageData.split(',');
  //req.body.imageData => split on comma, take [1] => new Buffer( base 64 string, 'base64') => fs.writeFile(buffer) or s3.upload(b)
  var image = new Buffer(imageUpload[1], 'base64');
  //s3.upload(image)?
  //on return of image, connect to firebase room and update background of element
  //var firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" +
                                //req.body.projectId + "/wireframes/" + req.params.id + 
                                //"/components/" + componentId);
  //console.log(firebase);
  res.sendStatus(201);
})

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
router.post('/:id/fork', function(req, res, next) {
  //returns new wireframe, with new instances of all components
  Project.findById(req.body.id)
  .then(function(project){
    return req.wireframe.clone(project)
  })
  .then(wireframe => {
    console.log(wireframe);
    res.json(wireframe);
  })
  .then(null, next);
})

//set wireframe as new master
router.put('/:id/master', function(req, res, next) {
  Project.setMaster(req.wireframe, req.body.id)
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
})