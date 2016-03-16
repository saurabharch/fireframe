var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({

	name: String,
	team: {type:mongoose.Schema.Types.ObjectId, ref:'Team'},
	wireframes: [{type:mongoose.Schema.Types.ObjectId, ref:'Wireframe'}],
	type: String,

});

module.exports = ('Project', ProjectSchema);