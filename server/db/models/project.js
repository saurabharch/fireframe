var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({

	name: {
		type:String,
		required:true
	},
	team: {
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Team',
		required:true
	},
	wireframes: [{
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Wireframe'
	}],
	type: String,

});

module.exports = ('Project', ProjectSchema);