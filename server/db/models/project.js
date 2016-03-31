var mongoose = require('mongoose');
var Wireframe = mongoose.model('Wireframe');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var ProjectSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		minlength: 5,
		maxlength: 100
	},
	team: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Team',
		//required:true
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User',
	},
	wireframes: [{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Wireframe',
	}],
	category: {
		type: String
	},
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	}
});


ProjectSchema.plugin(deepPopulate);

ProjectSchema.pre('validate', function(next){
  this.updated_at = Date.now();
  if ( !this.created_at ) {
    this.created_at = Date.now();
  }
  next();
});

ProjectSchema.statics.createNewProject = function(project) {
	var wireframe;

	return Wireframe.create({
		master: true
	})
	.then(function(createdWireframe) {
		//convert to object so we can set project ID, which is needed for firebase connection
		wireframe = createdWireframe.toObject();
		project.wireframes = [wireframe._id];
		return Project.create(project);
	})
	.then(function(project) {
		//set project ID and return;
		wireframe.project = project._id;
		return wireframe;
	});

};

ProjectSchema.statics.setMaster = function(wireframeId, projectId) {
	return Project.findById(projectId)
	.then(function(project){
		var projectWireframes = project.wireframes;
		return Wireframe.find({
			master: true,
			_id: { $in: projectWireframes}
		});
	})
	.then(function(oldMaster) {
		oldMaster[0].master = false;
		return oldMaster[0].save();
	})
	.then(function() {
		return Wireframe.findById(wireframeId);
	})
	.then(function(wireframe) {
		wireframe.master = true;
		return wireframe.save();
	});
};

var Project = mongoose.model('Project', ProjectSchema);