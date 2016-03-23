app.factory('Wireframe', function($http, $log, Firebase) {
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
			$http.get(path+projectId+'/wireframe/')
			.then(extractData)
			.catch($log);
		},

		fetchOne: function(projectId, wireframeId) {
			$http.get(path+projectId+'/wireframe/'+wireframeId)
			.then(extractData)
			.catch($log);
		},

		//fork should be invoked after moving to the editor state
		//we can display a loading screen while we resolve the wireframe fork and create the firebase room based on the returned id
		fork: function(projectId, wireframeId, scope) {
			$http.get(path+projectId+'/wireframe/'+wireframeId+'/fork')
			.then(extractData)
			.then(wireframe => {
				Firebase.createRoom(wireframe, scope);
				return wireframe;
			})
			.catch($log);
		},

		save: function(projectId, wireframe) {
			$http.put(path+projectId+'/wireframe/'+wireframe._id, wireframe)
			.then(extractData);
		},

		setMaster: function(projectId, wireframeId) {
			$http.put(path+projectId+'/wireframe/'+wireframe._id+'/master')
			.then(extractData);
		}
	};

	return factory;

});