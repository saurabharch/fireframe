/* projects/:id/wireframe route */
'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var Wireframe = mongoose.model('Wireframe');
var Project = mongoose.model('Project');
var auth = require('../authentication');

router.use(auth.ensureTeamMemberOrAdmin);

//find wireframe and populate it with its components
router.param('wireframeId', function(req, res, next, wireframeId) {
	Wireframe.findOne(wireframeId)
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

//get all wireframes for a project
router.get('/', auth.ensureAdmin, function(req, res, next) {
	req.project
  .populate('wireframes')
  .execPopulate()
  .then(wireframes => {
    res.json(wireframes);
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
router.get('/:wireframeId', function(req, res, next) {
  //return wireframe with components
  res.json(req.wireframe);
});

//edit current wireframe
router.put('/:wireframeId', function(req, res, next) {
  console.log('made it hurr')
  req.wireframe.saveWithComponents(req.body)
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
});

//delete single wireframe
//do we want to remove this? only able to delete whole projects, thus saving all versions
router.delete('/:wireframeId', auth.ensureTeamAdmin, function(req, res, next) {
  req.wireframe.remove()
  .then(function() {
    res.sendStatus(204)
  })
  .then(null, next);
});

//fork a wireframe
router.get('/:wireframeId/fork', function(req, res, next) {
  //returns new wireframe, with new instances of all components
  req.wireframe.clone()
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
})

//set wireframe as new master
router.get('/:wireframeId/master', function(req, res, next) {
  Project.setMaster(req.wireframe)
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
})