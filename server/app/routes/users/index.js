/* USER ROUTES */
'use strict';
var router = require('express').Router();
module.exports = router;

var _ = require('lodash'),
    auth = require('../authentication'),

    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Team = mongoose.model('Team'),
    ProjectRouter = require('../projects');

router.param('id', function(req, res, next, id) {
  User.findById(id)
  .populate('projects.wireframe.photoUrl')
  .then(user => {
    if (user) {
      req.currentUser = user;
      next();
    } else {
      var err = new Error('Something went wrong.');
      err.status = 404;
      next(err);
    }
  })
  .then(null, next);
});

//get all users
router.get('/', auth.ensureAdmin, function(req, res, next) {
  User.find({}).exec()
  .then(function(allUsers) {
    res.send(allUsers);
  })
  .then(null, next);
});

//nested sub-routers
// router.use('/:id/projects/', ProjectRouter);
// router.use('/:id/teams/', TeamRouter);

//get user by ID
router.get('/:id', auth.ensureCurrentUserOrAdmin, function(req, res, next) {
  res.json(req.currentUser);
});

//get Teams user is a part of
router.get('/:id/teams', function(req, res, next){
  var id = req.params.id;
  Team.find({
    $or: [{ members: id }, { administrator: id }]
  })
  .populate('administrator members')
  .then(function(teams){
    res.json(teams || []);
  })
  .then(null, next);
});

//add user
router.post('/', auth.ensureAdmin, function(req, res, next) {
  User.create(req.body)
  .then(function(user) {
    res.json(user.sanitize());
  })
  .then(null, next);
});

//update user
router.put('/:id', auth.ensureCurrentUserOrAdmin, function(req, res, next) {
  _.merge(req.currentUser, req.body);
  
  if(!req.user.admin) {
    req.currentUser.admin = false;
  }
  req.currentUser.save()
  .then(function(user) {
    if (req.body.password && user.resetPassword) {
      user.resetPassword = false;
    }
    return user.save();
  })
  .then(function(user){
    res.json(user.sanitize());
  })
  .then(null, next);
  
});

//delete user
router.delete('/:id', auth.ensureAdmin, function(req, res, next) {
  req.currentUser.remove()
  .then(function() {
    res.sendStatus(204);
  })
  .then(null, next);
});