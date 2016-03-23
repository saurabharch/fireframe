var mongoose = require('mongoose');
var Component = mongoose.model('Component');
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
	canvasImg: String,
	photoUrl: String

});

WireframeSchema.methods.populateComponents = function() {
	var wireframe = this;
	Component.find({
		wireframe: wireframe._id
	})
	.then(function(components) {
		wireframe.components = components;
		return wireframe;
	});
};

WireframeSchema.methods.clone = function(oldWireframe) {
	var wireframeCopy;
	var clonedWireframe;

	//copy properties from old wire frame
	_.merge(wireframeCopy, oldWireframe);

	//set as new document, and save current id as parent
	wireframeCopy.isNew = true;
	wireframeCopy.parent = oldWireframe._id;

	//create new wireframe with copied obj
	Wireframe.create(wireframeCopy)
	.then(function(wireframe) {
		clonedWireframe = wireframe;
		//add the new wireframe to the old one's list of children, and save
		oldWireframe.children.push(wireframe._id);
		return oldWireframe.save();
	})
	.then(function() {
		//copy components for new wireframe
		return Component.create(
			oldWireframe.components.map(function(component) {
				component.wireframe = clonedWireframe._id;
				component.isNew = true;
				return component;
			})
		);
	})
	.then(function(components) {
		clonedWireframe.components = components;
		return clonedWireframe;
	})
}

WireframeSchema.methods.deleteWithComponents = function() {
	var wireframe = this;
	Component.remove({
		wireframe: wireframe._id
	})
	.then(function() {
		return wireframe.remove()
	});
}

WireframeSchema.methods.saveWithComponents = function(updatedWireframe) {
	var wireframe = this;
	var newWireframe;
	_.merge(wireframe, updatedWireframe);
	
	//save wireframe, remove old components, and replace with new ones
	return wireframe.save()
	.then(function(frame) {
		newWireframe = frame;
		return Component.remove({
			wireframe: frame._id
		});
	})
	.then(function() {
		//set each component with the wireframe id, save array of components
		return Component.create(
			wireframe.components.map(function(component) {
				component.wireframe = newWireframe._id;
				return component;
			})
		)
	});
}

WireframeSchema.methods.setMaster = function() {
	var wireframe = this;
	Wireframe.findOne({
		project: wireframe.project._id,
		master: true
	})
	.then(function(oldMaster) {
		oldMaster.master = false
		return oldMaster.save()
	})
	.then(function(oldMaster) {
		wireframe.master = true;
		return wireframe.save();
	})
}

mongoose.model('Wireframe', WireframeSchema);