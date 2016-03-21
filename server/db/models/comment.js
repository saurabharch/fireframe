var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({

    project: { 
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Project', required: true 
    },
    wireframe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wireframe', required: true 
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

CommentSchema.pre('validate', function(next) {
  if (this.project || this.wireframe) {
    next();
  } else {
    next(new Error('Comments must belong to either a project or a wireframe.'));
  }
});
    
mongoose.model('Comment', CommentSchema);
