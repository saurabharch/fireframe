'use strict';
var router = require('express').Router();
module.exports = router;

var _ = require('lodash'),
    auth = require('../authentication'),

    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Team = mongoose.model('Team'),
    ProjectRouter = require('../projects');

router.post('/', function(req, res, next){
	Team.create(req.body)
	.then(team => res.json(team));
});