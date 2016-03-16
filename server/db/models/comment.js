var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({

	project: {type:mongoose.Schema.Types.ObjectId, ref:'Project'},
	user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
	content: String,
	time: {type:Date, default:Date.now}

});

module.exports = ('Comment', CommentSchema);