app.factory('Wireframe', function($http, $log, Component) {
	var path = '/api/wireframes/';
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
			return $http.get('/api/projects/'+projectId+'/wireframes/')
			.then(extractData)
			.catch($log);
		},

		fetchOne: function(wireframeId) {
			return $http.get(path + wireframeId)
			.then(extractData)
			.catch($log);
		},

		//fork should be invoked after moving to the editor state
		//we can display a loading screen while we resolve the wireframe fork and create the firebase room based on the returned id
		fork: function(wireframeId, projectId) {
			return $http.post(path+wireframeId+'/fork', {id: projectId})
			.then(extractData)
			.catch($log);
		},

		save: function(wireframe) {
			wireframe.components = Component.saveComponents();

			return $http.put(path+wireframe._id, wireframe)
			.then(extractData);
		},

		setMaster: function(wireframeId, projectId) {
			return $http.put(path+wireframeId+'/master', {id: projectId})
			.then(extractData);
		}
	};

	return factory;

});