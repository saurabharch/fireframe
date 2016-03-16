var mongoose = require('mongoose');
var enums = []

var ProjectSchema = new mongoose.Schema({

	name: String,
	type: String,

});

module.exports = ('Project', ProjectSchema);