var mongoose = require('mongoose');
var Component = mongoose.model('Component');

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
	photoUrl: String

});

WireframeSchema.methods.populateComponents = function() {
	var wireframe = this;
	Component.find({
		wireframe: wireframe._id
	})
	.then(components => {
		wireframe.components = components;
		return wireframe;
	});
};

WireframeSchema.statics.createWireframeAndComponents = function(frame) {
	Wireframe.create(frame)
	.then(function(wireframe) {
		var components = [];
		
		frame.components.forEach(function(component) {
			components.push(Component.create(component))
		});
		
		return Promise.all(components);
	});
}

WireframeSchema.methods.deleteWithComponents = function() {
	var wireframe = this;
	Component.remove({
		wireframe: wireframe._id
	})
	.then(() => {
		return wireframe.remove()
	});
}

mongoose.model('Wireframe', WireframeSchema);