var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({

    project: { 
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Project', required: true 
    },
    user: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'User',
    	required: true 
    },
    content: {
    	type: String,
    	required: true 
    },
    time: { 
    	type: Date, 
    	default: Date.now 
    }

});

module.exports = ('Comment', CommentSchema);
