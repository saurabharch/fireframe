/* projects route */
'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var Comment = mongoose.model('Comment');
var Team = mongoose.model('Team');
var auth = require('../authentication');
var _ = require('lodash');


router.param('id', function(req, res, next, id) {
	Project.findById(id)
  .populate('wireframes', 'screenshotUrl master parent children createdAt updatedAt')
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
    }).populate('creator', 'email')
    .populate('wireframes', 'screenshotUrl master');
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
    res.status(201).json(wireframe);
  })
  .then(null, next)
});

//get single project
router.get('/:id', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  Comment.find({
    project: req.project._id
  })
  .then(comments => {
    var project = req.project.toObject();
    project.comments = comments;
    res.json(project);
  })
  .then(null, next)
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
  req.project.remove()
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

router.post('/:id/comments', auth.ensureTeamMemberOrAdmin, function(req, res, next) {
  Comment.create({
    content: req.body.content,
    user: req.user._id,
    project: req.project._id
  })
  .then(comment => {
    res.json(comment);
  })
  .then(null, next)
});