/* user routes */

'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var User = mongoose.model('User');

router.param('id', function(req, res, next, id) {
  User.findById(id)
  .populate('projects')
  .then(user => {
    req.currentUser = user;
    next();
  })
  .then(null, next);
});


//get all projects for specific user
router.get('/', function(req, res, next) {
  User.find({}).exec()
  .then(projects => res.send(projects))
  .then(null, next);
});