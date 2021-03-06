app.factory('Wireframe', function($http, $log) {
	var path = '/api/wireframes/';
	var wireframe;
	
	function extractData(res) {
		return res.data;
	}

	function attachComponents(wireframe, components) {
		wireframe.components = components.map(component => {
			delete component.id;
			return component;
		})
	}

	var factory = {
		getWireframe: function(){
			return wireframe;
		},

		setWireframe: function(weirfraem){
			wireframe = weirfraem;
		},

		fetchAll: function(projectId) {
			return $http.get('/api/projects/'+projectId+'/wireframes/')
			.then(extractData)
			.catch($log);
		},

		fetchOne: function(wireframeId) {
			return $http.get(path + wireframeId)
			.then(extractData)
			.catch($log);
		},

		fork: function(wireframeId, projectId) {
			return $http.post(path+wireframeId+'/fork', {id: projectId})
			.then(extractData)
			.catch($log);
		},

		save: function(wireframe, components) {
			attachComponents(wireframe, components);

			return $http.put(path+wireframe._id, wireframe)
			.then(extractData);
		},

		setMaster: function(wireframeId, projectId) {
			return $http.put(path+wireframeId+'/master', {id: projectId})
			.then(extractData);
		},

		uploadImage: function(projectId, wireframeId, componentId, file) {
			return $http.post(path+wireframeId+'/upload', {
				projectId: projectId,
				componentId: componentId,
				imageData: file,
			})
		}
	};

	return factory;

});