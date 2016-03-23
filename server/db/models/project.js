var mongoose = require('mongoose');
var Wireframe = mongoose.model('Wireframe');

var ProjectSchema = new mongoose.Schema({

	name: {
		type:String,
		required:true
	},
	team: {
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Team',
		//required:true
	},
	type: String

});

ProjectSchema.statics.createNewProject = function(project) {
	Project.create(project)
	.then(function(newProject) {
		return Wireframe.create({
			project: newProject._id,
			master: true
		})
	})
};

ProjectSchema.methods.deleteProject = function() {
	var project = this;

	Wireframe.find({
		project: project._id
	})
	.then(function(wireframes) {
		var deletions = [];

		wireframes.forEach(function(wireframe) {
			deletions.push(wireframe.deleteWithComponents())
		})
		console.log(wireframes);
		return Promise.all(deletions);
	})
	.then(function() {
		return project.remove();
	});
};

var Project = mongoose.model('Project', ProjectSchema);