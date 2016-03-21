/* projects/:id/comments route */
'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var auth = require('../authentication');

router.use(auth.ensureTeamMemberOrAdmin);

router.param('commentId', function(req, res, next, commentId) {
	Comment.findById(commentId)
	.then(comment => {
		if (comment) {
      req.comment = comment;
      next();
    } else {
      var err = new Error('Something went wrong.');
      err.status = 404;
      next(err);
    }
	})
	.then(null, next)
});

//get all comments
router.get('/', function(req, res, next) {
	Comment.find()
  .then(comment => {
    res.json(comment);
  })
  .then(null, next)
});

//create new comment
router.post('/', function(req, res, next) {
  Comment.create(req.body)
  .then(comment => {
    res.json(comment);
  })
  .then(null, next)
});

//get single comment
router.get('/:id', function(req, res, next) {
  res.json(req.comment);
});

//edit single comment
router.put('/:id', function(req, res, next) {
  _.merge(req.comment, req.body);

  req.comment.save()
  .then(function(comment){
    res.json(comment);
  })
  .then(null, next);
});

//delete single comment
router.delete('/:id', auth.ensureTeamAdmin, function(req, res, next) {
  req.comment.remove()
  .then(function() {
    res.sendStatus(204)
  })
  .then(null, next);
});