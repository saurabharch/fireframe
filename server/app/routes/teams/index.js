/* TEAMS ROUTES */
'use strict';
var router = require('express').Router();
module.exports = router;

var _ = require('lodash'),
    auth = require('../authentication'),

    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Team = mongoose.model('Team'),
    ProjectRouter = require('../projects');

//Get all existing teams
router.get('/', function(req, res, next) {
	Team.find({})
	.then(teams => {
		res.json(teams);
	})
	.then(null, next);
});

router.post('/', function(req, res, next) {
	Team.createAndAddMembers(req.body)
	.then(team => {
		res.json(team);
	})
	.then(null, next);
});