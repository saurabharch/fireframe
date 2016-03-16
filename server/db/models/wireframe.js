var mongoose = require('mongoose');

var WireframeSchema = new mongoose.Schema({

	master: Boolean,
	components: [{type:mongoose.Schema.Types.ObjectId, ref:'Component'}],
	parent: {type:mongoose.Schema.Types.ObjectId, ref:'Wireframe', default:null},
	children: [{type:mongoose.Schema.Types.ObjectId, ref:'Wireframe'}],
	photoUrl: String,
	comments: [{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]

});

module.exports = ('Wireframe', WireframeSchema);