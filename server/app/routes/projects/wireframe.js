/* projects/:id/wireframe route */
'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var Wireframe = mongoose.model('Wireframe');
var auth = require('../authentication');

router.use(auth.ensureTeamMemberOrAdmin);

//find wireframe and populate it with its components
router.param('wireframeId', function(req, res, next, wireframeId) {
	Wireframe.findOne(wireframeId)
	.then(wireframe => {
		if (wireframe) {
      return wireframe.populateComponents();
    } else {
      var err = new Error('Something went wrong.');
      err.status = 404;
      next(err);
    }
	})
  .then(wireframe => {
    req.wireframe = wireframe;
    next();
  })
	.then(null, next)
});

//get all wireframes for a project
router.get('/', auth.ensureAdmin, function(req, res, next) {
	Wireframe.find({
    project: req.project._id
  })
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
  req.wireframe.saveWithComponents(req.body)
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
});

//delete single wireframe
//do we want to remove this? only able to delete whole projects, thus saving all versions
router.delete('/:wireframeId', auth.ensureTeamAdmin, function(req, res, next) {
  req.wireframe.deleteWithComponents()
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
  req.wireframe.setMaster()
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
})