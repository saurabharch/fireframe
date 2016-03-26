/* Wireframe Routes */
'use strict';
var router = require('express').Router();
module.exports = router;

var Readable = require('stream').Readable;
var webshot = require('webshot');
var image = require('../imageUpload.js');

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
  var imageUrl;
  var options = {
    windowSize: {
      width: 1024,
      height: 768
    },
    takeShotOnCallback: true
  };

  req.wireframe.saveWithComponents(req.body)
  .then(function(wireframe) {
    w = wireframe;

    //Capture  screen and upload to AWS S3
    webshot("http://localhost:1337/phantom/"+req.params.id, function(err, stream) {
      if(err) return console.log(err);
      var imageData = new Readable().wrap(stream);
      imageUrl = image.upload(req.params.id, imageData);
    });  

  })
  // .then(function() {
    
  // })
  .then(function() {
    res.json(w);
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