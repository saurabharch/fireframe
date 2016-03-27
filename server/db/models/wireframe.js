var mongoose = require('mongoose');
// var Project = mongoose.model('Project');
var _ = require('lodash');

var WireframeSchema = new mongoose.Schema({

	master: {
		type:Boolean,
		default:false
	},
	// project: {
	// 	type:mongoose.Schema.Types.ObjectId, 
	// 	ref:'Project'
	// },
	parent: {
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Wireframe', default:null
	},
	children: [{
		type:mongoose.Schema.Types.ObjectId, 
		ref:'Wireframe'
	}],
	components: {
		type: Array
	},
	screenshotUrl: {
		type: String
	}

});


WireframeSchema.methods.clone = function(project) {
	var oldWireframe = this;
	var wireframeCopy = {};
	var clonedWireframe;
	//set as new document, and save current id as parent
	wireframeCopy.components = oldWireframe.components;
	wireframeCopy.isNew = true;
	wireframeCopy.parent = oldWireframe._id;
	console.log('oldWireframe is ',oldWireframe);

	//create new wireframe with copied obj
	return Wireframe.create(wireframeCopy)
	.then(function(wireframe) {
		clonedWireframe = wireframe;
		console.log('clonedWireframe is ', clonedWireframe);

		//add the new wireframe to the old one's list of children, and save
		oldWireframe.children.addToSet(wireframe._id);
		return oldWireframe.save();
	})
	.then(function() {
		project.wireframes.addToSet(clonedWireframe._id);
		return project.save();
	})
	.then(function() {
		return clonedWireframe;
	});
};

WireframeSchema.methods.saveWithComponents = function(updatedWireframe) {
	var wireframe = this;
	var newWireframe;
	wireframe.components = updatedWireframe.components;
	return wireframe.save();
};

var Wireframe = mongoose.model('Wireframe', WireframeSchema);




