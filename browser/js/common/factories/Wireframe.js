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

			// $http.get(path+"56f2eb90d80966d3e68ad845")
			// .then(extractData)
			// .then(data => {
			// 	console.log(data);
			// })

			// $http.get(path)
			// .then(extractData)
			// .then(data => {
			// 	console.log(data);
			// })

			// $http.post(path, {name: 'randooo'})
			// .then(extractData)
			// .then(data => {
			// 	console.log(data);
			// })

			return $http.get(path+"56f2bd912b013bd3e1e7b643"+'/wireframes/'+"56f2f5e9f3b22bfee78e0531"+'/fork')
			.then(extractData)
			.then(wireframe => {
				Firebase.createRoom(wireframe, scope);
				return wireframe;
			})
			.catch($log);			

			// return $http.put(path+"56f2c30a87e99846e3a2fd49"+'/wireframes/'+"56f2c30a87e99846e3a2fd4a", wireframe)
			// .then(extractData);
		},

		setMaster: function(projectId, wireframeId) {
			return $http.put(path+projectId+'/wireframes/'+wireframe._id+'/master')
			.then(extractData);
		}
	};

	return factory;

});