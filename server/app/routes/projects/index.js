/* projects route */

'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var WireframeRouter = require('./wireframe');
var CommentRouter = require('./comment');
var auth = require('../authentication');

router.param('id', function(req, res, next, id) {
	Project.findById(id)
  .populate('wireframes', 'master photoUrl parent children')
  .populate('team', 'members administrator')
  .populate('comments')
	.then(project => {
		if (project) {
      req.project = project;
      next();
    } else {
      var err = new Error('Something went wrong.');
      err.status = 404;
      next(err);
    }
	})
	.then(null, next)
});

router.use('/:id/wireframes', WireframeRouter);
router.use('/:id/comments', CommentRouter);

//get all wireframes for current project
router.get('/', function(req, res, next) {
	Wireframe.find()
  .then(projects => {
    res.json(projects);
  })
  .then(null, next)
});

//create new project
router.post('/', auth.ensureUser, function(req, res, next) {
  //should we set req.user as administrator?
  Project.create(req.body)
  .then(project => {
    res.json(project);
  })
  .then(null, next)
});

//get single project
router.get('/:id', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  res.json(req.project);
});

//edit single project
router.put('/:id', auth.ensureTeamAdmin, function(req, res, next) {
  _.merge(req.project, req.body);

  req.project.save()
  .then(function(project){
    res.json(project);
  })
  .then(null, next);
});

//delete single project
router.delete('/:id', auth.ensureTeamAdmin, function(req, res, next) {
  req.project.deleteProject()
  .then(function() {
    res.sendStatus(204)
  })
  .then(null, next);
});