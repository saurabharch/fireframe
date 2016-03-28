/* projects route */
'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Team = mongoose.model('Team');
var auth = require('../authentication');


router.param('id', function(req, res, next, id) {
	Project.findById(id)
  .populate('wireframes', 'photoUrl master parent children')
  .deepPopulate(['team.members', 'team.administrator'])
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

//get all projects
router.get('/', function(req, res, next) {
  var id = req.user._id;
  //find all projects that the user is a member of, or the creator of
  Team.find({
    $or: [{ members: id }, { creator: id }]
  })
  .then(teams => {
    return Project.find({
      $or: [{ creator: id }, { team: { $in: teams }}]
    }).populate('creator', 'email');
  })
  .then(projects => {
    res.json(projects);
  })
  .then(null, next)
});

//create new project
//also create first wireframe for the project
router.post('/', auth.ensureUser, function(req, res, next) {
  req.body.creator = req.user._id;
  Project.createNewProject(req.body)
  .then(wireframe => {
    res.json(wireframe);
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

//get all wireframes for a project
router.get('/:id/wireframes', auth.ensureAdmin, function(req, res, next) {
  req.project
  .populate('wireframes')
  .execPopulate()
  .then(wireframes => {
    res.json(wireframes);
  })
  .then(null, next)
});