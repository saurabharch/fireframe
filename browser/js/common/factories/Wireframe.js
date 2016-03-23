app.factory('Wireframe', function($http, $log, Firebase, Component, Screen) {
	var path = '/api/projects/';
	var wireframe;
	
	function extractData(res) {
		return res.data;
	}

	var factory = {
		getWireframe: function(){
			return wireframe;
		},

		setWireframe: function(weirfraem){
			wireframe = weirfraem;
		},

		fetchAll: function(projectId) {
			return $http.get(path+projectId+'/wireframe/')
			.then(extractData)
			.catch($log);
		},

		fetchOne: function(projectId, wireframeId) {
			return $http.get(path+projectId+'/wireframe/'+wireframeId)
			.then(extractData)
			.catch($log);
		},

		//fork should be invoked after moving to the editor state
		//we can display a loading screen while we resolve the wireframe fork and create the firebase room based on the returned id
		fork: function(projectId, wireframeId, scope) {
			return $http.get(path+projectId+'/wireframe/'+wireframeId+'/fork')
			.then(extractData)
			.then(wireframe => {
				Firebase.createRoom(wireframe, scope);
				return wireframe;
			})
			.catch($log);
		},

		save: function(previousWireframe) {
			var wireframe = {};
			wireframe.project = previousWireframe.project;
			wireframe.components = Component.saveComponents();
			wireframe.canvasImg = Screen.capture();

$http.post(path, {name: 'proj'})

			// return $http.put(path+previousWireframe.project+'/wireframe/'+wireframe._id, wireframe)
			// .then(extractData);
		},

		setMaster: function(projectId, wireframeId) {
			return $http.put(path+projectId+'/wireframe/'+wireframe._id+'/master')
			.then(extractData);
		}
	};

	return factory;

});