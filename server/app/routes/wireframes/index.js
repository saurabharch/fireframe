/* wireframe route */
'use strict';
var router = require('express').Router();
module.exports = router;

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
  req.wireframe.saveWithComponents(req.body.id)
  .then(wireframe => {
    res.json(wireframe);
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
router.get('/:id/master', function(req, res, next) {
  Project.setMaster(req.wireframe)
  .then(wireframe => {
    res.json(wireframe);
  })
  .then(null, next);
})