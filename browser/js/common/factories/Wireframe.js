app.factory('Wireframe', function($http, $log, Firebase, Component, Screen) {
	var path = '/api/projects/';
	
	function extractData(res) {
		return res.data;
	}

	var factory = {
		fetchAll: function(projectId) {
			return $http.get(path+projectId+'/wireframes/')
			.then(extractData)
			.catch($log);
		},

		fetchOne: function(projectId, wireframeId) {
			return $http.get(path+projectId+'/wireframes/'+wireframeId)
			.then(extractData)
			.catch($log);
		},

		//fork should be invoked after moving to the editor state
		//we can display a loading screen while we resolve the wireframe fork and create the firebase room based on the returned id
		fork: function(projectId, wireframeId, scope) {
			return $http.get(path+projectId+'/wireframes/'+wireframeId+'/fork')
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

			return $http.put(path+"56f2c30a87e99846e3a2fd49"+'/wireframes/'+"56f2c30a87e99846e3a2fd4a", wireframe)
			.then(extractData);
		},

		setMaster: function(projectId, wireframeId) {
			return $http.put(path+projectId+'/wireframes/'+wireframe._id+'/master')
			.then(extractData);
		}
	}

	return factory;

});