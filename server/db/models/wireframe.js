var mongoose = require('mongoose');
//var Project = mongoose.model('Project');
var _ = require('lodash');

var WireframeSchema = new mongoose.Schema({

	master: {
		type:Boolean,
		default:false
	},
	project: {
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Project'
	},
	parent: {
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Wireframe', default:null
	},
	children: [{
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Wireframe'
	}],
	components: Array,
	photoUrl: String

});

WireframeSchema.methods.clone = function() {
	var oldWireframe = this;
	var wireframeCopy = {};
	var clonedWireframe;

	//set as new document, and save current id as parent
	wireframeCopy.components = oldWireframe.components;
	wireframeCopy.project = oldWireframe.project;
	wireframeCopy.isNew = true;
	wireframeCopy.parent = oldWireframe._id;

	//create new wireframe with copied obj
	return Wireframe.create(wireframeCopy)
	.then(function(wireframe) {
		clonedWireframe = wireframe;

		//add the new wireframe to the old one's list of children, and save
		oldWireframe.children.addToSet(wireframe._id);
		return oldWireframe.save();
	})
	.then(function(wireframe) {
		//find parent project and add to it's set of wireframes
		return mongoose.model('Project').findById(wireframe.project)
	})
	.then(function(project) {
		project.wireframes.addToSet(clonedWireframe._id);
		return project.save();
	})
	.then(function() {
		return clonedWireframe;
	})
}

WireframeSchema.methods.saveWithComponents = function(updatedWireframe) {
	var wireframe = this;
	var newWireframe;

	wireframe.components = [];
	_.merge(wireframe, updatedWireframe);
	console.log(wireframe, 'do I have all my new components?');

	return wireframe.save();

}

var Wireframe = mongoose.model('Wireframe', WireframeSchema);




