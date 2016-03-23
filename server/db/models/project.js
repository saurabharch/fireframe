var mongoose = require('mongoose');
var Wireframe = mongoose.model('Wireframe');

var ProjectSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
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
	type: String //what is this for?

});

ProjectSchema.statics.createNewProject = function(project) {
	var createdProject;
	var createdWireframe;

	return Project.create(project)
	.then(function(newProject) {
		createdProject = newProject;
		return Wireframe.create({
			project: newProject._id,
			master: true
		})
	})
	.then(function(wireframe) {
		createdWireframe = wireframe;
		createdProject.wireframes.addToSet(wireframe._id);
		return createdProject.save();
	})
	.then(function() {
		return createdWireframe;
	})
};

ProjectSchema.methods.deleteProject = function() {
	var project = this;

	// return Wireframe.find({
	// 	project: project._id
	// })
	// 	.then(function(wireframes) {
	// 	var deletions = [];

	// 	wireframes.forEach(function(wireframe) {
	// 		deletions.push(wireframe.deleteWithComponents())
	// 	})
	// 	console.log(wireframes);
	// 	return Promise.all(deletions);
	// })
	return project.remove()
	// .then(function() {
	// 	return Wireframe.remove(project.wireframes)
	// });
};



var Project = mongoose.model('Project', ProjectSchema);