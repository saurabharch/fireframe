app.factory('Project', function($http, $log){

	function extractData(res) {
		return res.data;
	}

	var factory = {

		fetchProject: function(projectId){
			return $http.get('/api/projects/'+projectId)
			.then(extractData)
			.catch($log);
		}

	};

	return factory;

});