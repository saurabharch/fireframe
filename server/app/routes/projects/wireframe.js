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

//router.use('/:wireframeId/comments', CommentRouter);

//get all wireframes for a project
//do we need this route?
router.get('/', auth.ensureAdmin, function(req, res, next) {
	Wireframe.find()
  .then(wireframes => {
    res.json(wireframes);
  })
  .then(null, next)
});

//save new wireframe
router.post('/', function(req, res, next) {
  Wireframe.createWireframeAndComponents(req.body)
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

//edit single wireframe
router.put('/:wireframeId', function(req, res, next) {
  _.merge(req.wireframe, req.body);

  req.wireframe.save()
  .then(function(wireframe){
    res.json(wireframe);
  })
  .then(null, next);
});

//delete single wireframe
router.delete('/:wireframeId', auth.ensureTeamAdmin, function(req, res, next) {
  req.project.remove()
  .then(function() {
    res.sendStatus(204)
  })
  .then(null, next);
});