var mongoose = require('mongoose');
var Component = mongoose.model('Component');
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
	components: Array,
	photoUrl: String

});

// WireframeSchema.methods.populateComponents = function() {
// 	var wireframe = this;
// 	return Component.find({
// 		wireframe: wireframe._id
// 	})
// 	.then(function(components) {
// 		wireframe.components = components;
// 		return wireframe;
// 	});
// };
WireframeSchema.methods.setMaster = function(wireframe) {
	var project = this;
	return Wireframe.findOne({
		project: project._id,
		master: true
	})
	.then(function(oldMaster) {
		oldMaster.master = false
		return oldMaster.save()
	})
	.then(function() {
		wireframe.master = true;
		return wireframe.save();
	})
}

WireframeSchema.methods.clone = function() {
	var oldWireframe = this;
	var wireframeCopy;
	var clonedWireframe;

	//copy properties from oldWireframe so we can add to and save oldWireframe later
	_.merge(wireframeCopy, oldWireframe);
	console.log('Do i have all the components?', wireframeCopy);

	//set as new document, and save current id as parent
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
	.then(function() {
		return clonedWireframe;
	})
}

// WireframeSchema.methods.deleteWithComponents = function() {
// 	var wireframe = this;
// 	return Component.remove({
// 		wireframe: wireframe._id
// 	})
// 	.then(function() {
// 		return wireframe.remove()
// 	});
// }

WireframeSchema.methods.saveWithComponents = function(updatedWireframe) {
	var wireframe = this;
	var newWireframe;

	wireframe.components = [];
	_.merge(wireframe, updatedWireframe);
	console.log(wireframe, 'do I have all my new components?');

	return wireframe.save();

	//save wireframe, remove old components, and replace with new ones
	// return wireframe.save()
	// .then(function(frame) {
	// 	newWireframe = frame;
	// 	return Component.remove({
	// 		wireframe: frame._id
	// 	});
	// })
	// .then(function() {
	// 	//set each component with the wireframe id, save array of components
	// 	return Component.create(
	// 		wireframe.components.map(function(component) {
	// 			component.wireframe = newWireframe._id;
	// 			return component;
	// 		})
	// 	)
	// });

}

// WireframeSchema.methods.setMaster = function() {
// 	var wireframe = this;
// 	return Wireframe.findOne({
// 		project: wireframe.project._id,
// 		master: true
// 	})
// 	.then(function(oldMaster) {
// 		oldMaster.master = false
// 		return oldMaster.save()
// 	})
// 	.then(function(oldMaster) {
// 		wireframe.master = true;
// 		return wireframe.save();
// 	})
// }

mongoose.model('Wireframe', WireframeSchema);